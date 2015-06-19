/** @author Michael Murphy */

QUnit.config.autostart = false;

requirejs.config({

    baseUrl: '/js/lib',

    paths: {
        app: '../app',
        util: '../util',
        user: '../user',
        course: '../course',
        text: 'text',
        templates: '../../templates',
        api: '../../api',
        test: '../test'
    },

    shim: {
        'jquery-ui': ['jquery'],
        'jquery.magnific-popup': ['jquery', 'jquery-ui'],
        'bootstrap': ['jquery'],
        'qunit': {
            exports: 'QUnit'
        }
    }
});

// Start the main app logic.
define(function(require) {
    var App = require('app/app');
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
   require('domReady!');

    require('bootstrap');
    require('user/module');
    require('course/module');

    var channel = Radio.channel('test');
    var Course = require('course/modelcourse')
    require('domReady!');
    var t1 = require('test/category-tests');
    var t2 = require('test/assignment-tests');
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
