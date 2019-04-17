from django.db.models import URLField as DefaultURLField
from django.core.validators import URLValidator as DefaultURLValidator


class URLField(DefaultURLField):
    default_validators = [DefaultURLValidator(
        schemes=None, message="Enter a valid FQDN")]
