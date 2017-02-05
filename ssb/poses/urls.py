from django.conf.urls import url

from .views import ViewPoses, create_pose, delete_pose

urlpatterns = [
    url(r'^view_poses/$', ViewPoses.as_view(), name='view_poses'),
    url(r'^add_pose/$', create_pose, name='create_pose'),
    url(r'^delete_pose/$', delete_pose, name='delete_pose'),
]
