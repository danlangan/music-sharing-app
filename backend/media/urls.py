from django.urls import path, include
from media import views

urlpatterns = [
    path('', views.edit_all_media)
]