/**
 * The boilerplate for an AMD module.
 * @author Michael Murphy
 */
define(function (require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var App = require('app/app');
    var Backbone = require('util/backbone-helper');
    var Hbs = require('handlebars');
    var Mn = require('backbone.marionette');
    var Q = require('q');
    var Radio = require('backbone.radio');
    var template = require('text!templates/gradeBookView.hbs');
    var theadTemplate = require('text!templates/gradeBookHeader.hbs');
    //var gradebookTemplate = require()

    var ViewState = Backbone.Model.extend({
        initialize: function() {
            
        }
    });
    
    var HeaderView = Mn.ItemView.extend({
        template: Hbs.compile(theadTemplate)
        
    })
    
    return Mn.LayoutView.extend({
        template: Hbs.compile(template),
        
        regions: {
            thead: ".gradebook thead",
            tbody: ".gradebook tbody",
            tfoot: ".gradebook tfoot"
        },
        
        initialize: function(options) {
            this.viewState = new ViewState();
        },
        
        /* 
        This is faster than rendering in onShow
        http://marionettejs.com/docs/v2.4.1/marionette.layoutview.html#efficient-nested-view-structures
        */
        onBeforeShow: function() {
            console.log('here')
            this.showChildView('thead', new HeaderView());
            // this.showChildView('tbody', new FooterView());
            // this.showChildView('tfoot', new FooterView());
        }
    });
});