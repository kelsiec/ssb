import logging

from django.views import generic
from django.shortcuts import render

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
    form = PoseForm(request.POST or None)
    return render(request, 'poses/create_pose.html', {'form': form})
