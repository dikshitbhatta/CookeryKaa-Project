# Generated by Django 5.0.2 on 2024-06-09 11:06

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('post', '0008_bookmark'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='reply',
            name='question',
        ),
        migrations.RemoveField(
            model_name='reply',
            name='user',
        ),
        migrations.DeleteModel(
            name='Question',
        ),
        migrations.DeleteModel(
            name='Reply',
        ),
    ]
