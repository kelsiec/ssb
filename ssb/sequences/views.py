import logging
import json

from django.http import HttpResponse, JsonResponse

from .forms import SequenceForm
from .models import Sequence

logger = logging.getLogger(__name__)


def get_sequence(request, sequence_id):
    sequence = Sequence.objects.get(id=sequence_id)

    response = {
        'name': sequence.name,
        'poses': []
    }

    for pose in sequence.poses.all():
        response['poses'].append({
            'value': pose.id,
            'label': pose.english_name
        })

    return JsonResponse(response, safe=False)


def submit_sequence(request):
    sequence_form = SequenceForm(request.POST or None)
    status_code = 200
    messages = []
    instance_id = request.POST.get('sequence-id')

    if request.POST:
        if instance_id:
            try:
                instance = Sequence.objects.get(id=instance_id)
                sequence_form.instance = instance
            except Sequence.DoesNotExist:
                msg = "Sequence id {} does not exist".format(instance_id)
                messages.append({
                    'message': msg,
                    "variant": "error"
                })
                logger.error(msg)

        if sequence_form.is_valid():
            instance = sequence_form.save()
            instance_id = instance.id
            messages.append({'message': "Pose added successfully", "variant": "success"})
        else:
            status_code = 400
            for error_field, errors in sequence_form.errors.as_data().items():
                for error in errors:
                    msg = "{}: {}".format(error_field.title().replace("_", " "), ", ".join(error.messages))
                    logger.error(msg)
                    messages.append({
                        'message': msg,
                        "variant": "error"
                    })

    return HttpResponse(
        json.dumps({'messages': messages, 'instance_id': instance_id}),
        status=status_code,
        content_type="application/json"
    )
