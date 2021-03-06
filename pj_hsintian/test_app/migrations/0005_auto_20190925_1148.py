# Generated by Django 2.2.4 on 2019-09-25 03:48

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('test_app', '0004_auto_20190912_0922'),
    ]

    operations = [
        migrations.AddField(
            model_name='customer',
            name='age',
            field=models.CharField(default=django.utils.timezone.now, max_length=32),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='customer',
            name='city',
            field=models.CharField(default=django.utils.timezone.now, max_length=32),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='customer',
            name='district',
            field=models.CharField(default=django.utils.timezone.now, max_length=32),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='customer',
            name='gender',
            field=models.CharField(default=django.utils.timezone.now, max_length=16),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='customer',
            name='name',
            field=models.CharField(max_length=32),
        ),
        migrations.AlterField(
            model_name='customer',
            name='phone',
            field=models.CharField(max_length=32),
        ),
        migrations.AlterField(
            model_name='mastergroup',
            name='image',
            field=models.CharField(default='', max_length=512),
        ),
        migrations.AlterField(
            model_name='reservation',
            name='event_id',
            field=models.CharField(editable=False, max_length=50),
        ),
    ]
