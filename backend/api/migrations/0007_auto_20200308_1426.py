# Generated by Django 3.0.4 on 2020-03-08 14:26

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_skill'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Skill',
            new_name='Intent',
        ),
        migrations.RenameField(
            model_name='intent',
            old_name='skill',
            new_name='intent',
        ),
    ]
