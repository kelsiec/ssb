from django.db import models

from ssb.poses.models import Pose


class Sequence(models.Model):
    name = models.CharField(max_length=128, unique=True)
    creation_time = models.DateField(auto_now=True)
    poses = models.ManyToManyField(
        Pose,
        related_name='multi_pose_flow',
        through='OrderedPose')

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


class OrderedPose(models.Model):
    class Meta:
        ordering = ['pose_order']
        unique_together = ('sequence', 'pose_order')

    pose_order = models.PositiveIntegerField(db_index=True)
    sequence = models.ForeignKey(Sequence, on_delete=models.CASCADE)
    pose = models.ForeignKey(Pose, on_delete=models.CASCADE)
    breath_override = models.IntegerField(choices=Pose.BREATH_CHOICES[0:-1])
