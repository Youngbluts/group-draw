var SenderId = (new Date()).getTime();

var Brush = Backbone.Model.extend({
    defaults: {
        color: 'FireBrick',
        width: 5
    }
});

var Canvas = Backbone.View.extend({
    is_drawing: false,
    initialize: function (options) {
        this.socket = new Socket('ws://' + window.location.host + window.location.pathname);
        this.canvas = new fabric.Canvas(this.el, {
            isDrawingMode: true
        });
        this.canvas.on('path:created', _.bind(this.path_created, this));
        this.listenTo(this.socket, 'receive', this.path_received);
        $(window).on('resize', _.bind(this.resize_canvas, this));
        this.listenTo(this.model, 'change', this.update_brush);
        this.resize_canvas();
        this.update_brush();
        _.each(options.paths, this.path_received, this);
    },
    resize_canvas: function (event) {
        this.canvas.setHeight($(window).innerHeight());
        this.canvas.setWidth($(window).innerWidth());
    },
    /**
     *
     * @param event
     */
    path_created: function (event) {
        // event.path.set('id', _.uniqueId(SenderId));
        this.socket.send(_.extend(event.path.toJSON(), {
            sender: SenderId
        }));
    },
    /**
     *
     * @param data
     */
    path_received: function (data) {
        if (data.sender !== SenderId) {
            fabric.Path.fromObject(data, _.bind(function (path) {
                this.canvas.add(path);
            }, this));
        }
    },
    /**
     *
     */
    update_brush: function () {
        this.canvas.freeDrawingBrush.color = this.model.get('color');
        this.canvas.freeDrawingBrush.width = this.model.get('width');
    }
});
