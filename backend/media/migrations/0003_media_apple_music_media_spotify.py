# Generated by Django 4.0.4 on 2022-11-17 15:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('media', '0002_media_album_link_media_playlist_link_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='media',
            name='apple_music',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='media',
            name='spotify',
            field=models.BooleanField(default=False),
        ),
    ]
