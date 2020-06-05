import uuid

from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _
from rest_framework.authtoken.models import Token


class FlaggedToken(Token):
    """A custom Token adding a Read/Write Flag.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    key = models.CharField(_('Key'), max_length=40)
    write = models.BooleanField(null=False, default=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='auth_token',
                             on_delete=models.CASCADE, verbose_name=_('User'))
    description = models.TextField(blank=True, null=True, default='')

    class Meta:
        db_table = 'auth_token'
        abstract = False
