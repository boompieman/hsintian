# Generated by Django 2.2.4 on 2020-01-31 03:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('test_app', '0018_auto_20200118_1127'),
    ]

    operations = [
        migrations.CreateModel(
            name='OpeningDays',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('days', models.CharField(max_length=10)),
            ],
        ),
    ]