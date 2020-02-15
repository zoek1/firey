import json

from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404

# Create your views here.
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from forum.models import Thread, Subscription


def list_threads(request):
    return JsonResponse({'data': [to_dict(t) for t in Thread.objects.all()]})


def get_threads(request, pk):
    return JsonResponse({'data': to_dict(Thread.objects.get(pk=pk))})


def to_dict(thread):
    return {
        "id": thread.id,
        "title": thread.title,
        "description": thread.description,
        "location": {
          "geohash": thread.location,
          "precision": thread.precision,
          "bounding_box": {},
          "coords": []
        },
        "joining": {
          "policy": thread.joining_policy,
          "value": thread.joining_value,
        },
        "publishing": {
          'policy': thread.publishing_policy,
          'value': thread.publishing_value,
        },
        "thread": {
            "id": thread.thread_id,
            "name": thread.thread_name,
            "owner": thread.moderator,
            "moderators": thread.moderator,
            "is_open": thread.is_open,
            "members": list(thread.subscribers.all().values_list('address', flat=True))
        }

    }


@csrf_exempt
@require_POST
def create_thread(request):
    data = json.loads(request.body)
    title = data.get('title')
    description = data.get('description')
    location = data.get('location')
    precision = data.get('precision')
    joining = data.get('joining')
    joining_value = data.get('joiningValue')
    publishing = data.get('joiningValue')
    publishing_value = data.get('publishingValue')
    thread_id = data.get('threadId')
    thread_name = data.get('threadName')
    moderator = data.get('moderator')
    is_open = data.get('is_open')
    space = data.get('space')
    did = data.get('did')

    thread = Thread(title=title, description=description, location=location, precision=precision,
                    joining_policy=joining, joining_value=joining_value,
                    publishing_policy=publishing, publishing_value=publishing_value,
                    thread_id=thread_id, thread_name=thread_name, moderator=moderator, is_open=is_open,
                    space=space, did=did)
    thread.save()

    sub = Subscription(thread=thread, address=moderator)
    sub.save()

    return JsonResponse(to_dict(thread), status=201)


@csrf_exempt
@require_POST
def subscribe_thread(request):
    data = json.loads(request.body)
    print(data)
    address = data.get('address')
    thread = int(data.get('thread'))

    thread = get_object_or_404(Thread, id=thread)

    try:
        sub = thread.subscribers.get(address=address)
        print('existed')
        print(sub)
    except Subscription.DoesNotExist:
        sub = Subscription(thread=thread, address=address)
        sub.save()
        print('Subscribed')

    return JsonResponse(to_dict(thread), status=201)
