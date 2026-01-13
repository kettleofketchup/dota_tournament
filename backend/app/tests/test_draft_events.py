# backend/app/tests/test_draft_events.py
from datetime import date
from unittest.mock import AsyncMock, MagicMock, patch

from django.test import TestCase

from app.models import CustomUser, Draft, DraftEvent, PositionsModel, Team, Tournament
from app.serializers import DraftEventSerializer


class DraftEventModelTest(TestCase):
    def setUp(self):
        # Create positions for users
        self.positions = PositionsModel.objects.create()

        # Create test user
        self.user = CustomUser.objects.create_user(
            username="testcaptain",
            password="testpass",
            positions=self.positions,
        )
        self.user.mmr = 5000
        self.user.save()

        # Create tournament
        self.tournament = Tournament.objects.create(
            name="Test Tournament",
            date_played=date.today(),
        )
        self.tournament.users.add(self.user)

        # Create team
        self.team = Team.objects.create(
            name="Test Team",
            tournament=self.tournament,
            captain=self.user,
        )

        # Create draft
        self.draft = Draft.objects.create(
            tournament=self.tournament,
            draft_style="shuffle",
        )

    def test_create_draft_started_event(self):
        """Can create a draft_started event."""
        event = DraftEvent.objects.create(
            draft=self.draft,
            event_type="draft_started",
            payload={
                "draft_id": self.draft.pk,
                "draft_style": "shuffle",
                "team_count": 4,
            },
        )
        self.assertEqual(event.event_type, "draft_started")
        self.assertEqual(event.payload["draft_style"], "shuffle")
        self.assertIsNone(event.actor)

    def test_create_player_picked_event_with_actor(self):
        """Can create a player_picked event with actor."""
        event = DraftEvent.objects.create(
            draft=self.draft,
            event_type="player_picked",
            payload={
                "round": 1,
                "captain_id": self.user.pk,
                "captain_name": self.user.username,
                "picked_id": self.user.pk,
                "picked_name": "SomePlayer",
                "team_id": self.team.pk,
            },
            actor=self.user,
        )
        self.assertEqual(event.event_type, "player_picked")
        self.assertEqual(event.actor, self.user)

    def test_create_tie_roll_event(self):
        """Can create a tie_roll event with roll data."""
        event = DraftEvent.objects.create(
            draft=self.draft,
            event_type="tie_roll",
            payload={
                "tied_captains": [
                    {"id": 1, "name": "CaptainA", "mmr": 5000},
                    {"id": 2, "name": "CaptainB", "mmr": 5000},
                ],
                "roll_rounds": [
                    [{"captain_id": 1, "roll": 4}, {"captain_id": 2, "roll": 6}]
                ],
                "winner_id": 2,
                "winner_name": "CaptainB",
            },
        )
        self.assertEqual(event.event_type, "tie_roll")
        self.assertEqual(len(event.payload["tied_captains"]), 2)
        self.assertEqual(event.payload["winner_id"], 2)

    def test_events_ordered_by_created_at_desc(self):
        """Events are ordered newest first."""
        event1 = DraftEvent.objects.create(
            draft=self.draft,
            event_type="draft_started",
            payload={},
        )
        event2 = DraftEvent.objects.create(
            draft=self.draft,
            event_type="player_picked",
            payload={},
        )
        events = list(DraftEvent.objects.all())
        self.assertEqual(events[0], event2)
        self.assertEqual(events[1], event1)


class DraftEventSerializerTest(TestCase):
    def setUp(self):
        self.positions = PositionsModel.objects.create()
        self.user = CustomUser.objects.create_user(
            username="testcaptain",
            password="testpass",
            positions=self.positions,
        )
        self.tournament = Tournament.objects.create(
            name="Test Tournament",
            date_played=date.today(),
        )
        self.draft = Draft.objects.create(
            tournament=self.tournament,
            draft_style="shuffle",
        )

    def test_serializer_contains_expected_fields(self):
        """Serializer includes all required fields."""
        event = DraftEvent.objects.create(
            draft=self.draft,
            event_type="player_picked",
            payload={"round": 1, "captain_name": "TestCaptain"},
            actor=self.user,
        )
        serializer = DraftEventSerializer(event)
        data = serializer.data

        self.assertIn("pk", data)
        self.assertIn("event_type", data)
        self.assertIn("payload", data)
        self.assertIn("actor", data)
        self.assertIn("created_at", data)
        self.assertEqual(data["event_type"], "player_picked")


class BroadcastEventTest(TestCase):
    def setUp(self):
        self.positions = PositionsModel.objects.create()
        self.user = CustomUser.objects.create_user(
            username="testcaptain",
            password="testpass",
            positions=self.positions,
        )
        self.tournament = Tournament.objects.create(
            name="Test Tournament",
            date_played=date.today(),
        )
        self.draft = Draft.objects.create(
            tournament=self.tournament,
            draft_style="shuffle",
        )

    @patch("app.broadcast.get_channel_layer")
    def test_broadcast_event_sends_to_draft_group(self, mock_get_channel_layer):
        """Broadcast sends event to draft channel group."""
        from app.broadcast import broadcast_event

        mock_channel_layer = MagicMock()
        mock_channel_layer.group_send = AsyncMock()
        mock_get_channel_layer.return_value = mock_channel_layer

        event = DraftEvent.objects.create(
            draft=self.draft,
            event_type="player_picked",
            payload={"round": 1},
        )

        broadcast_event(event)

        # Verify group_send was called for draft group
        calls = mock_channel_layer.group_send.call_args_list
        draft_call = [c for c in calls if f"draft_{self.draft.pk}" in str(c)]
        self.assertEqual(len(draft_call), 1)

    @patch("app.broadcast.get_channel_layer")
    def test_broadcast_event_sends_to_tournament_group(self, mock_get_channel_layer):
        """Broadcast sends event to tournament channel group."""
        from app.broadcast import broadcast_event

        mock_channel_layer = MagicMock()
        mock_channel_layer.group_send = AsyncMock()
        mock_get_channel_layer.return_value = mock_channel_layer

        event = DraftEvent.objects.create(
            draft=self.draft,
            event_type="player_picked",
            payload={"round": 1},
        )

        broadcast_event(event)

        # Verify group_send was called for tournament group
        calls = mock_channel_layer.group_send.call_args_list
        tournament_call = [
            c for c in calls if f"tournament_{self.tournament.pk}" in str(c)
        ]
        self.assertEqual(len(tournament_call), 1)
