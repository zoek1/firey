# Generated by Django 3.0.3 on 2020-02-14 08:21

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Thread',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=120)),
                ('description', models.TextField(max_length=800)),
                ('location', models.CharField(max_length=12)),
                ('precision', models.IntegerField(default=10)),
                ('joining_policy', models.CharField(choices=[('open', 'open'), ('points', 'challenge'), ('challenge', 'challenge'), ('badge', 'badge')], max_length=25)),
                ('joining_value', models.CharField(max_length=42)),
                ('publishing_policy', models.CharField(choices=[('open', 'open'), ('points', 'challenge'), ('challenge', 'challenge'), ('badge', 'badge')], max_length=25)),
                ('publishing_value', models.CharField(max_length=42)),
                ('moderator', models.CharField(max_length=42)),
                ('is_open', models.BooleanField(default=False)),
                ('thread_id', models.CharField(max_length=200)),
                ('thread_name', models.CharField(max_length=200)),
                ('created_at', models.DateTimeField(auto_now=True)),
                ('updated_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
