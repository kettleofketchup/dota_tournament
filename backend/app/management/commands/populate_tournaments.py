import logging

from django.core.management.base import BaseCommand

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = "Populate the database with 5 tournaments containing random users"

    def add_arguments(self, parser):
        parser.add_argument(
            "--force",
            action="store_true",
            help="Force creation even if tournaments already exist",
        )

    def handle(self, *args, **options):
        force = options.get("force", False)

        from tests.populate import populate_tournaments

        try:
            self.stdout.write("Starting tournament population...")
            populate_tournaments(force=force)
            self.stdout.write(self.style.SUCCESS("Successfully populated tournaments!"))

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f"Error populating tournaments: {str(e)}")
            )
            logger.error(
                f"Error in populate_tournaments command: {str(e)}", exc_info=True
            )
            raise
