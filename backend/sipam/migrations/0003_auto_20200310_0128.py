# Generated by Django 3.0.3 on 2020-03-10 01:28

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("sipam", "0002_pool_pooltype"),
    ]

    operations = [
        migrations.AddField(
            model_name="pool",
            name="defaultDomain",
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AlterField(
            model_name="pool",
            name="description",
            field=models.TextField(blank=True),
        ),
    ]
