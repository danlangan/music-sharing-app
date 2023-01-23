from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from .models import Media
from .serializers import MediaSerializer
from django.shortcuts import get_object_or_404

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

