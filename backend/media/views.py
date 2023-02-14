# from base64 import b64encode
from django.conf import SettingsReference
from django.http import JsonResponse
# from django.template import RequestContext
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from rest_framework.decorators import api_view, permission_classes
from .models import Media
from .serializers import MediaSerializer
from django.shortcuts import get_object_or_404
import jwt, time
import requests
# Create your views here.

@api_view(['GET', 'POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def edit_all_media(request):
    media = get_object_or_404(Media)
    print(
        'User ', f"{request.user.id} {request.user.email} {request.user.username}"
    )
    if request.method == 'POST':
        serializer = MediaSerializer(data=request.data)
        if serializer.is_valid():
            # apple_music_jwt()
            # spotify_jwt()
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'GET':
        media = Media.objects.all()
        serializer = MediaSerializer(media, many=True)
        return Response(serializer.data)
    
@api_view(['DELETE'])
def delete_media(request, pk):
    media = get_object_or_404(Media)
    if request.method == 'DELETE':
        media.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    #begin apple music jwt generation
@api_view(['GET'])
def apple_music_jwt(request):
    #payload for apple jwt
    apple_api_key = 'Y8F8JV7CXD'
    apple_team_id = 'A4NXNNBMQ6'
    apple_private_key = """
-----BEGIN PRIVATE KEY-----
MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgPBVMHz6WCDdR5oUz
Jut5eksbQKzhzUKkPgv8oIPPCV2gCgYIKoZIzj0DAQehRANCAASJGjzP8wcHWtUK
epmIHhvZFG2ottaX6G//NYEZj+eXYzn4hi//w3ZMgmX1rT1Op/+kK3nwvxcRzshB
VbEK8OoY
-----END PRIVATE KEY-----
"""
    header = {
        "kid": apple_api_key,
    }
    payload = {
        "iss": apple_team_id,
        "iat": int(time.time()),
        "exp": int(time.time()) + 86400,
    }
    # Generate the JWT
    apple_jwt_token = jwt.encode(payload, apple_private_key, algorithm="ES256", headers=header)
    
    print(apple_jwt_token)
    
    headers = {
        "Authorization": "Bearer " + apple_jwt_token,
        "User-Agent": "com.capstoneproject.musicsharingapp",
    }
    params ={'term':'Jack', 'limit':10}

    response = requests.get("https://api.music.apple.com/v1/catalog/us/search", headers=headers, params=params)
    print(response)
    # if response.status_code == 200:
    #     data = response.json
    # else: 
    #     data = 'API request failed'
    #     print(f"API request failed with status code: {response.status_code}")

    return Response({'music':response.json()})

#generate the spotify jwt
@api_view(['GET'])
def spotify_jwt(request):
    CLIENT_ID = 'fc41411f058f4c138544fe702e7ecc03'
    CLIENT_SECRET = 'cc91a30aee904fbf992156e53ee9831a'
    

    payload = {
        "iss": CLIENT_ID, 
        "exp": int(time.time()) + 3600, # Expiration time in seconds
        "iat": int(time.time())
    }
    
    spotify_jwt_token = jwt.encode(payload, CLIENT_SECRET, algorithm="HS256")

    print(spotify_jwt_token)

    # Return the access token to the React application
    return JsonResponse({"jwt": spotify_jwt_token})
