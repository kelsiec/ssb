import logging
import json

from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse
from django.shortcuts import render
from django.views import generic


from .forms import PoseForm
from .models import Pose

logger = logging.getLogger(__name__)


class ViewPoses(generic.ListView):
    model = Pose
    template_name = 'poses/view_poses.html'


def create_pose(request):
    form = PoseForm(request.POST or None)

    if request.POST and PoseForm.SAVE_POSE_BUTTON_ID in request.POST.keys():
        if form.is_valid():
            form.save()
            form = PoseForm(None)
        else:
            logger.error(form.errors)

    return render(request, 'poses/create_pose.html', {'form': form})


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
