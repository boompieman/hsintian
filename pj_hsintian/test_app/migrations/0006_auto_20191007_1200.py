# Generated by Django 2.2.4 on 2019-10-07 04:00

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('test_app', '0005_auto_20190925_1148'),
    ]

    operations = [
        migrations.AddField(
            model_name='customer',
            name='introducer',
            field=models.CharField(default=django.utils.timezone.now, max_length=32),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='mastergroup',
            name='descript',
            field=models.TextField(default=''),
        ),
    ]