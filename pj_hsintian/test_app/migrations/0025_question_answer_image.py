# Generated by Django 2.2.4 on 2020-01-31 15:22

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('test_app', '0024_auto_20200131_2222'),
    ]

    operations = [
        migrations.AddField(
            model_name='question',
            name='answer_image',
            field=models.ImageField(default=django.utils.timezone.now, upload_to='question'),
            preserve_default=False,
        ),
    ]