# Generated by Django 3.0.5 on 2020-06-18 11:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0018_remove_bot_bot_personal'),
    ]

    operations = [
        migrations.AlterField(
            model_name='intent',
            name='utterance',
            field=models.CharField(max_length=2056, unique=True),
        ),
        migrations.AlterField(
            model_name='svp',
            name='utterance',
            field=models.CharField(default='', max_length=2056, unique=True),
        ),
    ]
