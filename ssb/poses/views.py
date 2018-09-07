import logging
import json

from django.contrib import messages
from django.core.exceptions import ObjectDoesNotExist
from django.forms import modelformset_factory
from django.http import HttpResponse, JsonResponse
from django.shortcuts import redirect, render, reverse

from rest_framework import serializers
from rest_framework.generics import ListCreateAPIView

from .forms import EffectForm, FlowForm, PoseForm, PoseVariationForm
from .models import ArmVariation, BodyPart, Effect, Flow, LegVariation, OrderedPose, Pose

logger = logging.getLogger(__name__)


class PoseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pose
        fields = (
            'id',
            'english_name',
            'sanskrit_name',
            'breath',
            'position_classification',
            'spinal_classification',
            'challenge_level',
            'benefits',
        )

    breath = serializers.StringRelatedField()
    position_classification = serializers.CharField(source='get_position_classification_display')
    spinal_classification = serializers.CharField(source='get_spinal_classification_display')
    challenge_level = serializers.CharField(source='get_challenge_level_display')
    benefits = serializers.StringRelatedField(many=True)


class PoseListCreate(ListCreateAPIView):
    queryset = Pose.objects.all()
    serializer_class = PoseSerializer


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


def create_pose_variation(request):
    pose_form = PoseVariationForm(request.POST or None)

    if request.POST and PoseForm.SAVE_POSE_BUTTON_ID in request.POST.keys():
        if pose_form.is_valid():
            pose_form.save()
            pose_form = PoseVariationForm(None)
        else:
            logger.error(pose_form.errors)

    effect_form = EffectForm(None)

    ctx = {'effect_form': effect_form, 'pose_form': pose_form}

    return render(request, 'poses/create_or_modify_variation_pose.html', ctx)


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
        'form_action': reverse('create_flow')
    }

    return render(request, 'poses/create_or_modify_flow.html', ctx)


def edit_flow(request, flow_id):
    try:
        flow = Flow.objects.get(id=flow_id)
    except Pose.DoesNotExist:
        messages.add_message(request, messages.ERROR, "Pose id {} does not exist.".format(flow_id))
        return redirect('view_poses')

    flow_name_form = FlowForm(request.POST or None, instance=flow)
    FlowFormset = modelformset_factory(OrderedPose, fields=('pose',), can_delete=True)
    formset = FlowFormset(request.POST or None, queryset=OrderedPose.objects.filter(flow=flow))

    if request.POST and FlowForm.SAVE_FLOW_BUTTON_ID in request.POST.keys():
        if flow_name_form.is_valid() and formset.is_valid():
            flow.name = flow_name_form.cleaned_data['name']
            flow.save()

            OrderedPose.objects.filter(flow=flow).delete()

            i = 0
            for form in formset:
                logger.warning(form.cleaned_data)
                if form.is_valid() and 'pose' in form.cleaned_data and not form.cleaned_data['DELETE']:
                    OrderedPose.objects.get_or_create(
                        pose_order=i, flow=flow, pose=form.cleaned_data['pose'])
                else:
                    messages.add_message(request, messages.ERROR, form.errors)
                    logger.error(form.errors)
                i += 1

        else:
            messages.add_message(request, messages.ERROR, flow_name_form.errors)
            messages.add_message(request, messages.ERROR, formset.errors)
            logger.error(flow_name_form.errors)
            logger.error(formset.errors)

        messages.add_message(request, messages.SUCCESS, "Flow updated!")
        flow_name_form = FlowForm(request.POST or None, instance=flow)
        FlowFormset = modelformset_factory(OrderedPose, fields=('pose',), can_delete=True)
        formset = FlowFormset(request.POST or None, queryset=OrderedPose.objects.filter(flow=flow))

    ctx = {
        'flow_name_form': flow_name_form,
        'formset': formset,
        'form_action': reverse('edit_flow', args=[flow.id])
    }

    return render(request, 'poses/create_or_modify_flow.html', ctx)


def delete_flow(request):
    if request.POST:
        flow_ids = request.POST.getlist('flow_ids[]')
        deleted_ids = []
        if len(flow_ids) > 0:
            for flow_id in flow_ids:
                try:
                    OrderedPose.objects.filter(flow__id=flow_id).delete()
                    Flow.objects.get(id=flow_id).delete()
                    deleted_ids.append(flow_id)
                except ObjectDoesNotExist:
                    pass
        return HttpResponse(json.dumps(flow_ids), content_type="application/json")
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
