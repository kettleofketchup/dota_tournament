from steam.models import LeagueTeam, Match, MatchPlayer, Objective, Pause, Pick, Player, Team
from steam.functions import compute_player_metrics, get_league_match_ids, get_league_match, update_or_create_player
from django.db import transaction
from time import sleep
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Count, Avg
from steam.serializers import MatchSerializer, PlayerSerializer

class MatchDetailView(APIView):
    def get(self, _, match_id):
        try:
            match = Match.objects.get(match_id=match_id)
        except Match.DoesNotExist:
            return Response(
                {"error": "Match not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = MatchSerializer(match)
        
        return Response(serializer.data)

class PlayerDetailView(APIView):
    def get(self, _, account_id):
        try:
            player = Player.objects.get(account_id=account_id)
        except Player.DoesNotExist:
            return Response(
                {"error": "Player not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        metrics = compute_player_metrics(player)
        serializer = PlayerSerializer(player)
        
        return Response({
            **dict(serializer.data),
            "metrics": metrics
        })

class SyncLeagueMatchesView(APIView):
    def get(self, _):
        players = Player.objects.all()
        leaderboard = []
        
        for player in players:
            metrics = compute_player_metrics(player)
            serializer = PlayerSerializer(player)
            leaderboard.append({
                **dict(serializer.data),
                "metrics": metrics
            })
        
        # TODO: Have a better rating system than pure winrate
        leaderboard.sort(key=lambda x: x['metrics']['winrate'], reverse=True)
        
        return Response(leaderboard)
    
    def post(self, _):
        match_ids = get_league_match_ids()
        existing_ids = set(Match.objects.filter(match_id__in=match_ids).values_list('match_id', flat=True))
        missing_ids = [int(mid) for mid in match_ids if int(mid) not in existing_ids]
        
        for match_id in missing_ids:
            data = get_league_match(match_id)
            
            with transaction.atomic():
                radiant_team = None
                dire_team = None
                if data.get('radiant_team'):
                    radiant_team, _ = LeagueTeam.objects.update_or_create(
                        team_id=data['radiant_team']['team_id'],
                        defaults={
                            'name': data['radiant_team'].get('name', ''),
                            'tag': data['radiant_team'].get('tag'),
                            'logo_url': data['radiant_team'].get('logo_url'),
                        }
                    )
                if data.get('dire_team'):
                    dire_team, _ = LeagueTeam.objects.update_or_create(
                        team_id=data['dire_team']['team_id'],
                        defaults={
                            'name': data['dire_team'].get('name', ''),
                            'tag': data['dire_team'].get('tag'),
                            'logo_url': data['dire_team'].get('logo_url'),
                        }
                    )
                
                gold_adv = data.get('radiant_gold_adv', [])
                radiant_win = data['radiant_win']
                
                loser_max_gold_adv = max([g for g in gold_adv if g > 0], default=0) if not radiant_win else max([-g for g in gold_adv if g < 0], default=0)
                loser_max_gold_disadv = min([g for g in gold_adv if g < 0], default=0) if not radiant_win else min([g for g in gold_adv if g > 0], default=0)
                winner_max_gold_adv = max([g for g in gold_adv if g > 0], default=0) if radiant_win else max([-g for g in gold_adv if g < 0], default=0)
                winner_max_gold_disadv = min([g for g in gold_adv if g < 0], default=0) if radiant_win else min([g for g in gold_adv if g > 0], default=0)
                
                match = Match.objects.create(
                    match_id=match_id,
                    winner=Team.RADIANT if radiant_win else Team.DIRE,
                    duration=data['duration'],
                    start_time=data['start_time'],
                    game_mode=data['game_mode'],
                    radiant_score=data['radiant_score'],
                    dire_score=data['dire_score'],
                    barracks_status_radiant=data['barracks_status_radiant'],
                    barracks_status_dire=data['barracks_status_dire'],
                    tower_status_radiant=data['tower_status_radiant'],
                    tower_status_dire=data['tower_status_dire'],
                    first_blood_time=data['first_blood_time'],
                    radiant_team=radiant_team,
                    dire_team=dire_team,
                    patch=data['patch'],
                    loser_max_gold_adv=loser_max_gold_adv,
                    loser_max_gold_disadv=abs(loser_max_gold_disadv),
                    winner_max_gold_adv=abs(winner_max_gold_adv),
                    winner_max_gold_disadv=abs(winner_max_gold_disadv),
                    replay_url=data.get('replay_url', ''),
                )
                
                for player_data in data['players']:
                    account_id = player_data['account_id']
                    
                    if not Player.objects.filter(account_id=account_id).exists():
                        update_or_create_player(account_id)
                        sleep(1)
                    
                    player = Player.objects.get(account_id=account_id)
                    
                    MatchPlayer.objects.create(
                        match=match,
                        account=player,
                        hero=player_data['hero_id'],
                        player_slot=player_data.get('player_slot'),
                        team=Team.RADIANT if player_data['isRadiant'] else Team.DIRE,
                        assists=player_data.get('assists', 0),
                        camps_stacked=player_data.get('camps_stacked', 0),
                        creeps_stacked=player_data.get('creeps_stacked', 0),
                        deaths=player_data.get('deaths', 0),
                        denies=player_data.get('denies', 0),
                        gold=player_data.get('gold', 0),
                        gold_per_min=player_data.get('gold_per_min', 0),
                        gold_spent=player_data.get('gold_spent', 0),
                        hero_damage=player_data.get('hero_damage', 0),
                        hero_healing=player_data.get('hero_healing', 0),
                        kills=player_data.get('kills', 0),
                        last_hits=player_data.get('last_hits', 0),
                        leaver_status=player_data.get('leaver_status', 0),
                        level=player_data.get('level', 0),
                        obs_placed=player_data.get('obs_placed', 0),
                        party_id=player_data.get('party_id'),
                        hero_variant=player_data.get('hero_variant', 0),
                        pings=player_data.get('pings', 0),
                        rune_pickups=player_data.get('rune_pickups', 0),
                        sen_placed=player_data.get('sen_placed', 0),
                        stuns=player_data.get('stuns', 0),
                        tower_damage=player_data.get('tower_damage', 0),
                        xp_per_min=player_data.get('xp_per_min', 0),
                        win=player_data.get('win', 0),
                        lose=player_data.get('lose', 0),
                        total_gold=player_data.get('total_gold', 0),
                        total_xp=player_data.get('total_xp', 0),
                        kills_per_min=player_data.get('kills_per_min', 0),
                        kda=player_data.get('kda', 0),
                        abandons=player_data.get('abandons', 0),
                        neutral_kills=player_data.get('neutral_kills', 0),
                        tower_kills=player_data.get('tower_kills', 0),
                        courier_kills=player_data.get('courier_kills', 0),
                        lane_kills=player_data.get('lane_kills', 0),
                        hero_kills=player_data.get('hero_kills', 0),
                        observer_kills=player_data.get('observer_kills', 0),
                        sentry_kills=player_data.get('sentry_kills', 0),
                        roshan_kills=player_data.get('roshan_kills', 0),
                        necronomicon_kills=player_data.get('necronomicon_kills', 0),
                        ancient_kills=player_data.get('ancient_kills', 0),
                        buyback_count=player_data.get('buyback_count', 0),
                        observer_uses=player_data.get('observer_uses', 0),
                        sentry_uses=player_data.get('sentry_uses', 0),
                        lane_efficiency=player_data.get('lane_efficiency'),
                        lane_efficiency_pct=player_data.get('lane_efficiency_pct'),
                        lane=player_data.get('lane'),
                        lane_role=player_data.get('lane_role'),
                        is_roaming=player_data.get('is_roaming'),
                        purchase_tpscroll=player_data.get('purchase_tpscroll', 0),
                        actions_per_min=player_data.get('actions_per_min', 0),
                        life_state_dead=player_data.get('life_state_dead', 0),
                        rank_tier=player_data.get('rank_tier'),
                    )
                
                for pause_data in data.get('pauses', []):
                    Pause.objects.create(
                        match=match,
                        time=pause_data['time'],
                        duration=pause_data['duration'],
                    )
                
                for obj_data in data.get('objectives', []):
                    Objective.objects.create(
                        match=match,
                        time=obj_data.get('time'),
                        type=obj_data.get('type', ''),
                        unit=obj_data.get('unit'),
                        key=obj_data.get('key'),
                        slot=obj_data.get('slot'),
                        player_slot=obj_data.get('player_slot'),
                        team=obj_data.get('team'),
                    )
                
                for pick_data in data.get('picks_bans', []):
                    Pick.objects.create(
                        match=match,
                        type=Pick.Type.PICK if pick_data['is_pick'] else Pick.Type.BAN,
                        hero=pick_data['hero_id'],
                        team=Team.RADIANT if pick_data['team'] == 0 else Team.DIRE,
                        order=pick_data['order'],
                    )
            
            sleep(1)

        return Response(
            { "synced": len(missing_ids) },
            status=status.HTTP_200_OK
        )