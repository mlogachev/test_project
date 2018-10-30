/* global App:false */
(function (ns) {
    'use strict';

    ns.models = ns.models || {};
    ns.collections = ns.collections || {};

    ns.models.Task = Backbone.Model.extend({});


    ns.collections.Tasks = Backbone.Collection.extend({
        model: ns.models.Task,
    });


})(App);
