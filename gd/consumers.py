from channels.generic.websockets import JsonWebsocketConsumer


class DrawConsumer(JsonWebsocketConsumer):
    def connection_groups(self, **kwargs):
        return ['chat']

    def receive(self, content, **kwargs):
        self.group_send('chat', content)
