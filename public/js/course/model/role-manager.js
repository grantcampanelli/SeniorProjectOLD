define(function (require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('util/backbone-helper');
    var Hbs = require('handlebars');
    var Mn = require('backbone.marionette');
    var Q = require('q');
    var Radio = require('backbone.radio');
    
    require('backbone-documentmodel');
    var DocCollection = require('util/doc-collection');
    var DocModel = require('util/doc-model');
    return DocCollection;
    
})