from rest_framework import mixins, status
from rest_framework.filters import SearchFilter
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from accounts.models import FlaggedToken
from accounts.permissions import UserAccess
from accounts.serializers import TokenSerializer


class TokenViewSet(
    mixins.ListModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin, mixins.CreateModelMixin, GenericViewSet
):
    """API endpoint that allows tokens to be manged by a user or staffer."""

    serializer_class = TokenSerializer
    filter_backends = [SearchFilter]
    search_fields = ["user__username", "write"]

    permission_classes = [UserAccess]

    def get_queryset(self):
        """Limit the queryset to the current user, except for staffers."""
        user = self.request.user
        if user.is_staff:
            return FlaggedToken.objects.all()
        return FlaggedToken.objects.filter(user_id=user.id)

    def list(self, request, *args, **kwargs):
        """Get own tokens or all tokens if admin."""
        return Response(
            self.serializer_class(self.get_queryset(), many=True, read_only=True, context={"request": request}).data
        )

    def create(self, request):
        """Create a new authtoken for this user."""
        serializer = self.serializer_class(data=request.data, context={"request": request})

        if not serializer.is_valid():
            return Response(status=status.HTTP_406_NOT_ACCEPTABLE)

        data = serializer.validated_data
        token = FlaggedToken.objects.create(
            user=request.user, write=data.get("write", False), description=data.get("description", "")
        )

        return Response(self.serializer_class(token, context={"request": request}).data, status=status.HTTP_201_CREATED)

    def destroy(self, request, pk=None):
        """Delete a token."""
        try:
            if request.user.is_staff:
                FlaggedToken.objects.get(pk=pk).delete()
            else:
                FlaggedToken.objects.get(pk=pk, user=request.user).delete()
        except FlaggedToken.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        return Response(status=status.HTTP_204_NO_CONTENT)

    def update(self, request, pk=None):
        """Update Description oder Write Flag."""
        try:
            if request.user.is_staff:
                token = FlaggedToken.objects.get(pk=pk)
            else:
                token = FlaggedToken.objects.get(pk=pk, user=request.user)

            serializer = self.serializer_class(data=request.data, context={"request": request})

            if not serializer.is_valid():
                return Response(status=status.HTTP_406_NOT_ACCEPTABLE)

            data = serializer.validated_data

            token.description = data["description"]
            token.write = data["write"]
            token.save()

        except FlaggedToken.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        return Response(self.serializer_class(token, context={"request": request}).data, status=status.HTTP_200_OK)
