from django import forms

from crispy_forms.helper import FormHelper
from crispy_forms.layout import Div, Field, HTML, Layout, Submit
from crispy_forms.bootstrap import FormActions

from .models import BodyPart, Breath, Effect, Pose


class PoseForm(forms.ModelForm):
    class Meta:
        model = Pose
        exclude = ('time',)

    breath = forms.ChoiceField(choices=Breath.BREATH_CHOICES)
    benefits = forms.ModelChoiceField(queryset=Effect.objects.all())
    preparation = forms.ModelChoiceField(queryset=Effect.objects.all())
    compensation = forms.ModelChoiceField(queryset=Effect.objects.all())

    SAVE_POSE_BUTTON_ID = 'save_pose'

    helper = FormHelper()
    helper.form_tag = False
    helper.label_class = 'col-sm-2'
    helper.field_class = 'col-sm-4'
    helper.layout = Layout(
        Field('name'),
        Field('breath'),
        Field('spinal_classification'),
        Field('position_classification'),
        Div(
            Div(Field('benefits'), css_class="col-lg-3"),
            Div(Field('preparation'), css_class="col-lg-3"),
            Div(Field('compensation'), css_class="col-lg-3"),
            Div(
                HTML('<br><button class="btn btn-primary" onclick="openEffectModal();">'
                     '<span><i class="glyphcion glyphicon-plus"></i>Add Effect</span></a>'),
                css_class="col-lg-2"
            ),
            css_class='row'
        ),

        Field('challenge_level'),
        FormActions(
            Submit(SAVE_POSE_BUTTON_ID, 'Save', css_class="btn-primary"), css_class='col-sm-6',
        )
    )


class EffectForm(forms.ModelForm):
    class Meta:
        model = Effect
        fields = '__all__'

    SAVE_EFFECT_BUTTON_ID = 'save_effect'

    body_part = forms.CharField(max_length=64, required=True, widget=forms.Select(choices=[]))

    helper = FormHelper()
    helper.layout = Layout(
        Div(
            Div(Field('activation_type'), css_class='col-lg-3'),
            Div(Field('body_part'), css_class='col-lg-3'),
            css_class='row'
        ),
        FormActions(
            Submit(SAVE_EFFECT_BUTTON_ID, 'Save', css_class="btn-primary"), css_class='col-lg-6',
        )
    )

    def clean(self):
        cleaned_data = super(EffectForm, self).clean()

        try:
            cleaned_data['body_part'] = BodyPart.objects.get(id=int(cleaned_data['body_part']))
        except:
            cleaned_data['body_part'] = BodyPart.objects.get_or_create(name=cleaned_data['body_part'])[0]

        return cleaned_data
