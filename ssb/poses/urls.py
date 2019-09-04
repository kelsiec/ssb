from django.conf.urls import url

from .views import (
    PoseListCreate,
    add_effect,
    create_pose,
    delete_pose,
    get_arm_variations,
    get_body_parts,
    get_breath_directions,
    get_challenge_levels,
    get_effects,
    get_leg_variations,
    get_position_classifications,
    get_spinal_classifications,
)

urlpatterns = [
    url(r'^poses/$', PoseListCreate.as_view(), name='get_poses'),
    url(r'^create_pose/submit/$', create_pose, name='create_pose'),
    url(r'^delete_pose/$', delete_pose, name='delete_pose'),
    url(r'^add_effect/$', add_effect, name='add_effect'),
    url(r'^breath_directions/$', get_breath_directions, name='get_breath_directions'),
    url(r'^challenge_levels/$', get_challenge_levels, name='get_challenge_levels'),
    url(r'^position_classifications/$', get_position_classifications, name='get_position_classifications'),
    url(r'^spinal_classifications/$', get_spinal_classifications, name='get_spinal_classifications'),
    url(r'^effects/$', get_effects, name='get_effects'),
    url(r'^body_parts/$', get_body_parts, name='get_body_parts'),
    url(r'^arm_variations/$', get_arm_variations, name='get_arm_variations'),
    url(r'^arm_variations/$', get_leg_variations, name='get_leg_variations'),
]
