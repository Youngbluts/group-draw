from django.conf.urls import url

from gd.views import IndexView


urlpatterns = [
    url(
        regex='^$',
        view=IndexView.as_view(),
    )
]
