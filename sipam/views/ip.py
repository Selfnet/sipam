from rest_framework import viewsets
from ..models import IP
from ..serializers import IPSerializer
class IPViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows IPs to be viewed or edited.
    """
    queryset = IP.objects.all()
    serializer_class = IPSerializer