# Generated by Django 2.2.4 on 2019-12-20 07:20

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('test_app', '0009_auto_20191030_1920'),
    ]

    operations = [
        migrations.AddField(
            model_name='mastergroup',
            name='gid',
            field=models.CharField(default=django.utils.timezone.now, max_length=10),
            preserve_default=False,
        ),
    ]
