/**
 * @author Michael Murphy
 */
define(function (require) {
   var $ = require('jquery');
   var _ = require('underscore');
   var Q = require('q');
   var Handlebars = require('handlebars');
   var Backbone = require('util/backbone-helper');
   var ModalRegion = require('util/modal-region');
   var PopupRegion = require('util/popup-region');
   var RootRegion = require('util/root-region');
   var BasicLayoutView = require('util/basic-layout-view');
   var HeaderNavView = require('util/header-nav-view');
   var LoadingView = require('util/loading-promise-view');
   var Radio = require('backbone.radio');
   
   var pageChannel = Radio.channel('page');
   
   function navigateToPage(path, options) {
      var options = _.extend({
         trigger: true,
         replace: false
      }, options);
      Backbone.history.navigate(path, options);
   }
   
   /**
    * A container object for the application. By requiring this module you gain
    * access to  various libraries  and other application components
    */
   var App = window.App = new Backbone.Marionette.Application({
   
      /**
       * The jQuery JavaScript library.
       * http://api.jquery.com/
       */
      $: $,
   
      /**
       * The underscore JavaScript library.
       * http://underscorejs.org/
       */
      _: _,
   
      /**
       * The handlebars JavaScript library.
       * http://handlebarsjs.com/
       */
      Handlebars: Handlebars,
   
      /**
       * An alias for the handlebars JavaScript library.
       * http://handlebarsjs.com/
       */
      Mustache: Handlebars,
   
      /**
       * An alias for the handlebars JavaScript library.
       * http://handlebarsjs.com/
       */
      Hbs: Handlebars,
   
      /**
       * The backbone JavaScript library.
       * http://backbonejs.org/
       */
      Backbone: Backbone,
   
      /**
       * The Marionettes JavaScript library
       * http://marionettejs.com/
       */
      Marionette: Backbone.Marionette,
   
      /**
       * An alias for the Marionettes JavaScript library
       * http://marionettejs.com/
       */
      Mn: Backbone.Marionette,
      
      
   
      /**
       * The Q JavaScript library. My favorite promise library :)
       * https://github.com/kriskowal/q
       */
      Q: Q,
   
      /**
       * A framework for decoupling components of the application.
       * https://github.com/marionettejs/backbone.radio
       */
      Radio: Backbone.Radio,
   
      /**
       * A marionette router.
       */
      Router: new Backbone.Marionette.AppRouter({
         routes : {}
      }),
      
      initialize: function(option) {
         this.modal = new ModalRegion();
         this.RootRegion = new RootRegion();
         var basicView = this.show(new BasicLayoutView);
         var navView = new HeaderNavView;
         basicView.showHeader(navView);

         pageChannel.reply('mainRegion', basicView.getRegion('main'));
         pageChannel.reply('navRegion', navView.getRegion('left'));
         pageChannel.reply('modalRegion', this.modal);
         pageChannel.reply('show:loading', function(promise) {
            var loadingView = new LoadingView({promise: promise});
            basicView.getRegion('main').show(loadingView);
            return loadingView;
         });
         },
      /**
       * A method to navigate to route in the application.
       */
      go: navigateToPage,
   
      /**
       * A convenience method to show up you inside the RootRegion.
       * @param view A marionette view
       * @returns {*} the view parameter
       */
      show: function(view) {
         this.RootRegion.show(view);
         return view;
      }
   });
   
   App.on("start", function(){
      Backbone.history.start({pushState: true});
   });
   
   return App
});