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
        
        ui: {
            progress: ".progress"
        },
        
        modelEvents: {
            "fetch:progress": "onProgress",
            "save:progress": "onProgress"
        },
        
        onProgress: function(percentDone) {
            this.progress = percentDone.toString() + "%";
            this.ui.progress.html(this.progress);
        }
      
    });
});