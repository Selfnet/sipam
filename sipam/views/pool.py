from rest_framework import viewsets
from ..models import Pool
from ..serializers import PoolSerializer


class PoolViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Pools to be viewed or edited.
    """
    queryset = Pool.objects.all()
    serializer_class = PoolSerializer
