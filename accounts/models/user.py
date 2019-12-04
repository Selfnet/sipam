from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """Custom user to allow modifications at a later state
    """

    class Meta(AbstractUser.Meta):
        db_table = 'auth_user'
        abstract = False
