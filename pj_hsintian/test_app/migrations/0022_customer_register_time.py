# Generated by Django 2.2.4 on 2020-01-31 14:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('test_app', '0021_auto_20200131_1216'),
    ]

    operations = [
        migrations.AddField(
            model_name='customer',
            name='register_time',
            field=models.DateTimeField(blank=True, default=None, editable=False, null=True),
        ),
    ]
