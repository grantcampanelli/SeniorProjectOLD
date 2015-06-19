define(function (require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('util/backbone-helper');
    var Hbs = require('handlebars');
    var Mn = require('backbone.marionette');
    var Q = require('q');
    var Radio = require('backbone.radio');
    var userChannel =  Radio.channel('user');

    var courseChannel = Radio.channel('course');
    var pageChannel = Radio.channel('page');
    var ModalHelpers = require('util/modal-helpers');
    var template = require('text!ctemplates/headerStudentDropdownView.hbs');
    var AddNewStudentView = require('app/addNewStudent');
    var ModifyStudentView = require('app/modifyStudent');
    var SelectStudentView = require('course/view/select-student-view');
    var DeleteStudentView = require('course/view/delete-student-view');
    var GroupStudentsView = require('course/view/group-students-view');

    return Mn.ItemView.extend({
        tagName: 'li',
        template: Hbs.compile(template),

        ui: {
            newStudent: ".newStudent",
            modifyStudent: ".modifyStudent",
            deleteStudent: ".deleteStudent",
            groupStudents: ".groupStudents",
            mockData: ".mockData"
        },



        events: {
            "click @ui.newStudent": "showNewStudent",
            "click @ui.modifyStudent": "showModifyStudent",
            "click @ui.deleteStudent": "showDeleteStudent",
            "click @ui.groupStudents": "showGroupStudents",
            "click @ui.mockData":"createMockGradeData"
        },

        initialize: function(options) {
            this.model = courseChannel.request('current:course');
            ModalHelpers.call(this);
        },

        showNewStudent: function(domEvent) {
            //courseChannel.command('showAllCourses');
            userChannel.request('user').then(function(user) {
                var modalRegion = pageChannel.request('modalRegion');
                modalRegion.show(new AddNewStudentView);


            })
        },

        showModifyStudent: function(domEvent) {
            //courseChannel.command('showUserCourses');
            //userChannel.request('user').then(function(user) {
            //    var modalRegion = pageChannel.request('modalRegion');
            //    modalRegion.show(new ModifyStudentView);
            //
            //
            //})
            userChannel.request('user').then(function(user) {
                courseChannel.request('select:student').then(function(selectedStudent) {
                    var modalRegion = pageChannel.request('modalRegion');
                    modalRegion.show(new ModifyStudentView({
                        'student': selectedStudent
                    }));
                }).done()
            })
        },

        showDeleteStudent: function(domEvent) {

            userChannel.request('user').then(function(user) {
                courseChannel.request('select:student').then(function (selectedStudent) {
                    var modalRegion = pageChannel.request('modalRegion');
                    modalRegion.show(new DeleteStudentView({
                        'student': selectedStudent
                    }));
                }).done();
            })


        },

        showGroupStudents: function(domEvent) {
            //courseChannel.command('showUserCourses');
            userChannel.request('user').then(function(user) {
                    var modalRegion = pageChannel.request('modalRegion');
                    modalRegion.show(new GroupStudentsView());
            })
        },
        
        createMockGradeData: function() {
            console.log('creating mock grade data...')
            var students = this.model.students;
            var assignments = this.model.assignments;
            students.each(function(student) {
                assignments.each(function(a) {
                    var rawScore = Math.round(70 + Math.random()*30);
                    student.setGrade(a.id, rawScore);
                })
            })
        }

    });
});

