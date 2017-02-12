import logging
import json

from django.contrib import messages
from django.core.exceptions import ObjectDoesNotExist
from django.forms import modelformset_factory
from django.http import HttpResponse, JsonResponse
from django.shortcuts import redirect, render

from .forms import EffectForm, FlowForm, PoseForm
from .models import BodyPart, Effect, Flow, Pose, OrderedPose

logger = logging.getLogger(__name__)


def view_poses(request):
    ctx = {
        'poses': Pose.objects.all(),
        'flows': Flow.objects.all()
    }

    return render(request, 'poses/view_poses.html', ctx)


def create_pose(request):
    pose_form = PoseForm(request.POST or None)

    if request.POST and PoseForm.SAVE_POSE_BUTTON_ID in request.POST.keys():
        if pose_form.is_valid():
            pose_form.save()
            pose_form = PoseForm(None)
        else:
            logger.error(pose_form.errors)

    effect_form = EffectForm(None)

    return render(request, 'poses/create_or_modify_pose.html', {'effect_form': effect_form, 'pose_form': pose_form})


def edit_pose(request, pose_id):
    try:
        pose = Pose.objects.get(id=pose_id)
    except Pose.DoesNotExist:
        messages.add_message(request, messages.ERROR, "Pose id {} does not exist.".format(pose_id))
        return redirect('view_poses')

    pose_form = PoseForm(request.POST or None, instance=pose)

    if request.POST and PoseForm.SAVE_POSE_BUTTON_ID in request.POST.keys():
        if pose_form.is_valid():
            pose_form.save()
        else:
            logger.error(pose_form.errors)

    effect_form = EffectForm(None)

    messages.add_message(request, messages.SUCCESS, "Pose updated!")

    return render(request, 'poses/create_or_modify_pose.html', {'effect_form': effect_form, 'pose_form': pose_form})


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


def create_flow(request):
    flow_name_form = FlowForm(request.POST or None)
    FlowFormset = modelformset_factory(OrderedPose, fields=('pose',), can_delete=True)
    formset = FlowFormset(request.POST or None)

    if request.POST and FlowForm.SAVE_FLOW_BUTTON_ID in request.POST.keys():
        if flow_name_form.is_valid() and formset.is_valid():
            flow_instance = flow_name_form.save()
            i = 0
            for form in formset:
                if form.is_valid():
                    OrderedPose.objects.get_or_create(
                        pose_order=i, flow=flow_instance, pose=form.cleaned_data['pose'])
                else:
                    logger.error(form.errors)
                i += 1
        else:
            logger.error(flow_name_form.errors)
            logger.error(formset.errors)

    ctx = {
        'flow_name_form': flow_name_form,
        'formset': formset,
    }

    return render(request, 'poses/create_flow.html', ctx)

#
# def edit_flow(request):
#     FlowFormset = modelformset_factory(OrderedPose, fields=('pose',), can_delete=True)
#     formset = FlowFormset()
#
#     ctx = {
#         'formset': formset,
#     }
#
#     return render(request, 'poses/create_flow.html', ctx)


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
