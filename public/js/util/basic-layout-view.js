/**
 * A LayoutView with 3 regions: `header`, `main`, and `footer`
 * @author Michael Murphy
 */
define(function(require) {
   var $ = require('jquery');
   var _ = require('underscore');
   var Q = require('q');
   var Backbone = require('util/backbone-helper');

   var Handlebars = require('handlebars');
   var standardLayoutTemplate = require('text!templates/basicLayout.hbs');

   return Backbone.Marionette.LayoutView.extend({
      template: Handlebars.compile(standardLayoutTemplate),
      destroyImmediate: true,

      headerView: false,
      mainView: false,
      footerView: false,

      initialize: function(options) {
         if (options.headerView)
            this.headerView = options.headerView;
         if (options.mainView)
            this.mainView = options.mainView;
         if (options.footerView)
            this.footerView = options.footerView;
      },

      showHeader: function(view) {
         this.headerView = view;
         this.onShow();
      },

      showMain: function(view) {
         this.mainView = view;
         this.onShow();
      },

      showFooter: function(view) {
         this.footerView = view;
         this.onShow();
      },

      regions: function(options) {
         return {
            header: "header.root",
            main: "main.root",
            footer: "footer.root"
         }
      },

      onShow: function() {
         if (this.headerView)
            this.getRegion('header').show(this.headerView);
         if (this.mainView)
            this.getRegion('main').show(this.mainView);
         if (this.footerView)
            this.getRegion('footer').show(this.footerView);
      }


   });
});