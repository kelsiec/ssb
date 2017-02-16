from django.conf.urls import url

from .views import *

urlpatterns = [
    url(r'^view_poses/$', view_poses, name='view_poses'),
    url(r'^create_pose/$', create_pose, name='create_pose'),
    url(r'^edit_pose/(?P<pose_id>\d+)$', edit_pose, name='edit_pose'),
    url(r'^delete_pose/$', delete_pose, name='delete_pose'),
    url(r'^create_pose_variation/$', create_pose_variation, name='create_pose_variation'),
    url(r'^create_flow/$', create_flow, name='create_flow'),
    url(r'^edit_flow/(?P<flow_id>\d+)$', edit_flow, name='edit_flow'),
    url(r'^delete_flow/$', delete_flow, name='delete_flow'),
    url(r'^add_effect/$', add_effect, name='add_effect'),
    url(r'^effects/$', get_effects, name='get_effects'),
    url(r'^body_parts/$', get_body_parts, name='get_body_parts'),
    url(r'^arm_variations/$', get_arm_variations, name='get_arm_variations'),
    url(r'^arm_variations/$', get_leg_variations, name='get_leg_variations'),
]
