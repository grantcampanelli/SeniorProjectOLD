define(function (require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('util/backbone-helper');
    var Hbs = require('handlebars');
    var Mn = require('backbone.marionette');
    var Q = require('q');
    var Radio = require('backbone.radio');
    var pageChannel = Radio.channel('page');
    var courseChannel = Radio.channel('course');
    var template = require('text!ctemplates/latePolicyView.hbs');
    var alertTemplate = require('text!ctemplates/alert-block.hbs');

    var Course = require('course/model/course');

    return Mn.ItemView.extend({
        tagName: 'div',
        className: 'latePolicy modal-dialog  modal-lg',
        template: Hbs.compile(template),

        ui: {},

        events: {},

        initialize: function (options) {


        }

    });
});