define(function (require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('util/backbone-helper');
    var Hbs = require('handlebars');
    var Mn = require('backbone.marionette');
    var Q = require('q');
    var Radio = require('backbone.radio');
    var pageChannel = Radio.channel('page');
    var courseChannel = Radio.channel('course');
    var template = require('text!ctemplates/deleteStudentView.hbs');
    var alertTemplate = require('text!ctemplates/alert-block.hbs');
    //var DeleteStudentView = require('course/view/delete-student-view');
    //var SelectStudentView = require('course/view/select-student-view');

    var Course = require('course/model/course');
    var studentToDelete;

    var DeleteStudentView = Mn.ItemView.extend({
        tagName: 'div',
        className: 'gradeScheme modal-dialog  modal-lg',
        template: Hbs.compile(template),

        ui: {
            //'backButton' : '.backButton',
            'deleteButton': '.deleteButton',
            'cancel': '.cancel'
        },

        events: {
            //'click @ui.backButton' :  'backToSelect',
            'click @ui.deleteButton': 'onDeleteButton'
        },
        render: function () {
            var students = this.model.students;
            var self = this;
            //console.log(this.options.student);
            students.each(function (s) {
                if (self.options.student == s.get('emplId')) {
                    console.log("Match " + self.options.student);
                    self.studentToDelete = s;
                }
            });

            if (!self.studentToDelete) {

                console.log("error, student wasnt found for delete");
            }

            //console.log(studentToDelete.get('last'));

            this.$el.html(this.template({
                first: self.studentToDelete.get('first'),
                last: self.studentToDelete.get('last')
            }));

            return this;


        },
        onShow: function (options) {
            var ui = this.ui;
            var self = this;
            var reqStudentPath = this.student;

            //var student = students.findWhere({"path" : reqStudentPath});

        },

        initialize: function (options) {
            //console.log(options);
            this.model = courseChannel.request('current:course');
            //console.log(options.student);
            this.student = options.student;

        },

        closeSelectStudent: function () {
            this.studentToDelete.destroy();

            var modalRegion = pageChannel.request('modalRegion');
            modalRegion.hideModal()
            var gradebook = courseChannel.request('view:gradebook');
            pageChannel.request('mainRegion').show(gradebook);

        },
        backToSelect: function () {
            //var self = this;
            //this.closeSelectStudent();
            //courseChannel.request('select:student').then(function(selectedStudent) {
            var modalRegion = pageChannel.request('modalRegion');
            _.defer(function () {
                modalRegion.empty();
            });
            _.defer(function () {
                modalRegion.show(new DeleteStudentView({
                    // 'student': studentToDelete
                }));
            });

            //var modalRegion = pageChannel.request('modalRegion');
            //modalRegion.show(new DeleteStudentView());


        },
        onDeleteButton: function () {
            //console.log('delete now!');
            //var self = this;
            //var students = this.model.get('students');
            //console.log(this.model.students);
            //console.log(studentToDelete.id);
            //studentToDelete.destroy();
            //var studentId = studentToDelete.get('id');
            //console.log(this.model.get('students'));
            //this.model.get('students').each(function(s){
            //    console.log(studentToDelete.id +" - "+ s.id);
            //    if(studentToDelete.id == s.id) {
            //        console.log("Destroy: "+s);
            //        s.destroy();
            //    }
            //});

            //this.model.get('students').each(function(s){
            //    if(self.options.student == s.get('user').at(0).get('emplId')) {
            //        console.log("Match "+self.options.student);
            //        console.log("Destroy: ");
            //        console.log(s);
            //        s.destroy();
            //    }
            //});

            //console.log(this.model.students.where({id: studentId}))
            //this.model.students.where({id: studentId}).destroy();
            //this.model.save();
            //console.log(this.model.students);

            this.closeSelectStudent();
        }

    });
    return DeleteStudentView;
});