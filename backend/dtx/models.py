from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
# Create your models here.



class User(AbstractUser):
    name = models.CharField(max_length=120)
    steamid = models.IntegerField(null=True)
    mmr = models.IntegerField(null=True)
    email = models.EmailField(unique=False)
    username = models.CharField(max_length=30, unique=True)
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=50, blank=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    created_date = models.DateTimeField(default=timezone.now)
    modified_date = models.DateTimeField(auto_now=True)
    created_by = models.DateTimeField(default=timezone.now)
    modified_by = models.DateTimeField(auto_now=True)
    auth_provider = models.CharField(max_length=50, blank=True, default='email')
    def _str_(self):
        return self.name
    

class Infraction(models.Model):
    description = models.TextField(null=True, )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
