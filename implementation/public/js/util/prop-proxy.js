define(function (require) {
    function proxyGet(obj, modelKey, displayKeyArg) {
        var displayKey = _.isString(displayKeyArg) ? displayKeyArg : modelKey;
        Object.defineProperty(obj, displayKey, {
            enumerable: false,
            configurable: true,
            get: function() {
                return obj.get(modelKey);
            }
        })
    }
    
    function proxyGetAndSet(obj, modelKey, displayKeyArg) {
        var displayKey = _.isString(displayKeyArg) ? displayKeyArg : modelKey;
        Object.defineProperty(obj, displayKey, {
            enumerable: false,
            configurable: true,
            
            get: function() {
                return obj.get(modelKey);
            },
            
            set: function(val) {
                return obj.set(modelKey, val);
            }
        })
    }
    
    return {
        proxyGet: proxyGet,
        proxyGetAndSet: proxyGetAndSet
    }
});
