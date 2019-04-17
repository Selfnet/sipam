from django.db import models


class Pool(models.Model):
    id = models.CharField(max_length=100, primary_key=True)
    created = models.DateTimeField(auto_now_add=True, editable=False)
    edited = models.DateTimeField(auto_now=True)
    description = models.TextField(blank=True, null=True)
