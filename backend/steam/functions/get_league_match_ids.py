import requests

from steam.constants import LEAGUE_ID

def get_league_match_ids():
    response = requests.get(f"https://api.opendota.com/api/leagues/{LEAGUE_ID}/matchIds")
    response.raise_for_status()
    
    return response.json()[:2]