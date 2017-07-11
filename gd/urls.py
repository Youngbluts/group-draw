from django.conf.urls import url

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
