# serializers.py
from rest_framework import serializers
from steam.models import Player, Match, MatchPlayer, LeagueTeam, Pause, Objective, Pick


class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = '__all__'


class LeagueTeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeagueTeam
        fields = '__all__'


class MatchPlayerSerializer(serializers.ModelSerializer):
    account = PlayerSerializer()
    hero_name = serializers.CharField(source='get_hero_display')
    
    class Meta:
        model = MatchPlayer
        fields = '__all__'


class PauseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pause
        fields = '__all__'


class ObjectiveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Objective
        fields = '__all__'


class PickSerializer(serializers.ModelSerializer):
    hero_name = serializers.CharField(source='get_hero_display')
    
    class Meta:
        model = Pick
        fields = '__all__'


class MatchSerializer(serializers.ModelSerializer):
    radiant_team = LeagueTeamSerializer()
    dire_team = LeagueTeamSerializer()
    players = MatchPlayerSerializer(many=True)
    pauses = PauseSerializer(many=True)
    objectives = ObjectiveSerializer(many=True)
    picks = PickSerializer(many=True)
    
    class Meta:
        model = Match
        fields = '__all__'