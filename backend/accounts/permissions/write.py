from rest_framework.permissions import BasePermission

from accounts.models import FlaggedToken, User


class WriteToken(BasePermission):
    """A class verifying we actually handle a Token and this token has a write flag."""

    def has_permission(self, request, view):
        if isinstance(request.auth, FlaggedToken):
            return request.auth.write

        return False


class UserAccess(BasePermission):
    """A class verifying whether a user is authenticated
    and not using an auth token.

    Users have read and write access.
    """

    def has_permission(self, request, view):
        if not isinstance(request.auth, FlaggedToken) and isinstance(request.user, User):
            return True

        return False
