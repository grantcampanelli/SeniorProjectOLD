/** @author Michael Murphy */
requirejs.config({
   // By default load any module IDs from js/lib
   baseUrl: '/js/lib',
   // except, if the module ID starts with "app",
   // load it from the js/app directory. paths
   // config is relative to the baseUrl, and
   // never includes a ".js" extension since
   // the paths config could be for a directory.
   paths: {
      app: '../app',
      text: 'text',
      templates: '../../templates'
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
      },
      enforceDefine: true
   }
});

// Start the main app logic.
requirejs(['handlebars', 'app/app', 'app/login', 'app/home', 'domReady!'], function(Handlebars, app) {



   console.log()
   //var AppRouter = Backbone.Router.extend({
   //   currentScreen: null,
   //   //todo add more routes...
   //   routes: {
   //      "courses(/)": "courses"
   //
   //   },
   //   courses: function() {
   //      $('main').empty();
   //      $('main').append("courses");
   //      console.log('hi')
   //   }
   //});

   // Initiate the router
   //var router = new AppRouter();

   app.start({});


});

/**
 * @author Mike Ryu
 */
// 'text!templates/addNewClassView.html' addNewClassView
//var AddNewClassView = Backbone.View.extend({
//
//   template: Handlebars.compile(addNewClassView),
//   errorMessage: '',
//
//   initialize: function() {
//      this.render();
//   },
//
//   events: {
//      "click button": "doAddClass"
//   },
//
//   doAddClass: function(e) {
//      e.preventDefault();
//      var self = this;
//
//      console.log("Add Class button pressed!");
//   }
//
//});