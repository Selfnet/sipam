# Generated by Django 2.2.1 on 2019-05-03 21:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sipam', '0007_auto_20190503_1947'),
    ]

    operations = [
        migrations.AddField(
            model_name='pool',
            name='label',
            field=models.CharField(default='VMs', max_length=100),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='pool',
            name='id',
            field=models.CharField(max_length=10, primary_key=True, serialize=False),
        ),
    ]
