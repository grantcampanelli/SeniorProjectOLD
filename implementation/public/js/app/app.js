/** @author Michael Murphy */
define(['jquery', 'underscore', 'q', 'backbone', 'handlebars', 'text!templates/standardLayoutView.hbs', 'backbone.marionette', 'radio.shim', 'backbone.radio', 'jquery.magnific-popup', 'domReady!'], function($, _, Q, Backbone, Handlebars, rootLayoutTemplate, Marionette) {
   Backbone.Marionette.Renderer.render = function(template, data){
      return template(data);
   };

   var RootRegion = Marionette.Region.extend({
      el: '#root'
   });

   var PopupRegion = Marionette.Region.extend({
      el: "#popup",
      allowMissingEl: false,
      initialize: function () {
         this.classAttr = this.$el.attr("class").concat(" ");
      },
      onShow: function(view) {
         //var elm = this.$el.empty().append(view.el);
         var self = this;
         this.$el.attr("class", this.classAttr + view.className);
         var popupArg = _.extend({
            items: {
               src: self.el
            },
            type: 'inline',
            callbacks: {}

         }, view.popup);

         $.magnificPopup.open(popupArg);
         this.$el.position({
            of: window
         });
      },
      onBeforeEmpty: function() {
         $.magnificPopup.close();
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

   var StandardLayoutView = Marionette.LayoutView.extend({
      template: Handlebars.compile(rootLayoutTemplate),
      regions: function(options) {
         return {
            header: "header.root",
            main: "main.root",
            footer: "footer.root"
         }
      },
      destroyImmediate: true
   });

   function go(path, options) {
      var options = _.extend({
         trigger: true,
         replace: false
      }, options);
      Backbone.history.navigate(path, options);
   }

   var App = window.App = new Marionette.Application({
      $: $,
      _: _,
      Handlebars: Handlebars,
      Mustache: Handlebars,
      Hbs: Handlebars,
      Backbone: Backbone,
      Marionette: Marionette,
      Mn: Marionette,
      PopupRegion: new PopupRegion({}),
      PopupView: PopupView,
      Q: Q,
      Radio: Backbone.Radio,
      Router: new Marionette.AppRouter({
         controller: {},
         appRoutes: {},
         routes : {}
      }),
      RootRegion: new RootRegion(),
      StandardLayoutView: StandardLayoutView,
      initialize: function() {

      },
      login: function() {
         var deferred = Q.defer();
         var self = this;
         if (this.session.isAuthenticated()) {
            deferred.resolve(this.session.get('user'));
         }
         else {
            this.session.once('login', function(user) {
               self.PopupRegion.empty();
               deferred.resolve(user);
            });
            this.displayLogin();
         }
         return deferred.promise;
      },
      go: go,
      view: function(path, options) {
         go.call(this, path, _.extend({replace: true}, options));
      },
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