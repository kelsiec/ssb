from django.db import models


class BodyPart(models.Model):
    name = models.CharField(max_length=128)


class Benefit(models.Model):
    (STRETCH, STRENGTHEN, WARM) = (1, 2, 3)
    ACTIVATION_CHOICES = (
        (STRETCH, "Stretch"),
        (STRENGTHEN, "Strengthen"),
        (WARM, "Warm"),
    )

    body_part = models.ForeignKey(BodyPart)
    activation_type = models.IntegerField(choices=ACTIVATION_CHOICES)


class Pose(models.Model):
    (TWIST, BACKBEND, LATERAL_BEND, FORWARD_BEND, EXTENSION) = (1, 2, 3, 4, 5)
    SPINAL_CLASSIFICATION_CHOICES = (
        (TWIST, "Twist"),
        (BACKBEND, "Backbend"),
        (LATERAL_BEND, "Lateral Bend"),
        (FORWARD_BEND, "Forward Bend"),
        (EXTENSION, "Extension")
    )

    (SUPINE, KNEELING, PRONE, STANDING, SEATED) = (1, 2, 3, 4, 5)
    POSITION_CLASSIFICATION_CHOICES = (
        (SUPINE, "Supine"),
        (KNEELING, "Kneeling"),
        (PRONE, "Prone"),
        (STANDING, "Standing"),
        (SEATED, "Seated")
    )

    (GENTLE, MODERATE, ADVANCED) = (1, 2, 3)
    CHALLENGE_LEVEL_CHOICES = (
        (GENTLE, "Gentle"),
        (MODERATE, "Moderate"),
        (ADVANCED, "Advanced"),
    )

    time = models.DateTimeField(auto_now=True)
    name = models.CharField(max_length=128)
    spinal_classification = models.IntegerField(choices=SPINAL_CLASSIFICATION_CHOICES)
    position_classification = models.IntegerField(choices=POSITION_CLASSIFICATION_CHOICES)
    challenge_level = models.IntegerField(choices=CHALLENGE_LEVEL_CHOICES)
    benefits = models.ManyToManyField(Benefit, blank=True)
