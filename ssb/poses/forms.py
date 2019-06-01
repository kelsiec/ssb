from django import forms

from crispy_forms.helper import FormHelper
from crispy_forms.layout import Div, Field, HTML, Layout, Submit
from crispy_forms.bootstrap import FormActions

from .models import ArmVariation, BodyPart, Effect, Flow, LegVariation, Pose, PoseVariation


class PoseForm(forms.ModelForm):
    class Meta:
        model = Pose
        exclude = ('time',)

    benefits = forms.ModelMultipleChoiceField(queryset=Effect.objects.all())
    preparation = forms.ModelMultipleChoiceField(queryset=Effect.objects.all(), required=False)
    compensation = forms.ModelMultipleChoiceField(queryset=Effect.objects.all(), required=False)


class PoseVariationForm(forms.ModelForm):
    class Meta:
        model = PoseVariation
        exclude = ('time',)

    parent_pose = forms.ModelChoiceField(queryset=Pose.objects.all())
    benefits = forms.ModelMultipleChoiceField(queryset=Effect.objects.all(), required=False)
    preparation = forms.ModelMultipleChoiceField(queryset=Effect.objects.all(), required=False)
    compensation = forms.ModelMultipleChoiceField(queryset=Effect.objects.all(), required=False)
    arm_variation = forms.CharField(max_length=128, required=False, widget=forms.Select(choices=[]))
    leg_variation = forms.CharField(max_length=128, required=False, widget=forms.Select(choices=[]))

    SAVE_POSE_BUTTON_ID = 'save_pose'

    helper = FormHelper()
    helper.layout = Layout(
        Div(
            Div(Field('parent_pose', css_class="form-control"), css_class="col-lg-4"),
            Div(Field('description', css_class="form-control"), css_class="col-lg-8"),
            css_class='row form-group'
        ),
        Div(
            Div(Field('arm_variation', css_class="form-control"), css_class="col-lg-4"),
            Div(Field('leg_variation', css_class="form-control"), css_class="col-lg-4"),
            Div(Field('challenge_level', css_class="form-control"), css_class="col-lg-4"),
            css_class='row form-group'
        ),
        Div(
            Div(Field('benefits'), css_class="col-lg-3"),
            Div(Field('preparation'), css_class="col-lg-3"),
            Div(Field('compensation'), css_class="col-lg-3"),
            Div(
                HTML('<br><button class="btn btn-primary" onclick="openEffectModal();">'
                     '<span><i class="glyphcion glyphicon-plus"></i>Add Effect</span></a>'),
                css_class="col-lg-2"
            ),
            css_class='row form-group'
        ),
        Div(
            FormActions(
                Submit(SAVE_POSE_BUTTON_ID, 'Save', css_class="btn-primary"), css_class='col-sm-6',
            ),
            css_class='row form-group'
        )
    )

    def clean(self):
        cleaned_data = super(PoseVariationForm, self).clean()

        try:
            cleaned_data['arm_variation'] = ArmVariation.objects.get(id=int(cleaned_data['arm_variation']))
        except (ArmVariation.DoesNotExist, ValueError):
            cleaned_data['arm_variation'] = ArmVariation.objects.get_or_create(name=cleaned_data['arm_variation'])[0]

        try:
            cleaned_data['leg_variation'] = LegVariation.objects.get(id=int(cleaned_data['leg_variation']))
        except (LegVariation.DoesNotExist, ValueError):
            cleaned_data['leg_variation'] = LegVariation.objects.get_or_create(name=cleaned_data['leg_variation'])[0]

        return cleaned_data


class EffectForm(forms.ModelForm):
    class Meta:
        model = Effect
        fields = '__all__'

    SAVE_EFFECT_BUTTON_ID = 'save_effect'

    body_part = forms.CharField(max_length=64, required=True, widget=forms.Select(choices=[]))

    helper = FormHelper()
    helper.form_id = 'add-effect-form'
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
        except (BodyPart.DoesNotExist, ValueError):
            cleaned_data['body_part'] = BodyPart.objects.get_or_create(name=cleaned_data['body_part'])[0]

        return cleaned_data


class FlowForm(forms.ModelForm):
    class Meta:
        model = Flow
        fields = ('name',)

    SAVE_FLOW_BUTTON_ID = 'save-flow'
