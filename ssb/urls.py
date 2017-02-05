import debug_toolbar

from django.conf.urls import include, url
from django.contrib import admin

from ssb.views import home

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^__debug__/', include(debug_toolbar.urls)),

    url(r'^$', home, name='home'),

    # url(r'^poses/', include('ssb.poses.urls')),
]
