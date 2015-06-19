define(function (require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Q = require('q');
    var Backbone = require('util/backbone-helper');
    require('backbone.marionette');
    require('radio.shim');
    var Radio = require('backbone.radio');
    require('backbone-relational');
    require('query-engine');
    require('backbone-documentmodel');
    var courseChannel = Radio.channel('course');
    return Backbone.DocumentModel
    
    
})