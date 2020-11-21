import uuid

from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _
from rest_framework.authtoken.models import Token


class FlaggedToken(Token):
    """A custom Token adding a Read/Write Flag.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    write = models.BooleanField(null=False, default=False)
    description = models.TextField(blank=True, null=True, default='')

    class Meta:
        db_table = 'auth_token'
        abstract = False
