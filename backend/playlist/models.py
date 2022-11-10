from django.db import models
from authentication.models import User

class Playlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    
# Create your models here.
