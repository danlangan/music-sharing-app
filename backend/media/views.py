# from base64 import b64encode
import json
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

@api_view(['GET', 'POST'])
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


    # will need to pass the data into this param from the spotify data return. Also will need to 
    params ={'term':'Jack', 'limit':10}

    apple_music_response = requests.get("https://api.music.apple.com/v1/catalog/us/search", headers=headers, params=params)
    print(apple_music_response)
    if apple_music_response.status_code == 200:
        return Response({'music':apple_music_response.json()})
    else: 
        data = 'API request failed'
        print(f"API request failed with status code: {apple_music_response.status_code}")

    

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
    # Return the access token to the application
    return JsonResponse({"jwt": spotify_jwt_token})

@api_view(['GET'])
def get_spotify_media_info(request):

    request_body = request.body
    json_string = request_body.decode('utf-8')
    data = json.loads(json_string)
    spotify_type_and_id = data['spotifyMediaParams']
    spotify_ready_media_type = spotify_type_and_id[0]
    spotify_ready_media_id = spotify_type_and_id[1]

    spotify_jwt_generation = requests.get("http://localhost:8000/spotify_jwt/")
    response_data = spotify_jwt_generation.json()
    spotify_jwt_token = response_data["jwt"]

    # Set up the Spotify API endpoint URL
    endpoint = f"https://api.spotify.com/v1/{spotify_ready_media_type}/{spotify_ready_media_id}"

    # Set up the headers with the Spotify API access token
    access_token = spotify_jwt_token
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    # Make a GET request to the Spotify API endpoint
    response = requests.get(endpoint, headers=headers)

    # Check if the response was successful (HTTP status code 200)
    if response.status_code == 200:
        # Parse the response JSON data
        api_call_data = json.loads(response.text)

        # Extract the song info from the response data
        spotify_song_info = {
            "name": api_call_data["name"],
            "artists": [artist["name"] for artist in api_call_data["artists"]],
            "album": api_call_data["album"]["name"],
            "release_date": api_call_data["album"]["release_date"],
            "duration_ms": api_call_data["duration_ms"]
        }

        # Return the song info as a JSON response
        return JsonResponse(spotify_song_info, {"message": "Success!"})
    else:
        # Return an error message if the response was not successful
        return JsonResponse({"error": f"Failed to retrieve song info: {response.status_code}"})

@api_view(['GET'])
def search_spotify(request):
    spotify_jwt_generation = requests.get("http://localhost:8000/spotify_jwt/")
    response_data = spotify_jwt_generation.json()
    spotify_jwt_token = response_data["jwt"]

    apple_music_response = get_apple_music_media_info(request)
    apple_music_data = apple_music_response.json()

    # Extract the media info from Apple Music data
    title = apple_music_data['data'][0]['attributes']['name']
    artist = apple_music_data['data'][0]['attributes']['artistName']
    album = apple_music_data['data'][0]['attributes']['albumName']

    # Set up the query parameters for the Spotify search endpoint
    query = f"track:{title} artist:{artist} album:{album}"
    params = {
        "q": query,
        "type": "track",
        "limit": 2
    }

    # Make a GET request to the Spotify search endpoint
    endpoint = "https://api.spotify.com/v1/search"
    access_token = spotify_jwt_token
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    # Make a GET request to the Spotify API endpoint
    response = requests.get(endpoint, headers=headers, params=params)

    # Parse the response JSON data
    if response.status_code == 200:
        api_call_data = json.loads(response.text)

        # Extract the external sharing link for the first two results
        tracks = api_call_data["tracks"]["items"]
        external_links = []
        for track in tracks:
            for link in track["external_urls"]:
                if "spotify" in link:
                    external_links.append(link)
                    break

        # Return the external sharing links as a JSON response
        return JsonResponse({"external_links": external_links})
    else:
        # Return an error message if the response was not successful
        return JsonResponse({"error": f"Failed to search Spotify: {response.status_code}"})

@api_view(['GET'])
def get_apple_music_media_info(request):
    request_body = request.body
    json_string = request_body.decode('utf-8')
    data = json.loads(json_string)
    apple_type_and_id = data['appleMusicMediaParams']
    apple_ready_media_type = apple_type_and_id[0]
    apple_ready_media_id = apple_type_and_id[1]

    apple_jwt_generation = requests.get("http://localhost:8000/apple_music_jwt/")
    response_data = apple_jwt_generation.json()
    apple_jwt_token = response_data["jwt"]

    # Send a GET request to the Apple Music API endpoint with the appropriate parameters and headers
    apple_music_api_url = f"https://api.music.apple.com/v1/{apple_ready_media_type}/{apple_ready_media_id}"
    headers = {
        "Authorization": f"Bearer {apple_jwt_token}",
        "User-Agent": "com.capstoneproject.musicsharingapp",  # Insert the user token for the current user
    }
    response = requests.get(apple_music_api_url, headers=headers)
    apple_music_data = response.json()

    return JsonResponse(apple_music_data, {"message": "Success!"})

@api_view(['GET'])
def search_apple_music(request):
    apple_jwt_generation = requests.get("http://localhost:8000/apple_music_jwt/")
    response_data = apple_jwt_generation.json()
    apple_jwt_token = response_data["jwt"]

    headers = {
        "Authorization": "Bearer " + apple_jwt_token,
        "User-Agent": "com.capstoneproject.musicsharingapp",
    }

    spotify_song_info = get_spotify_media_info(request).data
    media_title = spotify_song_info["name"]
    media_artist = spotify_song_info["artists"][0]
    media_album = spotify_song_info["album"][0]

    # Set up the search query parameters for the Apple Music API
    params = {
        "term": f"{media_title} {media_artist} {media_album}",
        "limit": 2
    }

    apple_music_response = requests.get("https://api.music.apple.com/v1/catalog/us/search", headers=headers, params=params)
    if apple_music_response.status_code == 200:
        apple_music_data = apple_music_response.json()

        # Extracting the external sharing links from the returned json
        external_links = []
        for result in apple_music_data["results"]:
            for song in result.get("songs", []):
                if "url" in song.get("attributes", {}):
                    external_links.append(song["attributes"]["url"])
            if len(external_links) >= 2:
                break

        # Return the external sharing links as a JSON response
        return Response({"links": external_links})
    else: 
        data = 'API request failed'
        print(f"API request failed with status code: {apple_music_response.status_code}")