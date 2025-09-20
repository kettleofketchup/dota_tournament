# views_test_auth.py
import logging
import token

from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import transaction
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from social_django.models import UserSocialAuth

from app.models import CustomUser
from common.utils import isTestEnvironment

log = logging.getLogger(__name__)


def get_social_token(user, provider="discord"):
    try:
        social = user.social_auth.get(provider=provider)
    except UserSocialAuth.DoesNotExist:
        log.warning("Social Auth Doesn't exist")
        return None
    # Access token
    access_token = social.extra_data.get("access_token")

    # If provider supports refresh tokens:
    refresh_token = social.extra_data.get("refresh_token")
    expires_at = social.extra_data.get("expires")
    csrftoken = social.extra_data.get("csrftoken")
    sessionid = social.extra_data.get("sessionid")

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "expires_at": expires_at,
        "csrftoken": csrftoken,
        "sessionid": sessionid,
    }


from django.db import transaction
from social_django.models import UserSocialAuth


def create_social_auth(user):
    if user.social_auth.filter(provider="discord").exists():

        if user.social_auth.get(provider="discord").extra_data.get("sessionid"):
            log.debug(
                f"Social auth has extra data: {user.social_auth.get(provider='discord').extra_data}"
            )
            return

    # Fake Discord user ID
    log.debug("getting or creating ")
    login
    social, created = UserSocialAuth.objects.get_or_create(
        user=user,
        provider="discord",
        uid=user.discordId,
        extra_data={
            "access_token": "cypress",
            "refresh_token": "cypress",
            "expires": 9999999999,  # far future
            "sessionid": "cypress",
            "csrftoken": "cypress",
        },
    )
    with transaction.atomic():
        log.debug("saving social auth")
        if created:
            social.save()
        user.save()


def createTestSuperUser() -> tuple[CustomUser, bool]:
    assert isTestEnvironment() == True
    uid = "243497113906970625"
    user, created = CustomUser.objects.get_or_create(
        username="kettleofketchup",
        discordId=uid,
        discordUsername="kettleofketchup",
    )
    if created:
        user.set_password("cypress")
        user.save()
    create_social_auth(user)

    if created or not user.is_superuser:
        user.is_staff = True

        user.is_superuser = True
        with transaction.atomic():
            user.check_and_update_avatar()
            user.save()

    return user, created


def createTestStaffUser() -> tuple[CustomUser, bool]:
    assert isTestEnvironment() == True
    uid = "702582402668560454"
    user, created = CustomUser.objects.get_or_create(
        username="hurk_",
        discordId=uid,
        discordUsername="hurk_",
    )
    if created:
        user.set_password("cypress")
        user.save()
    create_social_auth(user)

    if created or not user.is_staff:
        user.is_staff = True
        user.is_superuser = False
        with transaction.atomic():
            user.check_and_update_avatar()
            user.save()
    return user, created


from django.contrib.auth import login


def createTestUser() -> tuple[CustomUser, bool]:
    assert isTestEnvironment() == True
    uid = "198618246868500481"
    user, created = CustomUser.objects.get_or_create(
        username="bucketoffish55",
        discordId=uid,
        discordUsername="bucketoffish55",
    )

    if created:
        user.set_password("cypress")
        user.save()
    create_social_auth(user)

    if created or not user.is_superuser:
        user.is_staff = False
        user.is_superuser = False
        with transaction.atomic():
            user.check_and_update_avatar()
            user.save()

    return user, created


def return_tokens(user):
    tokens = get_social_token(user)
    log.debug(tokens)
    return Response({"social_tokens": tokens})


from django.test import Client


@api_view(["POST"])
@permission_classes([AllowAny])
def login_admin(request):
    if not isTestEnvironment(request):
        return Response({"detail": "Not Found"}, status=status.HTTP_404_NOT_FOUND)

    user, created = createTestSuperUser()

    login(
        request, user, backend="django.contrib.auth.backends.ModelBackend"
    )  # attaches user to request + session middleware
    return return_tokens(user)


@api_view(["POST"])
@permission_classes([AllowAny])
def login_staff(request):
    if not isTestEnvironment(request):
        return Response({"detail": "Not Found"}, status=status.HTTP_404_NOT_FOUND)

    user, created = createTestStaffUser()
    login(
        request, user, backend="django.contrib.auth.backends.ModelBackend"
    )  # attaches user to request + session middleware
    return return_tokens(user)


@api_view(["POST"])
@permission_classes([AllowAny])
def login_user(request):
    if not isTestEnvironment(request):
        return Response({"detail": "Not Found"}, status=status.HTTP_404_NOT_FOUND)

    user, created = createTestUser()
    login(
        request, user, backend="django.contrib.auth.backends.ModelBackend"
    )  # attaches user to request + session middleware

    return return_tokens(user)
