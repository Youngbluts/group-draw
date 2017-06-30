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
var Canvas = Backbone.View.extend({
    is_drawing: false,
    current: {
        color: 'black'
    },
    events: {
        'mousedown': 'mousedown',
        'mouseout': 'mouseup',
        'mouseup': 'mouseup'
    },
    initialize: function (options) {
        this.socket = new Socket('ws://' + window.location.host + '/chat/');
        this.$el.on('mousemove', _.throttle(_.bind(this.mousemove, this), 30));
        this.listenTo(this.socket, 'receive', this.update);
        $(window).on('resize', _.bind(this.resize, this));
        this.context = this.el.getContext('2d');
        this.resize();
    },
    resize: function (event) {
        this.el.height = window.innerHeight;
        this.el.width = window.innerWidth;
    },
    mousedown: function (event) {
        this.is_drawing = true;
        this.current.x = event.clientX;
        this.current.y = event.clientY;
    },
    mouseup: function (event) {
        if (!this.is_drawing) return;
        this.is_drawing = false;
        this.change(event);
    },
    mousemove: function (event) {
        if (!this.is_drawing) return;
        this.change(event);
        this.current.x = event.clientX;
        this.current.y = event.clientY;
    },
    change: function (event) {
        var w = this.el.width, h = this.el.height;
        var data = {
            color: this.current.color,
            x0: this.current.x / w,
            y0: this.current.y / h,
            x1: event.clientX / w,
            y1: event.clientY / h
        };
        this.socket.send(data);
    },
    update: function (data) {
        var w = this.el.width, h = this.el.height;
        this.context.beginPath();
        this.context.moveTo(data.x0 * w, data.y0 * h);
        this.context.lineTo(data.x1 * w, data.y1 * h);
        this.context.strokeStyle = data.color;
        this.context.lineWidth = 2;
        this.context.stroke();
        this.context.closePath();
    }
});

$(function () {
    new Canvas({
        el: $('canvas#draw')
    });
});
