define(function (require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('util/backbone-helper');
    var Mn = Backbone.Marionette;

    return  Mn.Region.extend({
        el: '#root'
    });
});