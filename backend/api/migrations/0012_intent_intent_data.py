# Generated by Django 3.0.4 on 2020-03-10 01:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0011_svp'),
    ]

    operations = [
        migrations.AddField(
            model_name='intent',
            name='intent_data',
            field=models.CharField(default='', max_length=2056),
        ),
    ]
