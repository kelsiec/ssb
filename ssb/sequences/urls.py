from django.conf.urls import url

from .views import (
    submit_sequence,
)

urlpatterns = [
    url(r'^sequence/submit/$', submit_sequence, name='submit_sequence'),
]
