from steam.models import MatchPlayer, Player
from django.db.models import Count, Avg

def compute_player_metrics(player: Player):
    matches = MatchPlayer.objects.filter(account=player)
    total_matches = matches.count()
    
    if total_matches == 0:
        return {
            "total_matches": 0,
            "winrate": 0,
            "most_played_hero": None,
            "avg_kills": 0,
            "avg_deaths": 0,
            "avg_assists": 0,
            "avg_kda": 0,
        }
    
    wins = matches.filter(win=1).count()
    most_played = matches.values('hero').annotate(
        count=Count('hero')
    ).order_by('-count').first()
    
    aggregates = matches.aggregate(
        avg_kills=Avg('kills'),
        avg_deaths=Avg('deaths'),
        avg_assists=Avg('assists'),
        avg_kda=Avg('kda'),
    )
    
    return {
        "total_matches": total_matches,
        "winrate": round((wins / total_matches) * 100, 2),
        "most_played_hero": most_played['hero'] if most_played else None,
        "most_played_hero_count": most_played['count'] if most_played else 0,
        "avg_kills": round(aggregates['avg_kills'], 2),
        "avg_deaths": round(aggregates['avg_deaths'], 2),
        "avg_assists": round(aggregates['avg_assists'], 2),
        "avg_kda": round(aggregates['avg_kda'], 2),
    }