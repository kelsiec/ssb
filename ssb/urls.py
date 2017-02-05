from django.conf import settings
from django.conf.urls import include, url
from django.contrib import admin

from ssb.views import home

urlpatterns = [
    url(r'^admin/', admin.site.urls),

    url(r'^$', home, name='home'),

    url(r'^poses/', include('ssb.poses.urls')),
]

if settings.USE_TOOLBAR:
    import debug_toolbar
    urlpatterns += [
        url(r'^__debug__/', include(debug_toolbar.urls)),
    ]
