from django.urls import path
from media import views

urlpatterns = [
    path('', views.edit_all_media)
]