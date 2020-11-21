from django.conf import settings
from django.db import models
from rest_framework.authtoken.models import Token


class FlaggedToken(Token):
    """A custom Token adding a Read/Write Flag.
    """
    user = models.ForeignKey(on_delete=models.CASCADE, related_name='auth_token', to=settings.AUTH_USER_MODEL, verbose_name='User')
    write = models.BooleanField(null=False, default=False)
    description = models.TextField(blank=True, null=True, default='')

    class Meta:
        db_table = 'auth_token'
        abstract = False
