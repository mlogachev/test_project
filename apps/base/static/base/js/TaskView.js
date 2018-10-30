/* global App:false */
(function (ns) {
    'use strict';

    ns.views = ns.views || {};


    ns.views.TaskView = Backbone.Marionette.ItemView.extend({
        template: '#task-tpl',
        className: 'panel panel-default',
        events: {
            'click .action-button': 'actionButtonClicked',
        },

        initialize: function(options) {
            console.log(options);
            if (options) {
                this.updateRoute = options.updateRoute;
            }
        },

        actionButtonClicked: function (event) {
            let self = this;
            let currentId = this.model.get('id'),
                currentStatus = this.model.get('status');
            console.log(this.updateRoute);
            console.log(currentId);
            $.ajax({
                url: this.updateRoute,
                method: "PUT",
                data: {
                    CSRF: ns.csrf,
                    id: currentId,
                    status: currentStatus,
                },
                success: function () {
                    self.trigger('reRender', self);
                },
                error: function(err) {
                    self.$el.append("<div class='alert alert-warning'> Статус задания изменен </div>");
                    setTimeout(() => self.trigger('reRender', self), 3000);
                    self.trigger('failed', self, err);
                }
            })
        }
    });

})(App);
