import logging
import json

from django.http import HttpResponse

from .forms import SequenceForm

logger = logging.getLogger(__name__)


def submit_sequence(request):
    sequence_form = SequenceForm(request.POST or None)
    status_code = 200
    messages = []

    if request.POST:
        if sequence_form.is_valid():
            sequence_form.save()
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
        json.dumps({'messages': messages}), status=status_code, content_type="application/json"
    )
