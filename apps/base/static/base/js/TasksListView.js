/* global App:false */
(function (ns) {
    'use strict';

    ns.views = ns.views || {};


    ns.views.TasksCollectionView = Backbone.Marionette.CollectionView.extend({
        childView: ns.views.TaskView,
        className: "container-fluid",

        initialize: function(options) {
            console.log(options);
            if (options && options.updateRoute) {
                this.childViewOptions = {
                    updateRoute: options.updateRoute,
                };
            }
        },

        collectionEvents: {
            'sync': 'render',
        },

        updateView: function () {
            this.collection.fetch();
        },

        childEvents: {
            reRender: function() {
                this.updateView();
            },

        }
    });
    
    ns.views.OpenTasksCollectionView = ns.views.TasksCollectionView.extend({
        filter: function (child, index, collection) {
            return child.get('status') === 1
        }
    });

    ns.views.InProgressTasksCollectionView = ns.views.TasksCollectionView.extend({
        filter: function (child, index, collection) {
            return child.get('status') === 20
        }
    });

    ns.views.CompletedTasksCollectionView = ns.views.TasksCollectionView.extend({
        filter: function (child, index, collection) {
            return child.get('status') === 30
        }
    });


    ns.views.TasksListView = Backbone.Marionette.LayoutView.extend({

        regions: {
            tasks: '#task-list',
        },

        template: '#task-layout',

        initialize: function (options) {

            $.ajax({
                url: options.urls.getTasksStatuses,
                method: "GET",
                success: function(resp) {
                    ns.taskStatuses = resp;
                }
            });


            this.collection = new ns.collections.Tasks();
            this.collection.url = options.urls.getTasks;

            this.updateRoute = options.urls.updateRoute;

            this.tasksViews = {
                "all-tasks-tab": ns.views.TasksCollectionView,
                "open-tasks-tab": ns.views.OpenTasksCollectionView,
                "in-progress-tasks-tab": ns.views.InProgressTasksCollectionView,
                "done-tasks-tab": ns.views.CompletedTasksCollectionView,
            };

            if (options && options.el) {
                this.bindUIElements();
                this.render();
            }
        },

        onRender: function() {
            $('#all-tasks-tab').trigger('click');
        },

        onNavTabClick: function(event) {
            this.collection.fetch();
            let navTabId = event.currentTarget.id;
            let tabCl = ".tasks-tab";

            $(tabCl).toArray().forEach(e => $(e).removeClass('active'));
            $(`#${navTabId}`).addClass('active');

            this.getRegion('tasks').show(new this.tasksViews[navTabId]({
                collection: this.collection,
                updateRoute: this.updateRoute,
            }));

        },

        events: {
            'click .tasks-tab': 'onNavTabClick',
        },
    });


})(App);
