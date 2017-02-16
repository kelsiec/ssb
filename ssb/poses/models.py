from django.db import models


class Breath(models.Model):
    (INHALE, EXHALE) = (0, 1)
    BREATH_CHOICES = (
        (INHALE, "Inhale"),
        (EXHALE, "Exhale"),
    )

    direction = models.IntegerField(choices=BREATH_CHOICES)

    def __unicode__(self):
        return self.BREATH_CHOICES[int(self.direction)][1]


class BodyPart(models.Model):
    name = models.CharField(max_length=128, unique=True)

    def __unicode__(self):
        return self.name


class Effect(models.Model):
    (STRETCH, STRENGTHEN, WARM) = (0, 1, 2)
    ACTIVATION_CHOICES = (
        (STRETCH, "Stretch"),
        (STRENGTHEN, "Strengthen"),
        (WARM, "Warm"),
    )

    body_part = models.ForeignKey(BodyPart)
    activation_type = models.IntegerField(choices=ACTIVATION_CHOICES)

    class Meta:
        unique_together = ('body_part', 'activation_type')

    def __unicode__(self):
        return "{} the {}".format(self.ACTIVATION_CHOICES[int(self.activation_type)][1], self.body_part)


class Pose(models.Model):
    (TWIST, BACKBEND, LATERAL_BEND, FORWARD_BEND, EXTENSION) = (0, 1, 2, 3, 4)
    SPINAL_CLASSIFICATION_CHOICES = (
        (TWIST, "Twist"),
        (BACKBEND, "Backbend"),
        (LATERAL_BEND, "Lateral Bend"),
        (FORWARD_BEND, "Forward Bend"),
        (EXTENSION, "Extension")
    )

    (SUPINE, KNEELING, PRONE, STANDING, SEATED) = (0, 1, 2, 3, 4)
    POSITION_CLASSIFICATION_CHOICES = (
        (SUPINE, "Supine"),
        (KNEELING, "Kneeling"),
        (PRONE, "Prone"),
        (STANDING, "Standing"),
        (SEATED, "Seated")
    )

    (GENTLE, MODERATE, INTERMEDIATE, ADVANCED) = (0, 1, 2, 3)
    CHALLENGE_LEVEL_CHOICES = (
        (GENTLE, "Gentle"),
        (MODERATE, "Moderate"),
        (INTERMEDIATE, "Intermediate"),
        (ADVANCED, "Advanced"),
    )

    time = models.DateTimeField(auto_now=True)
    english_name = models.CharField(max_length=128, unique=True)
    sanskrit_name = models.CharField(max_length=128, unique=True, blank=True, null=True)
    spinal_classification = models.IntegerField(choices=SPINAL_CLASSIFICATION_CHOICES)
    position_classification = models.IntegerField(choices=POSITION_CLASSIFICATION_CHOICES)
    challenge_level = models.IntegerField(choices=CHALLENGE_LEVEL_CHOICES)
    breath = models.ForeignKey(Breath, default=Breath.BREATH_CHOICES[Breath.EXHALE][0])
    benefits = models.ManyToManyField(Effect, related_name='pose_benefits')
    preparation = models.ManyToManyField(Effect, related_name='pose_prepartion_requirements', blank=True)
    compensation = models.ManyToManyField(Effect, related_name='pose_compensation_requirements', blank=True)

    def __unicode__(self):
        if self.sanskrit_name:
            return "{} ({})".format(self.english_name, self.sanskrit_name)
        else:
            return self.english_name

    def benefits_to_string(self):
        return self.effect_to_string(self.benefits.all())

    def preparation_to_string(self):
        return self.effect_to_string(self.preparation.all())

    def compensation_to_string(self):
        return self.effect_to_string(self.compensation.all())

    @staticmethod
    def effect_to_string(effects):
        return "<br>".join(str(effect) for effect in effects)

    def get_english_name_display(self):
        return self.english_name


class ArmVariation(models.Model):
    name = models.CharField(max_length=128, blank=True, null=True)

    def __unicode__(self):
        return self.name


class LegVariation(models.Model):
    name = models.CharField(max_length=128, blank=True, null=True)

    def __unicode__(self):
        return self.name


class PoseVariation(models.Model):
    time = models.DateTimeField(auto_now=True)

    parent_pose = models.ForeignKey(Pose)
    description = models.CharField(max_length=256, blank=True, null=True)

    challenge_level = models.IntegerField(choices=Pose.CHALLENGE_LEVEL_CHOICES)
    benefits = models.ManyToManyField(Effect, related_name='variation_benefits', blank=True)
    preparation = models.ManyToManyField(Effect, related_name='variation_prepartion_requirements', blank=True)
    compensation = models.ManyToManyField(Effect, related_name='variation_compensation_requirements', blank=True)

    arm_variation = models.ForeignKey(ArmVariation, blank=True, null=True)
    leg_variation = models.ForeignKey(LegVariation, blank=True, null=True)

    def __unicode__(self):
        if self.sanskrit_name:
            return "{} - {}".format(self.parent_pose, self.description)
        else:
            return self.english_name

    def benefits_to_string(self):
        return self.effect_to_string(list(self.benefits.all()) + list(self.parent_pose.benefits.all()))

    def preparation_to_string(self):
        return self.effect_to_string(list(self.preparation.all()) + list(self.parent_pose.preparation.all()))

    def compensation_to_string(self):
        return self.effect_to_string(list(self.compensation.all()) + list(self.parent_pose.compensation.all()))

    @staticmethod
    def effect_to_string(effects):
        return "<br>".join(str(effect) for effect in effects)

    def get_english_name_display(self):
        name = self.parent_pose.english_name
        if str(self.arm_variation):
            name += " ({})".format(self.arm_variation)
        if str(self.leg_variation):
            name += " ({})".format(self.leg_variation)

        return name


class Flow(models.Model):
    name = models.CharField(max_length=128, unique=True)
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
        ordering = ['-pose_order']

    pose_order = models.PositiveIntegerField(db_index=True)
    flow = models.ForeignKey(Flow)
    pose = models.ForeignKey(Pose)
