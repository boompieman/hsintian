# Generated by Django 2.2.4 on 2020-01-02 13:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('test_app', '0012_auto_20200102_2006'),
    ]

    operations = [
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('question', models.CharField(max_length=512)),
                ('answer', models.CharField(max_length=512)),
            ],
        ),
    ]
