# Generated by Django 3.0.4 on 2020-03-08 12:10

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_auto_20200307_1302'),
    ]

    operations = [
        migrations.CreateModel(
            name='Skill',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('skill', models.CharField(max_length=100)),
                ('utterance', models.CharField(max_length=2056)),
                ('bot', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.Bot')),
            ],
        ),
    ]
