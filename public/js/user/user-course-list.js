define(function (require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('util/backbone-helper');
    var Hbs = require('handlebars');
    var Mn = require('backbone.marionette');
    var Q = require('q');
    var Radio = require('backbone.radio');
    
    var CourseList = require('course/model/course-list');
    
    return CourseList.extend({
        initialize: function(options) {
            this.user = options.user;
            this.url = '/api/Users/'+ this.user.username +'/Courses';
        }
    });
});