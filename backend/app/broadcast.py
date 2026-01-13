"""
Broadcast helper for sending draft events to WebSocket channel groups.
"""

import logging

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

from app.serializers import DraftEventSerializer

log = logging.getLogger(__name__)


def broadcast_event(event):
    """
    Broadcast a DraftEvent to both draft-specific and tournament channel groups.

    Args:
        event: DraftEvent instance to broadcast
    """
    channel_layer = get_channel_layer()
    if channel_layer is None:
        log.warning("No channel layer configured, skipping broadcast")
        return

    payload = DraftEventSerializer(event).data

    # Send to draft-specific channel
    async_to_sync(channel_layer.group_send)(
        f"draft_{event.draft_id}",
        {
            "type": "draft.event",
            "payload": payload,
        },
    )

    # Send to tournament channel
    tournament_id = event.draft.tournament_id
    async_to_sync(channel_layer.group_send)(
        f"tournament_{tournament_id}",
        {
            "type": "draft.event",
            "payload": payload,
        },
    )

    log.debug(
        f"Broadcast {event.event_type} to draft_{event.draft_id} and tournament_{tournament_id}"
    )
