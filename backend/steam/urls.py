from django.urls import path
from . import views

urlpatterns = [
    path("match/<int:match_id>", views.MatchDetailView.as_view(), name="match_detail"),
    path("league", views.SyncLeagueMatchesView.as_view(), name="sync_league"),
    path("player/<int:account_id>", views.PlayerDetailView.as_view(), name="player_detail")
]