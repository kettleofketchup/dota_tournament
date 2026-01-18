import requests


def get_league_match(match_id):
    response = requests.get(f"https://api.opendota.com/api/matches/{match_id}")
    response.raise_for_status()
    
    return response.json()