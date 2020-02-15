from django.db import models


# Create your models here.
class Thread(models.Model):
    POLICIES = (
        ('open', 'open'),
        ('points', 'challenge'),
        ('challenge', 'challenge'),
        ('badge', 'badge')
    )

    title = models.CharField(max_length=120)
    description = models.TextField(max_length=800)
    location = models.CharField(max_length=12)
    precision = models.IntegerField(default=10)
    joining_policy = models.CharField(max_length=25, choices=POLICIES)
    joining_value = models.CharField(max_length=42)
    publishing_policy = models.CharField(max_length=25, choices=POLICIES)
    publishing_value = models.CharField(max_length=42)
    moderator = models.CharField(max_length=42)
    is_open = models.BooleanField(default=False)
    thread_id = models.CharField(max_length=200)
    thread_name = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now=True)
    updated_at = models.DateTimeField(auto_now_add=True)
    space = models.CharField(max_length=200, default="")
    did = models.CharField(max_length=200, default="")


class Subscription(models.Model):
    thread = models.ForeignKey(Thread, related_name='subscribers', on_delete=models.CASCADE)
    address = models.CharField(max_length=200)
