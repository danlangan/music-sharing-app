from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from .models import Media
from .serializers import MediaSerializer

# Create your views here.

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_media(request):
    media = Media.objects.all()
    serializer = MediaSerializer(media, many=True)
    return Response(serializer.data)

