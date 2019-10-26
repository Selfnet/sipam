from django.db.models import CharField, DateTimeField, Model


class Tag(Model):
    """Defining a Tag which can be applied to a network
    """
    name = CharField(max_length=30, primary_key=True)
    created = DateTimeField(auto_now_add=True, editable=False)

    class Meta:
        ordering = ('name',)
