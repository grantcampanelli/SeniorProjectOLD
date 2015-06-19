define(function (require) {
    var _ = require('underscore')
    var Q = require('q')
    var App = require('app/app');
    var Backbone = require('util/backbone-helper');
    var Radio = require('backbone.radio');
    var Mn = require('backbone.marionette');

    require('course/_init');
    Radio.DEBUG = true;
    Radio.tuneIn('course');

    var userChannel = require('user/module');
    var pageChannel = Radio.channel('page');
    var courseChannel = Radio.channel('course');

    var controller = {

        allCoursesPage: function () {
            var list = courseChannel.request('new:CourseList');
            var fetchPromise = list.fetch();
            this.resetPage();
            courseChannel.request('set:current:list', list);
            pageChannel.request('show:loading', fetchPromise);
            fetchPromise.then(function () {
                var navMenu = courseChannel.request('view:list:menu');
                var listView = courseChannel.request('view:list')//, list);
                pageChannel.request('navRegion').show(navMenu);
                //pageChannel.request('mainRegion').show(listView);
                App.go('/', {trigger: false, replace: true});
            });
        },

        userCoursesPage: function () {
            return userChannel.request('user').then(function (user) {
                var userCoursesPromise = userChannel.request('user:courses');
                pageChannel.request('show:Loading', userCoursesPromise);
                userCoursesPromise.then(function (userCourses) {
                    courseChannel.request('current:list', userCourses);
                    var navMenu = courseChannel.request('view:list:menu');
                    var view = courseChannel.request('view:list', userCourses);
                    pageChannel.request('navRegion').show(navMenu);
                    pageChannel.request('mainRegion').show(view);
                    return userCourses;
                });
            });
        },

        openCoursePage: function (path) {
            this.resetPage();
            var course = courseChannel.request('new:Course', {
                colloquialUrl: path
            });
            var students = courseChannel.request('students', course);
            var categories = courseChannel.request('categories', course);
            var assignments = courseChannel.request('assignments', course);


            var loadingTasks = [
                course.fetch(),
                students.fetch(),
                categories.fetch(),
                assignments.fetch()
            ];

            var loadAllPromise = Q.all(loadingTasks);
            courseChannel.request('set:current:course', course);
            pageChannel.request('show:loading', loadAllPromise);

            return loadAllPromise.then(function () {
                course.students = students;
                course.categories = categories;
                course.assignments = assignments;

                var menu = courseChannel.request('view:menu');
                var gradebook = courseChannel.request('view:gradebook');

                pageChannel.request('navRegion').show(menu);
                pageChannel.request('mainRegion').show(gradebook);
                course.trigger('open');
            });
        },

        resetPage: function () {
            pageChannel.request('mainRegion').empty();
            pageChannel.request('navRegion').empty();
        }
    }

    courseChannel.request('showUserCourses', function () {
        controller.userCoursesPage();
    });

    courseChannel.comply('showAllCourses', function () {
        controller.allCoursesPage();
    });

    App.Router.processAppRoutes(controller, {
        "(/)": "allCoursesPage",
        "courses(/)": "allCoursesPage",
        "user/courses(/)": "userCoursesPage",
        "courses/:path(/)": "openCoursePage"
    });
});