from base64 import b64encode
from django.http import JsonResponse
from django.template import RequestContext
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

@api_view(['GET'])
def apple_jwt(request):
    apple_api_key = 'Y8F8JV7CXD'
    apple_team_id = 'A4NXNNBMQ6'
    #payload for apple jwt
    header = {
        "alg": "ES265",
        "kid": apple_api_key,
    }
    payload = {
        "iss": apple_team_id,
        "iat": int(time.time())
    }
    # Signing jwt using private key
    apple_private_key = "MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgPBVMHz6WCDdR5oUzJut5eksbQKzhzUKkPgv8oIPPCV2gCgYIKoZIzj0DAQehRANCAASJGjzP8wcHWtUKepmIHhvZFG2ottaX6G//NYEZj+eXYzn4hi//w3ZMgmX1rT1Op/+kK3nwvxcRzshBVbEK8OoY"

    apple_jwt_token = jwt.encode(header, payload, apple_private_key, algorithm="HS256").decode('utf-8')

    headers = {
        "Authorization": "Bearer " + apple_jwt_token,
        "Music-User-Token": "<your_music_user_token>",
        }
    response = request.get("https://api.music.apple.com/v1/me", headers=headers)

    return Response({"token": apple_jwt_token})

@api_view(['POST'])
def spotify_jwt(request):
    CLIENT_ID = 'fc41411f058f4c138544fe702e7ecc03'
    CLIENT_SECRET = 'cc91a30aee904fbf992156e53ee9831a'
    SECRET_KEY = 'django-secret-key-for-dCC-Capstone-urie_opqyiopnfdaskl4513547'

    header = {
        "alg": "RS256",
        "typ": "JWT"
        }

    payload = {
        "iss": CLIENT_ID, 
        "exp": int(time.time()) + 3600, # Expiration time in seconds
        "iat": int(time.time()),
        }
    
    SECRET_KEY = 'django-secret-key-for-dCC-Capstone-urie_opqyiopnfdaskl4513547'
    spotify_jwt_token = jwt.encode(header, payload, SECRET_KEY, algorithm="RS256").decode("utf-8")

    auth_response = RequestContext.post(
    "https://accounts.spotify.com/api/token",
        headers={
        "Authorization": "Basic " + b64encode(f"{CLIENT_ID}:{CLIENT_SECRET}".encode("utf-8")).decode("utf-8"),
        "Content-Type": "application/x-www-form-urlencoded",
        },
        data={
        "grant_type": "client_credentials",
        },
    )


    # Extract the access token from the authentication response
    access_token = auth_response.json()["access_token"]

    # Return the access token to the React application
    return JsonResponse({"access_token": access_token})






