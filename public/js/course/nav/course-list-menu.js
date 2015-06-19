define(function (require) {
    var Backbone = require('util/backbone-helper');
    var Radio = require('backbone.radio');
    var NavMenuView = require('util/nav-menu-view');
    
    //var CourseListFilterDropdownMenu = require('course/nav/filter-list-view');
    var CreateCourseButton = require('course/nav/new-course-button-view');
    
    var courseListMenu = new Backbone.Collection([
        //new Backbone.Model({
        //    viewClass: CourseListFilterDropdownMenu
        //}),
        new Backbone.Model({
            viewClass: CreateCourseButton
        })
    ]);

    Radio.channel('course').reply('view:list:menu', function() {
        return new NavMenuView({
            collection: courseListMenu
        });
    });
});