import logging
import json

from django.db.models import Q
from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.views import generic

from .forms import EffectForm, PoseForm
from .models import BodyPart, Effect, Pose

logger = logging.getLogger(__name__)


class ViewPoses(generic.ListView):
    model = Pose
    template_name = 'poses/view_poses.html'


def create_pose(request):
    pose_form = PoseForm(request.POST or None)

    if request.POST and PoseForm.SAVE_POSE_BUTTON_ID in request.POST.keys():
        if pose_form.is_valid():
            pose_form.save()
            pose_form = PoseForm(None)
        else:
            logger.error(pose_form.errors)

    effect_form = EffectForm(None)

    return render(request, 'poses/create_pose.html', {'effect_form': effect_form, 'pose_form': pose_form})


def delete_pose(request):
    if request.POST:
        pose_ids = request.POST.getlist('pose_ids[]')
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
    logger.warning("GOT TO ADD EFFECT")
    form = EffectForm(request.POST or None)
    logger.warning(request.POST)
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

    fragments = []
    for effect in effects:
        fragments.append({'text': str(effect), 'id': effect.id})
    fragments.sort(key=lambda fragment: fragment['text'])

    data = {
        "results": fragments,
    }
    return JsonResponse(data)


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
