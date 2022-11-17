from django.db import models
from authentication.models import User

# Create your models here.


class Media(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    track = models.CharField(max_length=255, null=True, blank=True)
    album = models.CharField(max_length=255, null=True, blank=True)
    album_id = models.CharField(max_length=255, null=True, blank=True)
    playlist = models.CharField(max_length=255, null=True, blank=True)
    playlist_id = models.CharField(max_length=255, null=True, blank=True)
    track_link = models.CharField(max_length=255, null=True, blank=True)
    album_link = models.CharField(max_length=255, null=True, blank=True)
    playlist_link = models.CharField(max_length=255, null=True, blank=True)
    spotify = models.BooleanField(default=False)
    apple_music = models.BooleanField(default=False)