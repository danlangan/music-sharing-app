from rest_framework import serializers
from .models import Media

class MediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        fields = ['id', 'user', 'user_id', 'track', 'album', 'album_id', 'playlist', 'playlist_id']
        depth = 1