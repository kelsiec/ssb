from django.conf.urls import url

from .views import (
    get_sequence,
    submit_sequence,
    SequenceListCreate,
)

urlpatterns = [
    url(r'^list_view/$', SequenceListCreate.as_view(), name='sequences'),
    url(r'^sequence/(?P<sequence_id>\d+)/$', get_sequence, name='get_sequence'),
    url(r'^sequence/submit/$', submit_sequence, name='submit_sequence'),
]
