define(function (require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Q = require('q');
    var Backbone = require('backbone');
    require('backbone.marionette');
    require('radio.shim');
    require('backbone.radio');
    require('backbone-relational');
    require('query-engine');
   
    Backbone.Marionette.Renderer.render = function(template, data) {
        return template(data);
    };
   
   function ajaxFactory(fetchProgressFunc, saveProgressFunc) {
        var xhr = new window.XMLHttpRequest();
        if (_.isFunction(fetchProgressFunc)) {
            xhr.addEventListener("progress", fetchProgressFunc, false);
        }
        if (_.isFunction(saveProgressFunc)) {
            xhr.upload.addEventListener("progress", saveProgressFunc, false);
        }
        return xhr;
    }
    
    function updateProgress(deferred, progressEventName, progressEvent) {
        if (progressEvent.lengthComputable) {
            var percentDone = 100 * progressEvent.loaded / progressEvent.total;
            percentDone = Math.round(percentDone);
            deferred.notify(percentDone);
            this.trigger(progressEventName, percentDone);
        }
    }
    
    function updateFetchProgress(deferred, event){
        updateProgress.call(this, deferred, "fetch:progress", event);
    }
    
    function updateSaveProgress(deferred, event){
        updateProgress.call(this, deferred, "save:progress", event);
    }
    
    function initAjaxOptions(self, deferred, optionsArg) {
        var options = _.isObject(optionsArg) ? optionsArg : {};
        var onFProgress = self.updateFetchProgress.bind(self, deferred);
        var onSProgress = self.updateSaveProgress.bind(self, deferred);
        
        options.xhr = _.partial(ajaxFactory, onFProgress, onSProgress);
        return options
    }
    
    function cacheSuperMethods(proto) {
        return {
            fetch: proto.fetch,
            save: proto.save
        }
    }
    
    function wrapIoMethods(fetchFunc, saveFunc) {
        return {
            fetch: fetchFunc,
            save: saveFunc
        }
    }
    
    var progressEventGenerators = {
        "updateFetchProgress": updateFetchProgress,
        "updateSaveProgress": updateSaveProgress
    }
    
    _.each(["Model", "Collection"], function(name) {
        var clazz = Backbone[name];
        var superClassMethod = cacheSuperMethods(clazz.prototype);
        var ioMethods = wrapIoMethods(fetchFunc, saveFunc);
        
        _.extend(clazz.prototype, progressEventGenerators, ioMethods);
        
        function fetchFunc(optionsArg) {
            var deferred = Q.defer();
            var options = initAjaxOptions(this, deferred, optionsArg);
            this.trigger("fetch", this, options);
            Q(superClassMethod.fetch.call(this, options)).then(function (data) {
                deferred.resolve(data);
            });
            return deferred.promise;
        }
        
        function saveFunc(attrsArg, optionsArg) {
            var deferred = Q.defer();
            var attr = _.isObject(attrsArg) ? attrsArg : {};
            var options = initAjaxOptions(this, deferred, optionsArg);
            this.trigger("save", this, attr, options);
            Q(superClassMethod.save.call(this, attr, options)).then(function (data) {
                deferred.resolve(data);
            })
            return deferred.promise;
        }
    });
    
   return Backbone;
});