from django import forms

from crispy_forms.helper import FormHelper
from crispy_forms.layout import Layout, Submit, Field
from crispy_forms.bootstrap import FormActions

from .models import Pose


class PoseForm(forms.ModelForm):
    class Meta:
        model = Pose
        exclude = ('time',)

    SAVE_POSE_BUTTON_ID = 'save_pose'

    helper = FormHelper()
    helper.form_tag = False
    helper.label_class = 'col-sm-2'
    helper.field_class = 'col-sm-4'
    helper.layout = Layout(
        Field('name'),
        Field('spinal_classification'),
        Field('position_classification'),
        Field('challenge_level'),
        FormActions(
            Submit(SAVE_POSE_BUTTON_ID, 'Save', css_class="btn-primary"), css_class='col-sm-6',
        )
    )
