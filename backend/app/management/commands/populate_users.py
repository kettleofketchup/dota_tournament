import logging

from django.core.management.base import BaseCommand

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = "Populate the database with Discord users"

    def add_arguments(self, parser):
        parser.add_argument(
            "--force",
            action="store_true",
            help="Force populate even if there are already more than 100 users",
        )

    def handle(self, *args, **options):
        force = options.get("force", False)

        from tests.populate import populate_users

        try:
            self.stdout.write("Starting user population...")
            populate_users(force=force)
            self.stdout.write(
                self.style.SUCCESS("Successfully populated users from Discord!")
            )

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error populating users: {str(e)}"))
            logger.error(f"Error in populate_users command: {str(e)}", exc_info=True)
            raise
