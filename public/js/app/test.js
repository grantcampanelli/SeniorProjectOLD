QUnit.config.autostart = false;
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
      util: '../util',
      user: '../user',
      course: '../course',
      text: 'text',
      templates: '../../templates',
      ctemplates: '../course/templates',
      api: '../../api',
      test: '../test'
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
      'jquery-ui': ['jquery'],
      'jquery.magnific-popup' : ['jquery', 'jquery-ui'],
      'bootstrap': ['jquery'],
      'qunit': {
          exports: 'QUnit'
      }
   }
});

// Start the main app logic.
define(function (require) {
   var Radio = require('backbone.radio');
   var Q = require('q');
   require('user/module');
   require('course/module');
   require('app/chart');
   require('app/modifyAssignment');
   require('app/modifyCategory');
   require('app/modifyClass');
   require('app/modifyStudent');
   require('app/addNewStudent')
   require('bootstrap');
   require('test/test-example')
   var channel = Radio.channel('test');
   var Course = require('course/model/course')
   require('domReady!');
   var QUnit = require('qunit');
   QUnit.start();
   channel.reply('qunit', function() {
      return QUnit;
   })
   channel.reply('test-course', function() {
      return new Course({
         
      });
   })
   App.start({});

   channel.trigger('start')

   return App;
});
