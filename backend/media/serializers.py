from rest_framework import serializers
from .models import Media

class MediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        fields = ['id', 'user', 'user_id', 'track', 'track_link', 'album', 'album_link', 'album_id', 'playlist', 'playlist_link', 'playlist_id', 'spotify', 'apple_music']
        depth = 1