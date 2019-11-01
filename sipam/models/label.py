from django.db.models import CharField, DateTimeField, Model


class Label(Model):
    """Defining a Label which can be applied to a network
    """
    name = CharField(max_length=30, primary_key=True)
    value = CharField(max_length=1000)
    created = DateTimeField(auto_now_add=True, editable=False)

    class Meta:
        ordering = ('name',)
