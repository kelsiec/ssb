from django.conf.urls import url

from .views import *

urlpatterns = [
    url(r'^view_poses/$', ViewPoses.as_view(), name='view_poses'),
    url(r'^create_pose/$', create_pose, name='create_pose'),
    url(r'^delete_pose/$', delete_pose, name='delete_pose'),
    url(r'^add_effect/$', add_effect, name='add_effect'),
    url(r'^get_effects/$', get_effects, name='get_effects'),
    url(r'^body_parts/$', get_body_parts, name='get_body_parts'),
]
