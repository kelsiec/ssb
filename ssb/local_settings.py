from ssb.settings import *  # noqa

ALLOWED_HOSTS = ["*"]
INTERNAL_IPS = '127.0.0.1'

USE_TOOLBAR = True
MIDDLEWARE += (
    'debug_toolbar.middleware.DebugToolbarMiddleware',
)
INSTALLED_APPS += ('debug_toolbar', )

