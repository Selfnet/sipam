# Generated by Django 3.0 on 2019-12-05 01:20

from django.db import migrations, models
import django.db.models.deletion
import mptt.fields
import netfields.fields
import sipam.utilities.enums
import sipam.utilities.fields
import uuid


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="CIDR",
            fields=[
                ("created", models.DateTimeField(auto_now_add=True)),
                ("edited", models.DateTimeField(auto_now=True)),
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ("cidr", netfields.fields.CidrAddressField(max_length=43, unique=True)),
                ("fqdn", sipam.utilities.fields.FQDNField(blank=True, null=True)),
                ("description", models.TextField(blank=True, null=True)),
                (
                    "flag",
                    models.CharField(
                        choices=[("reservation", "reservation"), ("assignment", "assignment"), ("host", "host")],
                        default=sipam.utilities.enums.FlagChoices["RESERVATION"],
                        max_length=11,
                    ),
                ),
                ("lft", models.PositiveIntegerField(editable=False)),
                ("rght", models.PositiveIntegerField(editable=False)),
                ("tree_id", models.PositiveIntegerField(db_index=True, editable=False)),
                ("level", models.PositiveIntegerField(editable=False)),
                (
                    "parent",
                    mptt.fields.TreeForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="children",
                        to="sipam.CIDR",
                    ),
                ),
            ],
            options={
                "ordering": ("cidr",),
            },
        ),
        migrations.CreateModel(
            name="Pool",
            fields=[
                ("created", models.DateTimeField(auto_now_add=True)),
                ("edited", models.DateTimeField(auto_now=True)),
                ("id", models.CharField(max_length=10, primary_key=True, serialize=False)),
                ("label", models.CharField(max_length=100)),
                ("description", models.TextField(blank=True, null=True)),
            ],
            options={
                "abstract": False,
            },
        ),
        migrations.CreateModel(
            name="Label",
            fields=[
                ("created", models.DateTimeField(auto_now_add=True)),
                ("edited", models.DateTimeField(auto_now=True)),
                ("id", models.UUIDField(default=uuid.uuid4, primary_key=True, serialize=False)),
                ("name", models.CharField(max_length=30)),
                ("value", models.CharField(max_length=1000)),
                (
                    "cidr",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, related_name="labels", to="sipam.CIDR"
                    ),
                ),
            ],
            options={
                "ordering": ("name",),
            },
        ),
        migrations.AddField(
            model_name="cidr",
            name="pool",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.DO_NOTHING,
                related_name="prefixes",
                to="sipam.Pool",
            ),
        ),
        migrations.AddConstraint(
            model_name="label",
            constraint=models.UniqueConstraint(fields=("name", "cidr"), name="name-cidr"),
        ),
    ]
