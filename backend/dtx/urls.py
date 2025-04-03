from .views import*
from django.urls import path

urlpatterns = [
    path('discord/', DiscordSocialAuthView.as_view()),
]