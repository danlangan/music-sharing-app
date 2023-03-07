from django.urls import path
from media import views

urlpatterns = [
    path('edit/<int:pk>/', views.edit_all_media),
    path('delete/<int:pk>/', views.delete_media),
    path('getSpotifyMediaInfo/', views.take_spotify_return_apple),
    path('getAppleMusicMediaInfo/', views.take_apple_return_spotify),
    path('getAppleSharingUrl/', views.search_apple_music),
    path('getSpotifySharingUrl/', views.search_spotify),
    path('getAppleToken/', views.apple_music_jwt)
]