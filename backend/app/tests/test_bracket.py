"""Tests for bracket save and team placement functionality."""

from datetime import date

from django.test import TestCase
from rest_framework.test import APIClient

from app.models import CustomUser, Game, Team, Tournament


class SaveBracketTest(TestCase):
    """Test save_bracket endpoint."""

    def setUp(self):
        """Create test data."""
        self.admin = CustomUser.objects.create_superuser(
            username="admin",
            password="admin123",
            email="admin@test.com",
        )
        self.tournament = Tournament.objects.create(
            name="Test Tournament",
            date_played=date.today(),
        )
        # Create 4 teams
        self.teams = []
        for i in range(4):
            captain = CustomUser.objects.create_user(
                username=f"captain{i}",
                password="test123",
                mmr=5000 - (i * 100),
            )
            team = Team.objects.create(
                name=f"Team {i+1}",
                captain=captain,
                tournament=self.tournament,
            )
            self.teams.append(team)

        self.client = APIClient()
        self.client.force_authenticate(user=self.admin)

    def test_save_bracket_creates_games(self):
        """Save bracket creates Game records for each match."""
        matches = [
            {
                "id": "w-1-0",
                "round": 1,
                "position": 0,
                "bracketType": "winners",
                "eliminationType": "double",
                "radiantTeam": {"pk": self.teams[0].pk},
                "direTeam": {"pk": self.teams[3].pk},
                "status": "pending",
                "nextMatchId": "w-2-0",
                "nextMatchSlot": "radiant",
                "loserNextMatchId": "l-1-0",
                "loserNextMatchSlot": "radiant",
            },
            {
                "id": "w-1-1",
                "round": 1,
                "position": 1,
                "bracketType": "winners",
                "eliminationType": "double",
                "radiantTeam": {"pk": self.teams[1].pk},
                "direTeam": {"pk": self.teams[2].pk},
                "status": "pending",
                "nextMatchId": "w-2-0",
                "nextMatchSlot": "dire",
                "loserNextMatchId": "l-1-0",
                "loserNextMatchSlot": "dire",
            },
            {
                "id": "w-2-0",
                "round": 2,
                "position": 0,
                "bracketType": "winners",
                "eliminationType": "double",
                "status": "pending",
                "nextMatchId": "gf-1-0",
                "nextMatchSlot": "radiant",
                "loserNextMatchId": "l-2-0",
                "loserNextMatchSlot": "dire",
            },
            {
                "id": "l-1-0",
                "round": 1,
                "position": 0,
                "bracketType": "losers",
                "eliminationType": "double",
                "status": "pending",
                "nextMatchId": "l-2-0",
                "nextMatchSlot": "radiant",
            },
            {
                "id": "l-2-0",
                "round": 2,
                "position": 0,
                "bracketType": "losers",
                "eliminationType": "double",
                "status": "pending",
                "nextMatchId": "gf-1-0",
                "nextMatchSlot": "dire",
            },
            {
                "id": "gf-1-0",
                "round": 1,
                "position": 0,
                "bracketType": "grand_finals",
                "eliminationType": "double",
                "status": "pending",
            },
        ]

        response = self.client.post(
            f"/api/bracket/tournaments/{self.tournament.pk}/save/",
            {"matches": matches},
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(Game.objects.filter(tournament=self.tournament).count(), 6)

    def test_save_bracket_wires_next_game_relationships(self):
        """Save bracket correctly sets next_game foreign keys."""
        matches = [
            {
                "id": "w-1-0",
                "round": 1,
                "position": 0,
                "bracketType": "winners",
                "eliminationType": "double",
                "status": "pending",
                "nextMatchId": "w-2-0",
                "nextMatchSlot": "radiant",
            },
            {
                "id": "w-2-0",
                "round": 2,
                "position": 0,
                "bracketType": "winners",
                "eliminationType": "double",
                "status": "pending",
            },
        ]

        self.client.post(
            f"/api/bracket/tournaments/{self.tournament.pk}/save/",
            {"matches": matches},
            format="json",
        )

        game_w1 = Game.objects.get(
            tournament=self.tournament, bracket_type="winners", round=1, position=0
        )
        game_w2 = Game.objects.get(
            tournament=self.tournament, bracket_type="winners", round=2, position=0
        )

        self.assertEqual(game_w1.next_game, game_w2)
        self.assertEqual(game_w1.next_game_slot, "radiant")

    def test_save_bracket_clears_existing_bracket_games(self):
        """Save bracket deletes existing bracket games before creating new ones."""
        # Create an existing game
        Game.objects.create(
            tournament=self.tournament,
            round=1,
            position=0,
            bracket_type="winners",
        )
        self.assertEqual(Game.objects.filter(tournament=self.tournament).count(), 1)

        # Save new bracket
        matches = [
            {
                "id": "w-1-0",
                "round": 1,
                "position": 0,
                "bracketType": "winners",
                "eliminationType": "double",
                "status": "pending",
            },
            {
                "id": "w-1-1",
                "round": 1,
                "position": 1,
                "bracketType": "winners",
                "eliminationType": "double",
                "status": "pending",
            },
        ]

        self.client.post(
            f"/api/bracket/tournaments/{self.tournament.pk}/save/",
            {"matches": matches},
            format="json",
        )

        # Should have 2 games (old one deleted, 2 new created)
        self.assertEqual(Game.objects.filter(tournament=self.tournament).count(), 2)

    def test_save_bracket_returns_games_with_pks(self):
        """Save bracket returns games with database PKs."""
        matches = [
            {
                "id": "w-1-0",
                "round": 1,
                "position": 0,
                "bracketType": "winners",
                "eliminationType": "double",
                "status": "pending",
            },
        ]

        response = self.client.post(
            f"/api/bracket/tournaments/{self.tournament.pk}/save/",
            {"matches": matches},
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertIn("matches", response.data)
        self.assertEqual(len(response.data["matches"]), 1)
        self.assertIn("pk", response.data["matches"][0])

    def test_save_bracket_requires_admin(self):
        """Save bracket requires admin permission."""
        regular_user = CustomUser.objects.create_user(
            username="regular",
            password="test123",
        )
        self.client.force_authenticate(user=regular_user)

        response = self.client.post(
            f"/api/bracket/tournaments/{self.tournament.pk}/save/",
            {"matches": []},
            format="json",
        )

        self.assertEqual(response.status_code, 403)
