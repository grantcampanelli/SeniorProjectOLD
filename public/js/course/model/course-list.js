define(function (require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('util/backbone-helper');
    var Hbs = require('handlebars');
    var Mn = require('backbone.marionette');
    var Q = require('q');
    var Radio = require('backbone.radio');
    
    var Course = require('course/model/course');
    
    return Backbone.Collection.extend({
        className: 'courseList',
        model: Backbone.Model,
        url: '/api/Courses?populate=roles.users',
        
        comparator: function(item) {
            return [
                item.get("start"),
                item.get("classCode"),
                item.get("classNumber")
            ];
        },
        
        clear: function() {
            this.reset([]);
        }
   });
});