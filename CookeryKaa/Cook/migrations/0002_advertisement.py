# Generated by Django 5.0.6 on 2024-06-12 15:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Cook', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Advertisement',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('image', models.ImageField(upload_to='advertisements/')),
                ('is_active', models.BooleanField(default=True)),
            ],
        ),
    ]