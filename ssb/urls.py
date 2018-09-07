from django.conf import settings
from django.conf.urls import include, url
from django.contrib import admin

from ssb.views import entry

urlpatterns = [
    url(r'^admin/', admin.site.urls),

    url(r'^$', entry, name='entry'),

    url(r'^poses/', include('ssb.poses.urls')),
]

if settings.USE_TOOLBAR:
    import debug_toolbar
    urlpatterns += [
        url(r'^__debug__/', include(debug_toolbar.urls)),
    ]
