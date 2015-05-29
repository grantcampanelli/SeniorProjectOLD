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
    var template = require('text!templates/deleteStudentView.hbs');
    var alertTemplate = require('text!templates/alert-block.hbs');
    //var DeleteStudentView = require('course/view/delete-student-view');
    //var SelectStudentView = require('course/view/select-student-view');

    var Course = require('course/course');
    var studentToDelete;

    var DeleteStudentView =  Mn.ItemView.extend({
        tagName: 'div',
        className: 'gradeScheme modal-dialog  modal-lg',
        template: Hbs.compile(template),

        ui: {
            //'backButton' : '.backButton',
            'deleteButton' : '.deleteButton'
        },

        events: {
            //'click @ui.backButton' :  'backToSelect',
            'click @ui.deleteButton': 'onDeleteButton'
        },
        render: function() {
            var students = this.model.get('students');
            var self = this;
            //console.log(this.options.student);
            students.each(function(s){
                if(self.options.student == s.get('user').at(0).get('emplId')) {
                    console.log("Match "+self.options.student);
                    studentToDelete = s.get('user').at(0);
                }
            });

            if(!studentToDelete) {
                console.log("error, student wasnt found for delete");
            }

            //console.log(studentToDelete.get('last'));

            this.$el.html(this.template({ first : studentToDelete.get('first'), last : studentToDelete.get('last')}));

            return this;


        },
        onShow: function(options) {
            var ui = this.ui;
            var self = this;
            var reqStudentPath = this.student;



            //var student = students.findWhere({"path" : reqStudentPath});

        },

        initialize: function(options) {
            //console.log(options);
            this.model = courseChannel.request('current:course');
            //console.log(options.student);
            this.student = options.student;

        },

        closeSelectStudent : function() {
            //$('.modal-content').empty();
            var modalRegion = pageChannel.request('modalRegion');
            _.defer(function() {
                modalRegion.empty();
            });
            //this.$el.data('modal', null);
            //this.remove();
            //this.$el.modal('hide');

            //var modalRegion = pageChannel.request('modalRegion');
            //modalRegion.empty();
            ////_.defer(function() {
            ////    modalRegion.empty();
            ////});
        },
        backToSelect : function() {
            //var self = this;
            //this.closeSelectStudent();
            //courseChannel.request('select:student').then(function(selectedStudent) {
                var modalRegion = pageChannel.request('modalRegion');
                _.defer(function() {
                    modalRegion.empty();
                });
            _.defer(function() {
                modalRegion.show( new DeleteStudentView({
                   // 'student': studentToDelete
                }));
            });

            //var modalRegion = pageChannel.request('modalRegion');
            //modalRegion.show(new DeleteStudentView());


        },
        onDeleteButton : function() {
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