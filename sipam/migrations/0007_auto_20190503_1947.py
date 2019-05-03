# Generated by Django 2.2.1 on 2019-05-03 19:47

from django.db import migrations, models
import sipam.models.enums


class Migration(migrations.Migration):

    dependencies = [
        ('sipam', '0006_cidr_flag'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cidr',
            name='flag',
            field=models.CharField(choices=[(sipam.models.enums.FlagChoices('reservation'), 'reservation'), (sipam.models.enums.FlagChoices('assignment'), 'assignment'), (sipam.models.enums.FlagChoices('host'), 'host')], default=sipam.models.enums.FlagChoices('reservation'), max_length=11),
        ),
    ]
