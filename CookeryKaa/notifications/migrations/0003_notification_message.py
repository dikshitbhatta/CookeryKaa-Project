# Generated by Django 5.0.2 on 2024-06-10 12:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('notifications', '0002_alter_notification_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='notification',
            name='message',
            field=models.CharField(blank=True, max_length=50),
        ),
    ]