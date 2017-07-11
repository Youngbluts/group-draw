from json import dumps

from django.views.generic.base import TemplateResponseMixin, View
from django.utils.safestring import mark_safe
from django.core.cache import cache


class IndexView(TemplateResponseMixin, View):
    template_name = 'index.html'

    def get(self, request, *args, **kwargs):
        return self.render_to_response({

        })


class DrawView(TemplateResponseMixin, View):
    template_name = 'draw.html'

    def get(self, request, *args, **kwargs):
        key = 'draw_{}'.format(kwargs.get('tag'))
        return self.render_to_response(dict(
            paths=mark_safe(dumps(cache.get(key, []))),
        ))
