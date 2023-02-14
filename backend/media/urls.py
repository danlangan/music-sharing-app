from django.urls import path
from media import views

urlpatterns = [
    path('edit/<int:pk>/', views.edit_all_media),
    path('getAppleToken/', views.apple_music_jwt),
    path('getSpotifyToken/', views.spotify_jwt)
]