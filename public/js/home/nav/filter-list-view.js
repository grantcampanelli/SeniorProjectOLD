define(function (require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('util/backbone-helper');
    var Hbs = require('handlebars');
    var Mn = require('backbone.marionette');
    var Q = require('q');
    var userChannel = require('user/module');
    var Radio = require('backbone.radio');
    var courseChannel = Radio.channel('course');
    var template = require('text!ctemplates/headerNavCourseFilter.hbs');

    return Mn.ItemView.extend({
        tagName: 'li',
        template: Hbs.compile(template),

        ui: {
            allButton: ".all",
            userButton: ".user"
        },

        events: {
            "click @ui.allButton": "showAllCourses",
            "click @ui.userButton": "showUserCourses"
        },

        initialize: function (options) {
            this.model = userChannel.request('session');
        },

        showAllCourses: function (domEvent) {
            courseChannel.command('showAllCourses');
        },

        showUserCourses: function (domEvent) {
            courseChannel.command('showUserCourses');
        }
    });
});

