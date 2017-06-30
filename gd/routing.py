from channels.routing import route_class
from gd.consumers import DrawConsumer

channel_routing = [
    route_class(
        path=r'^/(?:(?P<tag>\w+)/)?$',
        consumer=DrawConsumer,
    ),
]
