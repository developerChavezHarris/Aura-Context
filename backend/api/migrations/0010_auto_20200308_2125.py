# Generated by Django 3.0.4 on 2020-03-08 21:25

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_intent_bot'),
    ]

    operations = [
        migrations.RenameField(
            model_name='bot',
            old_name='bot_skills',
            new_name='bot_intents',
        ),
    ]
