# Generated by Django 2.2 on 2019-04-27 15:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sipam', '0005_auto_20190418_0118'),
    ]

    operations = [
        migrations.AddField(
            model_name='cidr',
            name='flag',
            field=models.CharField(choices=[('reservation', 'reservation'), (
                'assignment', 'assignment'), ('host', 'host')], default='reservation', max_length=11),
        ),
    ]
