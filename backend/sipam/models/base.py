from django.db.models import Model, DateTimeField


class BaseModel(Model):
    """Base Model to use for all other models
    provides timestamps
    """

    created = DateTimeField(auto_now_add=True, editable=False)
    edited = DateTimeField(auto_now=True)

    class Meta:
        abstract = True
