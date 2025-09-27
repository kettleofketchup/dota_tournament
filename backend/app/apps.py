import logging

from django.apps import AppConfig

log = logging.getLogger(__name__)
import os


class AppConfig(AppConfig):
    name = "app"

    def ready(self):
        """
        This method is called when the app is ready.
        Invalidate cacheops cache on startup if Redis is available.
        """

        if os.environ.get("DISABLE_CACHE", "true").lower() != "true":

            log.warning("✅ Cacheops cache disabled via DISABLE_CACHE env var")

            return
        try:

            # Test Redis connectivity first
            from cacheops import invalidate_all

            invalidate_all()
            log.warning("✅ Cacheops cache invalidated on startup (app)")
        except Exception as e:
            log.warning(f"ℹ️  Skipping cache invalidation (Redis not available): {e}")
