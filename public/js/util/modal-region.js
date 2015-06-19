define(function (require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('util/backbone-helper');
    var Mn = require('backbone.marionette');
    require('bootstrap');
    
    return Mn.Region.extend({
        el: "#modal",
        
        constructor: function(){
            var self = this;
            
            Backbone.Marionette.Region.prototype.constructor.apply(this, arguments);
            this.on("show", this.showModal, this);
            this.$el.on('shown.bs.modal', function() {
                
                self.trigger('shown.bs.modal')
            });
            this.$el.on('hidden.bs.modal', function() {
                
                self.trigger('hidden.bs.modal')
            });
            
            
        },
        
        getEl: function(selector){
            var $el = $(selector);
            $el.on("hidden", this.close);
            return $el;
        },
        
        showModal: function(view){
            this.once('shown.bs.modal', function() {
                view.triggerMethod('shown:modal');
            });
            view.once("close", this.hideModal, this);
            this.$el.modal('show');
        },
        
        hideModal: function(){
            this.$el.modal('hide');
        },
        
        triggerShown: function() {
            this.trigger('shown.bs.modal');
        }
    });
});