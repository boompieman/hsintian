# Generated by Django 2.2.4 on 2020-07-06 09:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('test_app', '0032_auto_20200405_1659'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='reservation',
            name='has_remind',
        ),
        migrations.AddField(
            model_name='reservation',
            name='has_ensured_remind',
            field=models.BooleanField(default=False, verbose_name='確認提醒'),
        ),
        migrations.AddField(
            model_name='reservation',
            name='has_sent_remind',
            field=models.BooleanField(default=False, verbose_name='已傳送提醒訊息'),
        ),
    ]
