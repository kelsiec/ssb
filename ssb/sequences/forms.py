import logging

from django import forms

from .models import OrderedPose, Sequence


logger = logging.getLogger(__name__)


class SequenceForm(forms.ModelForm):
    class Meta:
        model = Sequence
        fields = '__all__'

    def clean(self):
        cleaned_data = super(SequenceForm, self).clean()
        cleaned_data['name'] = self.data.get('sequence-name')
        del self.errors['name']

        return cleaned_data

    def _save_m2m(self):
        pose_ids = self.data.getlist('poses')
        for i in range(len(pose_ids)):
            OrderedPose.objects.get_or_create(
                sequence=self.instance, pose_id=pose_ids[i], pose_order=i
            )
