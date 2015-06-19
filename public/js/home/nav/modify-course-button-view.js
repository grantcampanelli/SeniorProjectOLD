define(function (require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('util/backbone-helper');
    var Hbs = require('handlebars');
    var Mn = require('backbone.marionette');
    var Q = require('q');
    var userChannel = require('user/module');
    var Radio = require('backbone.radio');
    var ModifyCourseView = require('course/view/modify-course-view');
    var pageChannel = Radio.channel('page');
    var userChannel = Radio.channel('user');
    var template = require('text!ctemplates/headerNavModifyCourseButton.hbs');

    return Mn.ItemView.extend({
        tagName: 'li',
        template: Hbs.compile(template),

        events: {
            'click': function () {
                userChannel.request('user').then(function (user) {
                    var modalRegion = pageChannel.request('modalRegion');
                    modalRegion.show(new ModifyCourseView({user: user}));
                })
            }
        }
    });
});