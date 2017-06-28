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

$(function () {
    var canvas = document.getElementsByClassName('whiteboard')[0];
    var context = canvas.getContext('2d');

    var socket = new Socket('ws://' + window.location.host + '/chat/');
    socket.on('receive', function (data) {
        var w = canvas.width;
        var h = canvas.height;
        drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color);
    });
    var current = {
        color: 'black'
    };
    $('ul.colors').on('click', 'li[data-color]', function (event) {
        current.color = $(event.currentTarget).data('color');
    });
    var resize = function () {
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;
    };
    $(window).on('resize', resize);
    resize();

    var drawing = false;

    canvas.addEventListener('mousedown', onMouseDown, false);
    canvas.addEventListener('mouseup', onMouseUp, false);
    canvas.addEventListener('mouseout', onMouseUp, false);
    canvas.addEventListener('mousemove', _.throttle(onMouseMove, 30), false);

    function drawLine(x0, y0, x1, y1, color, emit) {
        if (emit) {
            var w = canvas.width;
            var h = canvas.height;
            socket.send({
                x0: x0 / w,
                y0: y0 / h,
                x1: x1 / w,
                y1: y1 / h,
                color: color
            });
        } else {
            context.beginPath();
            context.moveTo(x0, y0);
            context.lineTo(x1, y1);
            context.strokeStyle = color;
            context.lineWidth = 2;
            context.stroke();
            context.closePath();
        }
    }

    function onMouseDown(e) {
        drawing = true;
        current.x = e.clientX;
        current.y = e.clientY;
    }

    function onMouseUp(e) {
        if (!drawing) {
            return;
        }
        drawing = false;
        drawLine(current.x, current.y, e.clientX, e.clientY, current.color, true);
    }

    function onMouseMove(e) {
        if (!drawing) {
            return;
        }
        drawLine(current.x, current.y, e.clientX, e.clientY, current.color, true);
        current.x = e.clientX;
        current.y = e.clientY;
    }
});
