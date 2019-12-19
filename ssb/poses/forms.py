from django import forms

from .models import Effect, Pose


class PoseForm(forms.ModelForm):
    class Meta:
        model = Pose
        exclude = ('time',)

    benefits = forms.ModelMultipleChoiceField(queryset=Effect.objects.all())
    preparation = forms.ModelMultipleChoiceField(queryset=Effect.objects.all(), required=False)
    compensation = forms.ModelMultipleChoiceField(queryset=Effect.objects.all(), required=False)
