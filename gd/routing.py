from channels.routing import route_class
from gd.consumers import DrawConsumer

channel_routing = [
    route_class(
        consumer=DrawConsumer,
        path=r'^/chat/',
    ),
]
