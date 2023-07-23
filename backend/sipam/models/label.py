from uuid import uuid4

from django.db.models import CASCADE, CharField, ForeignKey, UniqueConstraint, UUIDField

from .base import BaseModel


class Label(BaseModel):
    """Defining a Label which can be applied to a network"""

    # Required because using name and cidr seems not possible
    id = UUIDField(primary_key=True, default=uuid4)
    name = CharField(max_length=30)
    cidr = ForeignKey("CIDR", on_delete=CASCADE, related_name="labels")
    value = CharField(max_length=1000)

    class Meta:
        ordering = ("name",)
        constraints = [UniqueConstraint(fields=["name", "cidr"], name="name-cidr")]
