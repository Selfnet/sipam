from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from ..models import Prefix
from ..models import IP
from ..serializers import PrefixSerializer
from ..serializers import IPSerializer


class PrefixViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Prefixes to be viewed or edited.
    """
    queryset = Prefix.objects.all()
    serializer_class = PrefixSerializer
    @action(detail=True) # (methods=['get', 'post', 'head', 'options'])
    def ips(self, request, pk=None):
        ips = IP.objects.filter(parent=pk)
        context = {
            'request': request
        }
        ip_serializer = IPSerializer(ips, many=True, context=context)
        return Response(ip_serializer.data)

    # This is not working (Look for an elegant way to implement it)
    # @ips.mapping.post
    # def create_ip(self, request, *args, **kwargs):
    #     serializer = IPSerializer(data=request.data, many=isinstance(request.data, list))
    #     if serializer.is_valid():
    #         if isinstance(serializer.validated_data, list):
    #             response_status = some_function_to_create_objects_in_batch(serializer.validated_data)

    #             return Response(data, response_status)

    #         else:
    #             response_status = some_function_to_create_objects_in_batch(serializer.validated_data)

    #         return Response(data, status=response_status)
    #     else:
    #         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)