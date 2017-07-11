var Socket = function (url, options) {
    this.url = url;
    this.open();
};
_.extend(Socket.prototype, Backbone.Events, {
    socket: null,
    open: function () {
        this.socket = new WebSocket(this.url);
        this.socket.onmessage = _.bind(this.receive, this);
        this.socket.onclose = _.bind(this.close, this);
    },
    receive: function (event) {
        var data = JSON.parse(event.data);
        this.trigger('receive', data);
    },
    send: function (data) {
        this.socket.send(JSON.stringify(data));
    },
    close: function (event) {
        console.log('CLOSE!')
    }
});
