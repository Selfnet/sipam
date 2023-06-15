from django.conf import settings
from django.db import models
from rest_framework.authtoken.models import Token


class FlaggedToken(Token):
    """A custom Token adding a Read/Write Flag.
    """
    write = models.BooleanField(null=False, default=False)
    description = models.TextField(blank=True, null=True, default='')
    user = models.ForeignKey(
        to=settings.AUTH_USER_MODEL, related_name='auth_token',
        on_delete=models.CASCADE, verbose_name=("User")
    )

    class Meta:
        db_table = 'auth_token'
        abstract = False
