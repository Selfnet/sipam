from rest_framework import viewsets
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from ..models import Pool
from ..serializers import PoolSerializer, AssignmentSerializer


class PoolViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Pools to be viewed or edited.
    """
    queryset = Pool.objects.all()
    serializer_class = PoolSerializer

    def list(self, request):
        """List all pools
        """
        return Response(PoolSerializer(Pool.objects.all(), many=True, read_only=True, context={'request': request}).data)

    @action(detail=True, methods=['POST'], name="Assign Subnet from Pool", serializer_class=AssignmentSerializer)
    def assign(self, request, pk=None):
        """Adds a new address within the pool
        """
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(status=status.HTTP_412_PRECONDITION_FAILED)

        print(serializer.data)
        return Response(status=status.HTTP_204_NO_CONTENT)


    @assign.mapping.delete
    def deleteAssignment(self, request, pk=None):
        """Deletes an assigned address
        """
        pass
