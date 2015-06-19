define(function (require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Q = require('q');
    var Backbone = require('util/backbone-helper');
    var Mn = require('backbone.marionette');
    require('radio.shim');
    require('backbone.radio');
    require('backbone-relational');
    require('query-engine')
    require('backbone-documentmodel');
    var DocModel = require('util/doc-model');
    var DocCollection = Backbone.DocumentCollection;

    var defaultMethodNames = ['findAll', 'findAllLive', 'findOne'];
    
    function mixinQueryFunctions(self, models, optionsArg) {
        var options = optionsArg || {};
        var result = _.partial(paramLookup, options, self);
        var query = result('queryProperty', 'query');
        var funcNames = result('queryMethods', defaultMethodNames);
        
        var collection;
        if (_.isFunction(options.initializeQueryCollection))
            collection = options.initializeQueryCollection(models, options);
        else if (_.isFunction(self.initializeQueryCollection))
            collection = self.initializeQueryCollection(models, options);
        else 
            collection = initQueryCollection.call(self, models, options);
            
        var bindToSelf = _.bind(bindQueryFunc, self, query);
        self[query] = collection;
        _.each(funcNames, bindToSelf);
        return self;
    }
    
    return DocCollection

    function paramLookup(options, self, propName, defaultVal) {
        return _.result(options, propName, function() {
            return _.result(self, propName, defaultVal);
        });
    }
    
})