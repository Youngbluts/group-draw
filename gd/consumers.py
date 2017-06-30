from channels.generic.websockets import JsonWebsocketConsumer


class DrawConsumer(JsonWebsocketConsumer):
    def connection_groups(self, **kwargs):
        return ['draw_{}'.format(kwargs.get('tag'))]

    def receive(self, content, **kwargs):
        for name in self.connection_groups(**kwargs):
            self.group_send(name, content)
