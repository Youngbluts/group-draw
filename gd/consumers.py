from channels.generic.websockets import JsonWebsocketConsumer
from django.core.cache import cache


class IndexConsumer(JsonWebsocketConsumer):
    def connection_groups(self, **kwargs):
        return [
            '_all',
        ]


class DrawConsumer(JsonWebsocketConsumer):
    def connection_groups(self, **kwargs):
        return [
            'draw_{}'.format(kwargs.get('tag')),
        ]

    def receive(self, content, **kwargs):
        key = 'draw_{}'.format(kwargs.get('tag'))
        paths = cache.get(key, [])
        paths.append(content)
        cache.set(key, paths, None)
        content['tag'] = kwargs.get('tag')
        self.group_send('_all', content)
        for name in self.connection_groups(**kwargs):
            self.group_send(name, content)
