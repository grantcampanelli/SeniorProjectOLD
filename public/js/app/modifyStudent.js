/**
 * Event handler for the modify student view.
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
    var template = require('text!templates/modifyStudentView.hbs');
    var alertTemplate = require('text!ctemplates/alert-block.hbs');

    return Mn.ItemView.extend({
        tagName: 'div',
        className: 'modifyStudent modal-dialog  modal-lg',
        model:  Backbone.model,
        template: Hbs.compile(template),
        ui: {
            'modifyStudentButton': '.modifyStudentButton',
            'save': '.save',
            'cancel': '.cancel',
            'dialog': '.popup-dialog',
            'studentFirstName': '.studentFirstName',
            'studentLastName': '.studentLastName',
            'studentID': '.studentID',
            'studentNickname': '.studentNickname',
            'studentGroup': '.studentGroup',
            'studentEmail': '.studentEmail',
            'studentPhone': '.studentPhone',
            'error': '.error'
        },

        events: {
            'click @ui.save': 'saveAndClose',
            'change @ui.studentFirstName': 'updateStudentFirstName',
            'change @ui.studentLastName': 'updateStudentLastName',
            'change @ui.studentID': 'updateStudentID',
            'change @ui.studentNickname': 'updateStudentNickname',
            'change @ui.studentGroup': 'updateStudentGroup',
            'change @ui.studentEmail': 'updateStudentEmail',
            'change @ui.studentPhone': 'updateStudentPhone'
        },

        // Grant Campanelli Added
        initialize: function(options) {
            this.model = courseChannel.request('current:course');
            this.student = options.student;
            this.alertTemplate = Hbs.compile(alertTemplate);
            console.log(this.student);
        },
        // Grant Campanelli Added
        render: function() {
            var students = this.model.students;
            var self = this;
            this.studentToModify = [];
            students.each(function(s){
                if(self.options.student == s.get('emplId')) {
                    self.studentToModify = s;
                }
            });

            if(!this.studentToModify) {
                console.log("error, student wasnt found for delete");
                return;
            }

            var first = this.studentToModify.get('first')
            var last = this.studentToModify.get('last')
            var id = this.studentToModify.get('emplId')
            var nickname = this.studentToModify.get('nickname')
            var group = this.studentToModify.get('group')
            var email = this.studentToModify.get('email')
            var phone  = this.studentToModify.get('phone')
             console.log(last.length)

            this.$el.html(this.template({
                first: first,
                last: last,
                id : id,
                nickname : nickname,
                group : group,
                email : email,
                phone : phone
            }));

            return this;
        },

        setStudentValue : function (attribute, value) {
            var students = this.model.students;
            var self = this;

            students.each(function(s){
                if(self.studentToModify.get('emplId') == s.get('emplId')) {
                    console.log('emplID', self.studentToModify.get('emplId'))
                    s.set(attribute, value);
                    s.save();
                    return;
                }
            });
        },

        //updateStudentInfo : function() {},
        updateStudentFirstName : function() {
            var self = this;
            var ui = this.ui;

            var newValue = $('.studentFirstName').val();
            if (newValue.length === 0) {

                self.ui.error.html(self.alertTemplate({
                    message: "Student first name can not be empty"
                }));

                return;
            }
            this.setStudentValue('first', newValue);
            //this.model.save();
            console.log("Saved New Name", newValue)
            //console.log($('.studentFirstName').val())
        },
        updateStudentLastName : function() {
            var self = this;
            var ui = this.ui;

            var newValue = $('.studentLastName').val();
            if (newValue.length === 0) {

                self.ui.error.html(self.alertTemplate({
                    message: "Student last name can not be empty"
                }));

                return;
            }

            this.setStudentValue('last', newValue);

        },
        updateStudentID  : function() {
            var self = this;

            var newValue = $('.studentID').val();
            if (newValue.length !== 8 || isNaN(newValue)) {

                self.ui.error.html(self.alertTemplate({
                    message: "Student ID must be 8 digits"
                }));

                return;
            }

            this.setStudentValue('emplId', newValue);

        },
        updateStudentNickname : function() {

            var newValue = $('.studentNickname').val();

            this.setStudentValue('nickname', newValue);
        },
        updateStudentGroup : function() {
            var newValue = $('.studentGroup').val();

            this.setStudentValue('group', newValue);

        },
        updateStudentEmail : function() {
            var self = this;
            var ui = this.ui;

            var newValue = $('.studentEmail').val();
            if (newValue.length === 0) {

                self.ui.error.html(self.alertTemplate({
                    message: "Student email can not be empty"
                }));

                return;
            }

            this.setStudentValue('email', newValue);

        },
        updateStudentPhone : function() {
            var self = this;
            var ui = this.ui;

            var newValue = $('.studentPhone').val();
            if (newValue.length !== 10 || isNaN(newValue)) {

                self.ui.error.html(self.alertTemplate({
                    message: "Student phone number must be 10 digits"
                }));

                return;
            }

            this.setStudentValue('phone', newValue);
        },

        /**
         * Closes the modify student dialog without any changes to information.
         *
         * @this {ModifyStudentView}
         */

        saveAndClose : function() {
            this.closeModifyStudent()
        },


        closeModifyStudent: function () {

            var modalRegion = pageChannel.request('modalRegion');
            this.model.save().then(modalRegion.hideModal())


            window.location.reload()
        }
    })
});
