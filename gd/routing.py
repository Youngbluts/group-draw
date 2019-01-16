from channels.routing import ProtocolTypeRouter, URLRouter
from channels.middleware import BaseMiddleware
from django.conf.urls import url
from gd.consumers import IndexConsumer, DrawConsumer


class WebSocketMiddleware(BaseMiddleware):
    def populate_scope(self, scope):
        pass

    async def resolve_scope(self, scope):
        pass


application = ProtocolTypeRouter({
    'websocket': WebSocketMiddleware(
        URLRouter([
            url(
                regex=r'^$',
                view=IndexConsumer,
            ),
            url(
                regex=r'^(?P<tag>\w+)/$',
                view=DrawConsumer,
            ),
        ])
    ),
})
