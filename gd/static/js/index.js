var Model = Backbone.Model.extend({
    defaults: function () {
        return {
            paths: new Backbone.Collection()
        };
    }
});

var ModelView = Backbone.View.extend({
    className: 'col-6',
    template: _.template($('script#card').html()),
    initialize: function (options) {
        this.listenTo(this.model.get('paths'), 'add', this.add);
        $(window).on('resize', _.bind(this.resize, this));
    },
    render: function () {
        this.$el.html(this.template({
            tag: this.model.get('id')
        }));
        var canvas = this.$('canvas').get(0);
        this.canvas = new fabric.StaticCanvas(canvas);
        this.resize();
    },
    add: function (model) {
        var data = model.toJSON();
        fabric.Path.fromObject(data, _.bind(function (path) {
            this.canvas.add(path);
        }, this));
    },
    resize: function () {
        var height = this.$('div.card-block').height(),
            width = this.$('div.card-block').width();
        this.canvas.setHeight(height);
        this.canvas.setWidth(width);
    }
});

var Collection = Backbone.Collection.extend({
    initialize: function (models, options) {
        this.socket = new Socket('ws://' + window.location.host + window.location.pathname);
        this.listenTo(this.socket, 'receive', this.received);
    },
    received: function (data) {
        var model = this.get(data.tag);
        if (_.isUndefined(model)) {
            model = new Model({
                id: data.tag
            });
            this.add(model);
        }
        console.log(model.cid)
        model.get('paths').add(data);
    }
});

var CollectionView = Backbone.View.extend({
    initialize: function (options) {
        this.listenTo(this.collection, 'add', this.add);
    },
    add: function (model) {
        var view = new ModelView({
            model: model
        });
        this.$el.append(view.el);
        view.render();
    }
});

$(function () {
    new CollectionView({
        collection: new Collection(),
        el: $('div#collection')
    });
});
