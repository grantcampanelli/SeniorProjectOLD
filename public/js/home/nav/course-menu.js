define(function (require) {
    var Backbone = require('util/backbone-helper');
    var Radio = require('backbone.radio');
    var NavMenuView = require('util/nav-menu-view');

    var CourseDropdownMenu = require('course/nav/course-dropdown-view');
    var StudentDropdownMenu = require('course/nav/student-dropdown-view');
    var AssignmentDropdownMenu = require('course/nav/assignment-dropdown-view');

    var courseMenu = new Backbone.Collection([
        new Backbone.Model({
            viewClass: CourseDropdownMenu
        }),
        new Backbone.Model({
            viewClass: StudentDropdownMenu
        }),
        new Backbone.Model({
            viewClass: AssignmentDropdownMenu
        })
    ]);

    Radio.channel('course').reply('view:menu', function (coursesList) {
        return new NavMenuView({collection: courseMenu});
    });
});

