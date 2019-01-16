from channels.generic.websocket import JsonWebsocketConsumer
from asgiref.sync import async_to_sync
from django.core.cache import cache


class IndexConsumer(JsonWebsocketConsumer):
    pass


class DrawConsumer(JsonWebsocketConsumer):
    group = None

    def connect(self):
        self.group = f"draw_{self.scope['url_route']['kwargs']['tag']}"
        async_to_sync(self.channel_layer.group_add)(self.group, self.channel_name)
        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(self.group, self.channel_name)

    def receive_json(self, content, **kwargs):
        paths = cache.get(self.group, [])
        paths.append(content)
        cache.set(self.group, paths, None)
        content['type'] = 'send_json'
        async_to_sync(self.channel_layer.group_send)(self.group, content)
