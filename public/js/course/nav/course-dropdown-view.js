define(function (require) {
    var _ = require('underscore');
    var Hbs = require('handlebars');
    var Mn = require('backbone.marionette');
    var Radio = require('backbone.radio');
    var ModalHelpers = require('util/modal-helpers');
    
    var CreateCourseView = require('course/view/new-course-view');
    var ManageCourseView = require('course/view/modify-course-view');
    var GradeSchemeView  = require('course/view/grade-scheme-view');
    var PermissionsView  = require('course/view/course-permissions-view');
    var LatePolicyView  = require('course/view/late-policy-view');
    
    var template = require('text!ctemplates/headerCourseDropdownView.hbs');
    
    var userChannel = Radio.channel('user');
    var courseChannel = Radio.channel('course');
    var pageChannel = Radio.channel('page');

    return Mn.ItemView.extend({
        tagName: 'li',
        template: Hbs.compile(template),

        ui: {
            newCourse: ".newCourse",
            manageCourse: ".manageCourse",
            gradeScheme: ".gradeScheme",
            latePolicy: ".latePolicy",
            permissions: ".permissions",
            mockData: ".mockData"
        },

        events: {
            "click @ui.newCourse": "showNewCourse",
            "click @ui.manageCourse": "showManageCourse",
            "click @ui.gradeScheme": "showGradeScheme",
            "click @ui.latePolicy": "showLatePolicy",
            "click @ui.permissions": "showPermissions",
            "click @ui.mockdata": "createMockData"
        },
        
        initialize: function() {
            ModalHelpers.call(this);
        },

        showNewCourse: function(domEvent) {
            var self = this;
            this.ensureLoginThenShowModal(new CreateCourseView());
        },

        showManageCourse: function(domEvent) {
            this.ensureLoginThenShowModal(new ManageCourseView());
        },

        showGradeScheme: function(domEvent) {
            this.ensureLoginThenShowModal(new GradeSchemeView())
        },

        showLatePolicy: function(domEvent) {
            this.ensureLoginThenShowModal(new LatePolicyView())
        },

        showPermissions: function(domEvent) {
            this.ensureLoginThenShowModal(new PermissionsView())
        },
        
        createMockData: function() {
            console.log('mock data created')
            var x = courseChannel.request('current:course');
            x.students.each(function(s){ 
                var a = [];
                _.each(x.categories.allAssignments, function(e) {
                    a.push({
                        assignment : e,
                        rawScore : _.random(50,100)
                    })
                s.attributes.grades = a;
            })});
            x.save();
            console.log('mock data created')
        }
    });
});

