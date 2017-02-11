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
    name = models.CharField(max_length=128)

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

    (GENTLE, MODERATE, ADVANCED) = (0, 1, 2)
    CHALLENGE_LEVEL_CHOICES = (
        (GENTLE, "Gentle"),
        (MODERATE, "Moderate"),
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

