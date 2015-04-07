requirejs.config({
   // By default load any module IDs from js/lib
   baseUrl: 'js/lib',
   // except, if the module ID starts with "app",
   // load it from the js/app directory. paths
   // config is relative to the baseUrl, and
   // never includes a ".js" extension since
   // the paths config could be for a directory.
   paths: {
      app: '../app',
      text: 'text'
   },
   // The shim configuration is simple to use:
   // (1) one states the dependencies (deps), if any, (which may be from the
   //     paths configuration, or may be valid paths themselves).
   // (2) (optionally) specify the global variable name from the file you're
   //     shimming, which should be exported to your module functions that
   //     require it. (If you don't specify the exports, then you'll need to
   //     just use the global, as nothing will get passed into your
   //     require/define functions.)
   shim: {
      underscore: {
         exports: '_'
      },
      backbone: {
         deps: ["underscore", "jquery"],
         exports: "Backbone"
      }
   }
});

// Start the main app logic.
requirejs(['jquery', 'underscore', 'backbone', 'handlebars', 'text!templates/loginView.hbs'],function($, _, Backbone, Handlebars, loginView) {
   var CurrentUser = Backbone.Model.extend({

   });
   $(function() {

   console.log("hello!");
   var AppView = Backbone.View.extend({

   el: $("#grader-app"),
   loginTemplate = Handlebars.compile(loginView)

   });
   var User = Backbone.Model.extend({});
   var UserView = Backbone.View.extend({});
   });
});