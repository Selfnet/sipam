from django import forms
from django.core.validators import ValidationError, _, deconstructible
from django.db.models import CharField
from fqdn import FQDN


@deconstructible
class FQDNValidator:
    message = _("Enter a valid FQDN.")
    code = "invalid"

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def __call__(self, value):
        fqdn = FQDN(value)
        if not fqdn.is_valid:
            raise ValidationError(self.message, code=self.code)


class FQDNField(CharField):
    default_validators = [FQDNValidator()]
    description = _("FQDN")

    def __init__(self, verbose_name=None, name=None, **kwargs):
        kwargs.setdefault("max_length", 200)
        super().__init__(verbose_name, name, **kwargs)

    def deconstruct(self):
        name, path, args, kwargs = super().deconstruct()
        if kwargs.get("max_length") == 200:
            del kwargs["max_length"]
        return name, path, args, kwargs

    def formfield(self, **kwargs):
        # As with CharField, this will cause URL validation to be performed
        # twice.
        return super().formfield(
            **{
                "form_class": forms.URLField,
                **kwargs,
            }
        )
