from django.conf.urls import url

from .views import *

urlpatterns = [
    url(r'^view_poses/$', view_poses, name='view_poses'),
    url(r'^create_pose/$', create_pose, name='create_pose'),
    url(r'^edit_pose/(?P<pose_id>\d+)$', edit_pose, name='edit_pose'),
    url(r'^delete_pose/$', delete_pose, name='delete_pose'),
    url(r'^create_flow/$', create_flow, name='create_flow'),
    url(r'^add_effect/$', add_effect, name='add_effect'),
    url(r'^effects/$', get_effects, name='get_effects'),
    url(r'^body_parts/$', get_body_parts, name='get_body_parts'),
]
