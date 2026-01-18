import requests

from steam.models import Player

def update_or_create_player(account_id):
    response = requests.get(f"https://api.opendota.com/api/players/{account_id}")
    response.raise_for_status()
    data = response.json()
    
    player, _ = Player.objects.update_or_create(
        account_id=account_id,
        defaults={
            'steam_id': data['profile']['steamid'],
            'steam_name': data['profile'].get('personaname'),
            'avatar_url': data['profile'].get('avatarfull'),
            'profile_url': data['profile'].get('profileurl'),
            'plus': data['profile'].get('plus', False),
            'rank_tier': data.get('rank_tier'),
            'leaderboard_rank': data.get('leaderboard_rank'),
            'computed_mmr': data.get('computed_mmr'),
        }
    )

    return player