define(function (require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('util/backbone-helper');
    var Q = require('q');
    var Radio = require('backbone.radio');

    //var UserCourseList = require('user/user-course-list');
    
    
    var LoginView = require('user/login-view')
    var Session = require('user/session');
    
    var userChannel = Radio.channel('user');
    var pageChannel = Radio.channel('page');
    var session = new Session();
    

    function login() {
        var deferred = Q.defer();
        if (session.isAuthenticated()) {
            deferred.resolve(session.get('user'));
        }
        else {
            session.once('login', function(user) {
                
                deferred.resolve(user);
                //pageChannel.request('modalRegion');//.empty();
            });
            var loginView = new LoginView();
            loginView.once('destroy', function() {
                deferred.reject('login modal closed by user');
            });
            pageChannel.request('modalRegion').show(loginView);
            
        }
        return deferred.promise;
    }

    //function loadUserCourses() {
    //    return login().then(function(user) {
    //        var userCourses = new UserCourseList({user: user});
    //        userCourses.once('fetch', function() {
    //            userChannel.trigger("user:courses:fetch", userCourses);
    //        });
    //        return userCourses.fetch().then(function() {
    //            return userCourses;
    //        });
    //    }).done();
    //}
       
    
    session.on('all', function() {
        userChannel.trigger.apply(userChannel, arguments);
    });
    
    userChannel.reply('session', session);
    userChannel.comply('login', login);
    userChannel.reply('login', login);
    userChannel.reply('user', login);
    //userChannel.reply('user:courses', loadUserCourses);
    
    //userChannel.on('all', console.log);
    
    return userChannel;
});
