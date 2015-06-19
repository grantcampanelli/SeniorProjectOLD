define(function (require) {
    var App = require('app/app');
    var Backbone = require('util/backbone-helper');
    var Hbs = require('handlebars');
    var Mn = require('backbone.marionette');

    var Radio = require('backbone.radio');
    var courseListItemTemplate = require('text!ctemplates/courseListing.hbs');
    
    var CourseListItemView = Mn.ItemView.extend({
        tagName: "div",
        className: "col-md-4",
        template: Hbs.compile(courseListItemTemplate),
        
        modelEvents: {
            "change": "render"
        },
        
        events: {
            'click a': "openCourse"
        },
        
        openCourse: function loadGradebookPage(domEvent) {
            App.go('/courses/'+this.model.get('colloquialUrl'));
            domEvent.preventDefault();
        }
    });

    var EmptyCourseListView = Mn.ItemView.extend({
        template: Hbs.compile("")
    });
    
    var CourseListView = Mn.CollectionView.extend({
        className: "row",
        childView: CourseListItemView,
        emptyView: EmptyCourseListView,
    })
    
    var courseChannel = Radio.channel('course');
    courseChannel.reply('view:list', function(courseList) {
        if (!courseList) {
            courseList = courseChannel.request('current:list');
        }
        return new CourseListView({collection: courseList});
    });
    
    return CourseListView;
});