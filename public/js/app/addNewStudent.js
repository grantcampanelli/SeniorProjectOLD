/**
 * Event handler for the add new student view.
 * @author Grant Plaster
 */
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
    var template = require('text!templates/addNewStudentView.hbs');
    var alertTemplate = require('text!ctemplates/alert-block.hbs');

    var Course = require('course/model/course');
    var StudentRecord = require('course/model/student');


    return Mn.ItemView.extend({
        tagName: 'div',
        className: 'newStudent modal-dialog  modal-lg',
        template: Hbs.compile(template),
        ui: {
            'addStudentButton' : '.addStudentButton',
            'save' : '.save',
            'cancel' : '.cancel',
            'dialog' : '.popup-dialog',
            'studentFirstName' : '.studentFirstName',
            'studentLastName' : '.studentLastName',
            'studentID' : '.studentID',
            'studentNickname' : '.studentNickname',
            'studentGroup' : '.studentGroup',
            'studentEmail' : '.studentEmail',
            'studentPhone' : '.studentPhone',
            'error': '.error'

        },
        initialize : function () {
             this.model = courseChannel.request('current:course');
             this.alertTemplate = Hbs.compile(alertTemplate);
        },

        /**
         * Hides the dialog on initial load
         *
         * @this {AddStudentView}
         */
        //onShow : function(){
        //    this.ui.dialog.hide();
        //},
        events : {
            'click @ui.addStudentButton' :  'showAddStudent',
            'click @ui.save' :  'addStudentInfo',
            'click @ui.cancel' :  'closeAddStudent'
        },

        /**
         * Hides the pop-up button to display fields for adding student data.
         *
         * @this {AddStudentView}
         */
        //showAddStudent : function() {
        //    this.ui.dialog.show();
        //    this.ui.addStudentButton.hide();
        //
        //    //this.ui.studentFirstName.val(this.model.get('first'));
        //    //this.ui.studentLastName.val(this.model.get('last'));
        //    //this.ui.studentID.val(this.model.get('emplId'));
        //    //this.ui.studentEmail.val(this.model.get('email'));
        //    //this.ui.studentPhone.val(this.model.get('phone'));
        //},

        /**
         * Saves new student data in the database.
         *
         * @this {AddStudentView}
         */
        addStudentInfo : function () {

            //var firstName = this.ui.studentFirstName.val();
            //var lastName = this.ui.studentLastName.val();
            //var id = this.ui.studentID.val();
            //var nickname = this.ui.studentNickname;
            //var group = this.ui.studentGroup;
            //var email = this.ui.studentEmail.val();
            //var phone = this.ui.studentPhone;

            var ui = this.ui;
            var self = this;

            var newStudent = {};
            newStudent.course = this.model.get('colloquialUrl');

            if ($('.studentFirstName').val()) {

                newStudent.first = $('.studentFirstName').val();
            }

            if ($('.studentFirstName').val().length === 0) {
                    self.ui.error.html(self.alertTemplate({
                        message: "Student first name can not be empty"
                    }));
                    
                    return;
            }

            if ($('.studentLastName').val()) {

                newStudent.last = $('.studentLastName').val();
            }

            if ($('.studentLastName').val().length === 0) {
                    self.ui.error.html(self.alertTemplate({
                        message: "Student last name can not be empty"
                    }));

                    return;
            }

            if ($('.studentID').val()) {
                newStudent.emplId = $('.studentID').val();
            }

            if (isNaN($('.studentID').val()) || $('.studentID').val().length !== 8) {
                self.ui.error.html(self.alertTemplate({
                    message: "Student ID must be 8 digits"
                }));

                return;
            }

            if ($('.studentNickname').val()) {
                newStudent.nickname = $('.studentNickname').val();
            }

            if ($('.studentGroup').val())
                newStudent.group = $('.studentGroup').val();

            if ($('.studentEmail').val()) {
                newStudent.email = $('.studentEmail').val();
            }

            if ($('.studentEmail').val().length === 0) {
                    self.ui.error.html(self.alertTemplate({
                        message: "Student email can not be empty"
                    }));

                    return;
            }

            if ($('.studentPhone').val()) {
                newStudent.phone = $('.studentPhone').val();
            }

            if ($('.studentPhone').val().length !== 10 || isNaN($('.studentPhone').val())) {
                    self.ui.error.html(self.alertTemplate({
                        message: "Student phone number must be 10 digits"
                    }));

                    return;
            }

            //this.model.students.push(newStudent);
            var student = new StudentRecord(newStudent);
            student.save()
            this.model.students.push(student);

            this.closeModal();


            //this.ui.dialog.hide();
            //Backbone.emulateHTTP = true;
            //var self = this;
            //this.model.save().then(self.closeModal());
        },
        closeModal : function () {
            var modalRegion = pageChannel.request('modalRegion');
            modalRegion.hideModal()
            window.location.reload();
        }

        /**
         * Closes the add student dialog without any changes to information.
         *
         * @this {AddStudentView}
         */

        //closeModifyStudent : function() {
        //    this.ui.dialog.hide();
        //    this.ui.addStudentButton.show();
        //}


    })

});


