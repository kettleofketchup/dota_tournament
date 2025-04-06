from django.db import models
from social_django.models import (  # fix: skip
    USER_MODEL,
    AbstractUserSocialAuth,
    DjangoStorage,
)
from django.utils import timezone
from django.conf import settings
User = settings.AUTH_USER_MODEL
from django.contrib.auth.models import AbstractUser

class DotaInfo(models.Model):
    user = models.ForeignKey(
            USER_MODEL,
            name='dota',
            on_delete=models.CASCADE
    )
    steamid = models.IntegerField(null=True)
    mmr = models.IntegerField(null=True)
    position = models.TextField(null=True)


class CustomUser(AbstractUser):
    steamid = models.IntegerField(null=True)
    mmr = models.IntegerField(null=True)
    position = models.TextField(null=True)
    
# class CustomUserSocialAuth(AbstractUserSocialAuth):
#     user = models.ForeignKey(
#         USER_MODEL,on_delete=models.CASCADE,
        
#     )

# class CustomDjangoStorage(DjangoStorage):
#     user = CustomUserSocialAuth
