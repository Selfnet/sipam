from rest_framework.permissions import BasePermission, SAFE_METHODS
from django.contrib.auth.models import AnonymousUser
from accounts.models import FlaggedToken


class AuthenticatedReadOnly(BasePermission):
    """Enforces authentication for ReadOnly access"""

    def has_permission(self, request, view):
        if isinstance(request.user, AnonymousUser):
            return False
        return request.method in SAFE_METHODS


class ReadOnlyToken(BasePermission):
    """Verifying a token is being handled and this token allows only read access
    So only read methods are allowed.
    """

    def has_permission(self, request, view):
        if isinstance(request.auth, FlaggedToken):
            if not request.auth.write and request.method in SAFE_METHODS:
                return True

        return False
