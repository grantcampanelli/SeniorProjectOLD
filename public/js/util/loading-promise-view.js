/**
 * A loading view that shows fetch and save progress
 */
define(function (require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('util/backbone-helper');
    var Handlebars = require('handlebars');
    var loadingViewTemplate = require('text!templates/loading.hbs');
    
    return Backbone.Marionette.ItemView.extend({
        className: "loading",
        tagName: "div",
        template: Handlebars.compile(loadingViewTemplate),
        progress: "",
        
        modelEvents: {
            "change:progress":"render"
        },
        
        ui: {
            progress: ".progress"
        },
        
        initialize: function(options) {
            if (!_.isObject(options.promise)) {
                throw new Error("Promise option required", options);
            }
            
            this.model = new Backbone.Model({
                progress: 0
            });
            
            var self = this;
            options.promise.then(function() {
                // do nothing
            }, function(err) {
                // do nothing
            }, function(percentDone) {
                self.model.set({progress: percentDone});
            });
        },
      
    });
});