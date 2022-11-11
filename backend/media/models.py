from django.db import models
from authentication.models import User

# Create your models here.


class Media(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    track = models.CharField(max_length=255)
    album = models.CharField(max_length=255, null=True)
    album_id = models.CharField(max_length=255, null=True)
    playlist = models.CharField(max_length=255, null=True)
    playlist_id = models.CharField(max_length=255, null=True)
    track_link = models.CharField(max_length=255, null=True)
    album_link = models.CharField(max_length=255, null=True)
    playlist_link = models.CharField(max_length=255, null=True)