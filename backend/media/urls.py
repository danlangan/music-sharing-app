from django.urls import path
from media import views

urlpatterns = [
    path('edit/<int:pk>/', views.edit_all_media),
    path('getAppleToken/', views.apple_music_jwt),
    path('getSpotifyToken/', views.spotify_jwt),
    path('getSpotifyMediaInfo/', views.get_spotify_media_info),
    path('getAppleMusicMediaInfo/', views.get_apple_music_media_info),
    path('getAppleSharingUrl/', views.search_apple_music),
    path('getSpotifySharingUrl/', views.search_spotify)
]