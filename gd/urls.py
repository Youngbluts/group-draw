from django.conf.urls.static import static
from django.conf.urls import url
from django.conf import settings

from gd.views import IndexView, DrawView


urlpatterns = [
    url(
        regex=r'^$',
        view=IndexView.as_view(),
    ),
    url(
        regex=r'^(?P<tag>\w+)/$',
        view=DrawView.as_view(),
    ),
]

if settings.DEBUG:
    urlpatterns += static(
        prefix=settings.STATIC_URL,
        document_root=settings.STATIC_ROOT,
    )
