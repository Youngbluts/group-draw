from django.conf.urls import url

from gd.views import IndexView


urlpatterns = [
    url(
        regex=r'^(?:(?P<tag>\w+)/)?$',
        view=IndexView.as_view(),
    )
]
