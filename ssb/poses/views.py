import logging
import json

from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse, JsonResponse

from rest_framework import serializers
from rest_framework.generics import ListCreateAPIView

from .forms import EffectForm, PoseForm
from .models import (
    ArmVariation,
    BodyPart,
    Effect,
    LegVariation,
    Pose
)

logger = logging.getLogger(__name__)


class PoseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pose
        fields = (
            'id',
            'english_name',
            'sanskrit_name',
            'breath',
            'breath_display',
            'position_classification',
            'spinal_classification',
            'challenge_level',
            'benefits',
        )

    breath_display = serializers.CharField(source='get_breath_display')
    position_classification = serializers.CharField(source='get_position_classification_display')
    spinal_classification = serializers.CharField(source='get_spinal_classification_display')
    challenge_level = serializers.CharField(source='get_challenge_level_display')
    benefits = serializers.StringRelatedField(many=True)


class PoseListCreate(ListCreateAPIView):
    queryset = Pose.objects.all()
    serializer_class = PoseSerializer


def create_pose(request):
    pose_form = PoseForm(request.POST or None)
    status_code = 200
    messages = []

    if request.POST:
        if pose_form.is_valid():
            pose_form.save()
            messages.append({'message': "Pose added successfully", "variant": "success"})
        else:
            status_code = 400
            for error_field, errors in pose_form.errors.as_data().items():
                for error in errors:
                    messages.append({
                        'message': "{}: {}".format(error_field.title().replace("_", " "), ", ".join(error.messages)),
                        "variant": "error"
                    })

    return HttpResponse(json.dumps({'messages': messages}), status=status_code, content_type="application/json")


def delete_pose(request):
    if request.POST:
        pose_ids = request.POST.getlist('pose_ids')
        deleted_ids = []
        if len(pose_ids) > 0:
            for pose_id in pose_ids:
                try:
                    Pose.objects.get(id=pose_id).delete()
                    deleted_ids.append(pose_id)
                except ObjectDoesNotExist:
                    pass
        return HttpResponse(json.dumps(pose_ids), content_type="application/json")
    return HttpResponse('')


def add_effect(request):
    form = EffectForm(request.POST or None)
    if request.POST:
        if form.is_valid():
            form.save()
        else:
            logger.error(form.errors)

    return HttpResponse('')


def get_effects(request):
    query = request.GET.get("q", None)

    if query is None:
        effects = Effect.objects.all()
    else:
        effects = []
        for effect in Effect.objects.all():
            if query in str(effect):
                effects.append(effect)

    options = []
    for effect in effects:
        options.append({'label': str(effect), 'value': effect.id})
    options.sort(key=lambda fragment: fragment['label'])

    return JsonResponse(options, safe=False)


def get_breath_directions(request):
    options = []
    for choice in Pose.BREATH_CHOICES:
        options.append({'label': choice[1], 'value': choice[0]})
    options.sort(key=lambda fragment: fragment['label'])

    return JsonResponse(options, safe=False)


def get_challenge_levels(request):
    options = []
    for choice in Pose.CHALLENGE_LEVEL_CHOICES:
        options.append({'label': choice[1], 'value': choice[0]})
    options.sort(key=lambda fragment: fragment['label'])

    return JsonResponse(options, safe=False)


def get_position_classifications(request):
    options = []
    for choice in Pose.POSITION_CLASSIFICATION_CHOICES:
        options.append({'label': choice[1], 'value': choice[0]})
    options.sort(key=lambda fragment: fragment['label'])

    return JsonResponse(options, safe=False)


def get_spinal_classifications(request):
    options = []
    for choice in Pose.SPINAL_CLASSIFICATION_CHOICES:
        options.append({'label': choice[1], 'value': choice[0]})
    options.sort(key=lambda fragment: fragment['label'])

    return JsonResponse(options, safe=False)


def get_body_parts(request):
    query = request.GET.get("q", None)
    if query is None:
        return JsonResponse({'results': []})

    body_parts = BodyPart.objects.filter(name__icontains=query).order_by("name")
    fragments = []
    for body_part in body_parts:
        fragments.append({'text': body_part.name, 'id': body_part.id})
    if len(body_parts) == 0:
        fragments.append({'text': query + " (new value)", 'id': query})

    data = {
        "results": fragments,
    }
    return JsonResponse(data)


def get_arm_variations(request):
    query = request.GET.get("q", None)
    if query is None:
        return JsonResponse({'results': []})

    arm_variations = ArmVariation.objects.filter(name__icontains=query).order_by("name")
    fragments = []
    for arm_variation in arm_variations:
        fragments.append({'text': arm_variation.name, 'id': arm_variation.id})
    if len(arm_variations) == 0:
        fragments.append({'text': query + " (new value)", 'id': query})

    data = {
        "results": fragments,
    }
    return JsonResponse(data)


def get_leg_variations(request):
    query = request.GET.get("q", None)
    if query is None:
        return JsonResponse({'results': []})

    leg_variations = LegVariation.objects.filter(name__icontains=query).order_by("name")
    fragments = []
    for leg_variation in leg_variations:
        fragments.append({'text': leg_variation.name, 'id': leg_variation.id})
    if len(leg_variations) == 0:
        fragments.append({'text': query + " (new value)", 'id': query})

    data = {
        "results": fragments,
    }
    return JsonResponse(data)
