# Generated by Django 2.2.4 on 2019-09-05 13:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('test_app', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='reservation',
            name='has_remind',
            field=models.BooleanField(default=False),
        ),
    ]
