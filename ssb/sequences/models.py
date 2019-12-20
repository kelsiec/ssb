from django.db import models

from ssb.poses.models import Pose


# A flow exists between a pose and a sequence
# A flow is different than a sequence because it is contained inside a sequence, and does not have nested flows
# A flow is different than a pose because, if unnamed, it does not display in the pose table or dropdowns
class Flow(models.Model):
    name = models.CharField(max_length=128, unique=True, blank=True, null=True)
    is_pose = models.BooleanField(default=False)
    creation_time = models.DateField(auto_now=True)
    poses = models.ManyToManyField(
        Pose,
        related_name='multi_pose_flow',
        through='OrderedFlowPose')


class OrderedFlowPose(models.Model):
    class Meta:
        ordering = ['pose_order']
        unique_together = ('flow', 'pose_order')

    pose_order = models.PositiveIntegerField(db_index=True)
    flow = models.ForeignKey(Flow, on_delete=models.CASCADE)
    pose = models.ForeignKey(Pose, on_delete=models.CASCADE)
    breath_override = models.IntegerField(choices=Pose.BREATH_CHOICES[0:-1])


class OrderedSequenceElement(models.Model):
    pass


class OrderedPose(OrderedSequenceElement):
    pose = models.ForeignKey(Pose, on_delete=models.CASCADE)
    breath_override = models.IntegerField(choices=Pose.BREATH_CHOICES[0:-1])


class OrderedFlow(OrderedSequenceElement):
    flow = models.ForeignKey(Flow, on_delete=models.CASCADE)


class Sequence(models.Model):
    name = models.CharField(max_length=128, unique=True)
    creation_time = models.DateField(auto_now=True)
    poses = models.ManyToManyField(
        OrderedSequenceElement,
        related_name='multi_pose_sequence',
        through='OrderedSequenceBase')

    def poses_to_string(self):
        poses = set()
        for ordered_pose in OrderedPose.objects.filter(flow=self):
            poses.add("{} ({})".format(ordered_pose.pose.english_name, str(ordered_pose.pose.breath)))
        return self.list_to_table_cell(poses)

    def benefits_to_string(self):
        benefits = set()
        for pose in self.poses.all():
            benefits.update(pose.benefits.all())
        return self.list_to_table_cell(benefits)

    def preparation_to_string(self):
        benefits = set()
        for pose in self.poses.all():
            benefits.update(pose.preparation.all())
        return self.list_to_table_cell(benefits)

    def compensation_to_string(self):
        benefits = set()
        for pose in self.poses.all():
            benefits.update(pose.compensation.all())
        return self.list_to_table_cell(benefits)

    @staticmethod
    def list_to_table_cell(objects):
        return "<br>".join(str(obj) for obj in objects)


class OrderedSequenceBase(models.Model):
    class Meta:
        ordering = ['pose_order']
        unique_together = ('sequence', 'pose_order')

    pose_order = models.PositiveIntegerField(db_index=True)
    sequence = models.ForeignKey(Sequence, on_delete=models.CASCADE)
    element = models.ForeignKey(OrderedSequenceElement, on_delete=models.CASCADE)
