/**
 * @author Michael Murphy
 */
define(['jquery', 'underscore', 'q', 'backbone', 'handlebars', 'text!templates/standardLayoutView.hbs', 'text!templates/loading.hbs', 'backbone.marionette', 'radio.shim', 'backbone.radio', 'jquery.magnific-popup', 'backbone-relational', 'app/backbone-helpers', 'domReady!'], function($, _, Q, Backbone, Handlebars, standardLayoutTemplate, loadingViewTemplate, Marionette) {

   Backbone.Marionette.Renderer.render = function(template, data) {
      return template(data);
   };

   var RootRegion = Marionette.Region.extend({
      el: '#root'
   });

   var PopupRegion = Marionette.Region.extend({
      el: "#popup",
      allowMissingEl: false,
      isVisible: false,
         
      initialize: function () {
         var self = this;
         this.defaultPopupArgs = {
            items: {
               src: self.el
            },
            type: 'inline',
            callbacks: {
               open: function() {
                  self.isVisible = true;
               },
               close: function() {
                  self.isVisible = false;
               }
            }
         }
         this.classAttr = this.$el.attr("class").concat(" ");
         $(window).on("resize", this.onResize.bind(this));
      },
      
      positionPopup: function() {
         this.$el.position({
            of: window
         });
      },
      
      onShow: function(view) {
         var popupArg = _.extend({}, this.defaultPopupArgs, view.popup);
         this.$el.attr("class", this.classAttr + view.className);
         $.magnificPopup.open(popupArg);
         this.positionPopup();
      },
      
      onResize: function() {
         if (this.isVisible) {
            this.positionPopup();
         }
      },
      
      onBeforeEmpty: function() {
         $.magnificPopup.close();
      },
      
      close: function() {
         this.empty();
      }
   });

   var PopupView = Marionette.ItemView.extend({
      popup: {
         enableEscapeKey: true,
         focus: "",
         closeOnContentClick: false,
         closeOnBgClick: true,
         closeBtnInside: true,
         showCloseBtn: true,
         modal: false,
         alignTop: false,
         fixedContentPos: "auto",
         index: null,
         fixedBgPos: "auto",
         overflowY: "auto",
         removalDelay: 0
      }
   });

   /**
    * A LayoutView with 3 regions: `header`, `main`, and `footer`
    * @author Michael Murphy
    *
    */
   var StandardLayoutView = Marionette.LayoutView.extend({
      template: Handlebars.compile(standardLayoutTemplate),
      regions: function(options) {
         return {
            header: "header.root",
            main: "main.root",
            footer: "footer.root"
         }
      },
      destroyImmediate: true
   });
   
   var LoadingView = Marionette.ItemView.extend({
      className: "loading",
      tagName: "div",
      template: Handlebars.compile(loadingViewTemplate),
      progress: "",
      
      ui: {
         progress: ".progress"
      },
      
      modelEvents: {
         "fetch:progress": "onProgress",
         "save:progress": "onProgress"
      },
      
      onProgress: function(percentDone) {
         this.progress = percentDone.toString() + "%";
         this.ui.progress.html(this.progress);
      }
      
   });

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
   var App = window.App = new Marionette.Application({

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
      Marionette: Marionette,

      /**
       * An alias for the Marionettes JavaScript library
       * http://marionettejs.com/
       */
      Mn: Marionette,

      /**
       * The Marionette region for pop-ups. Application code may call the show
       * method of this  object to display a pop-up on screen.
       */
      PopupRegion: new PopupRegion({}),

      /**
       * Application code should extend this to create a pop up view. This is a
       * marionette view.
       */
      PopupView: PopupView,

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

      Relational: Backbone.Relational,

      /**
       * A marionette router.
       */
      Router: new Marionette.AppRouter({
         routes : {}
      }),

      /**
       * The marionette region for Main content of the page.
       */
      RootRegion: new RootRegion(),
      
      /**
       * A loading view that shows fetch and save progress
       */
      LoadingView: LoadingView,

      /**
       * A marionette layout view with a header region, main region, and footer
       * region.
       */
      StandardLayoutView: StandardLayoutView,
      
      initialize: function() {

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

   Backbone.RelationalModel.extend({
      urlRoot: '/api/message',
      idAttribute: 'colloquialUrl'

   });

   App.on("start", function(){
      Backbone.history.start({pushState: true});
   });

   return App
});