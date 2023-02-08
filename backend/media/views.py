# from base64 import b64encode
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


# Create your views here.

@api_view(['GET', 'POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def edit_all_media(request, pk):
    media = get_object_or_404(Media, pk)
    print(
        'User ', f"{request.user.id} {request.user.email} {request.user.username}"
    )
    if request.method == 'POST':
        serializer = MediaSerializer(media, many=True)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'GET':
        # media = Media.objects.all()
        serializer = MediaSerializer(media, many=True)
        return Response(serializer.data)
    elif request.method == 'DELETE':
        media.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    apple_music_jwt()
    spotify_jwt()
    
    #begin apple music jwt generation
    
    def apple_music_jwt():
        #payload for apple jwt
        apple_api_key = 'Y8F8JV7CXD'
        apple_team_id = 'A4NXNNBMQ6'
        apple_private_key = "MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgPBVMHz6WCDdR5oUzJut5eksbQKzhzUKkPgv8oIPPCV2gCgYIKoZIzj0DAQehRANCAASJGjzP8wcHWtUKepmIHhvZFG2ottaX6G//NYEZj+eXYzn4hi//w3ZMgmX1rT1Op/+kK3nwvxcRzshBVbEK8OoY"

        header = {
            "alg": "ES265",
            "kid": apple_api_key,
        }
        payload = {
            "iss": apple_team_id,
            "iat": int(time.time()),
            "exp": int(time.time()) + 86400,
        }
        # Generate the JWT
        apple_jwt_token = jwt.encode(header, payload, apple_private_key, algorithm="ES256").decode()
        
        print(apple_jwt_token)
        
        headers = {
            "Authorization": "Bearer " + apple_jwt_token,
            "User-Agent": "com.capstoneproject.musicsharingapp",
        }

        response = request.get("https://api.music.apple.com/v1/me", headers=headers)

        if response.status_code == 200:
            data = response.json
        else: 
            data = 'API request failed'
            print(f"API request failed with status code: {response.status_code}")

        return data

    #generate the spotify jwt

    def spotify_jwt():
        CLIENT_ID = 'fc41411f058f4c138544fe702e7ecc03'
        CLIENT_SECRET = 'cc91a30aee904fbf992156e53ee9831a'
        

        payload = {
            "iss": CLIENT_ID, 
            "exp": int(time.time()) + 3600, # Expiration time in seconds
            "iat": int(time.time())
        }
        
        spotify_jwt_token = jwt.encode(payload, CLIENT_SECRET, algorithm="RS256").decode("utf-8")

        print(spotify_jwt_token)

        # Return the access token to the React application
        return JsonResponse({"jwt": spotify_jwt_token})


# SECRET_KEY = 'django-secret-key-for-dCC-Capstone-urie_opqyiopnfdaskl4513547'

        # auth_response = RequestContext.post(
        # "https://accounts.spotify.com/api/token",
        #     headers={
        #     "Authorization": "Basic " + b64encode(f"{CLIENT_ID}:{CLIENT_SECRET}".encode("utf-8")).decode("utf-8"),
        #     "Content-Type": "application/x-www-form-urlencoded",
        #     },
        #     data={
        #     "grant_type": "client_credentials",
        #     },
        # )


        # # Extract the access token from the authentication response
        # access_token = auth_response.json()["access_token"]