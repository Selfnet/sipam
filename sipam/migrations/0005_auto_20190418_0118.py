# Generated by Django 2.2 on 2019-04-18 01:18

from django.db import migrations
import netfields.fields


class Migration(migrations.Migration):

    dependencies = [
        ('sipam', '0004_auto_20190418_0011'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cidr',
            name='cidr',
            field=netfields.fields.CidrAddressField(
                max_length=43, unique=True),
        ),
    ]
