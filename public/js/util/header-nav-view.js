define(function (require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('util/backbone-helper');
    var Hbs = require('handlebars');
    var Mn = require('backbone.marionette');
    var Q = require('q');
    var Radio = require('backbone.radio');
    var SessionView = require('user/header-menu-session-view');
    var templateSrc = require('text!templates/headerNav.hbs');
    
    return Mn.LayoutView.extend({
        template: Hbs.compile(templateSrc),
        
        regions: function(options) {
            return {
                left: ".grader-navbar-left",
                right: ".grader-navbar-right"
            }
        },
        
        onShow: function() {
            this.getRegion("right").show(new SessionView());
        }
    
    });
});

