from rest_framework.authentication import TokenAuthentication
from .models import FlaggedToken


class FlaggedTokenAuthentication(TokenAuthentication):
    model = FlaggedToken
