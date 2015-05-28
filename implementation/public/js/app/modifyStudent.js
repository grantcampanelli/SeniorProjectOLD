/**
 * Event handler for the modify student view.
 * @author Grant Plaster
 */

define(['app/app', 'text!templates/modifyStudentView.hbs', ], function(App, template) {

    var ModifyStudentView = App.Mn.ItemView.extend({
        model: App.Course,
        template: App.Handlebars.compile(template),
        ui: {
            'modifyStudentButton' : '.modifyStudentButton',
            'ok' : '.ok',
            'cancel' : '.cancel',
            'dialog' : '.popup-dialog',
            'studentFirstName' : '.studentFirstName',
            'studentLastName' : '.studentLastName',
            'studentID' : '.studentID',
            'studentNickname' : '.studentNickname',
            'studentGroup' : '.studentGroup',
            'studentEmail' : '.studentEmail',
            'studentPhone' : '.studentPhone'

        },

        /**
         * Hides the dialog on initial load
         *
         * @this {ModifyStudentView}
         */
        onShow : function(){
            this.ui.dialog.hide();
        },
        events : {
           'click @ui.modifyStudentButton' :  'showModifyStudent',
            'click @ui.ok' :  'updateStudentInfo',
            'click @ui.cancel' :  'closeModifyStudent'
        },

        /**
         * Hides the pop-up button to display fields for modifying student data.
         * Fields are automatically filled with existing student data for the selected student.
         *
         * @this {ModifyStudentView}
         */
        showModifyStudent : function() {
            this.ui.dialog.show();
            this.ui.modifyStudentButton.hide();

            if (this.model.get('students')[1].first)
                this.ui.studentFirstName.val(this.model.get('students')[1].first);
            else
                this.ui.studentFirstName.val(this.model.get('students')[1].user.first);


            if (this.model.get('students')[1].last)
                this.ui.studentLastName.val(this.model.get('students')[1].last);
            else
                this.ui.studentLastName.val(this.model.get('students')[1].user.last);


            if (this.model.get('students')[1].emplId)
                this.ui.studentID.val(this.model.get('students')[1].emplId);
            else
                this.ui.studentID.val(this.model.get('students')[1].user.emplId);

            if (this.model.get('students')[1].nickname)
                this.ui.studentNickname.val(this.model.get('students')[1].nickname);
            else
                this.ui.studentNickname.val(this.model.get('students')[1].user.nickname);


            if (this.model.get('students')[1].group)
                this.ui.studentGroup.val(this.model.get('students')[1].group);
            else
                this.ui.studentGroup.val(this.model.get('students')[1].user.group);


            if (this.model.get('students')[1].email)
                this.ui.studentEmail.val(this.model.get('students')[1].email);
            else
                this.ui.studentEmail.val(this.model.get('students')[1].user.email);


            if (this.model.get('students')[1].phone)
                this.ui.studentPhone.val(this.model.get('students')[1].phone);
            else
                this.ui.studentPhone.val(this.model.get('students')[1].user.phone);

            

            //this.ui.studentFirstName.val(this.model.get('first'));
            //this.ui.studentLastName.val(this.model.get('last'));
            //this.ui.studentID.val(this.model.get('emplId'));
            //this.ui.studentEmail.val(this.model.get('email'));
            //this.ui.studentPhone.val(this.model.get('phone'));
        },

        /**
         * Saves any changes to the selected student data in the database.
         *
         * @this {ModifyStudentView}
         */
        updateStudentInfo : function () {

            //var firstName = this.ui.studentFirstName.val();
            //var lastName = this.ui.studentLastName.val();
            //var id = this.ui.studentID.val();
            //var nickname = this.ui.studentNickname;
            //var group = this.ui.studentGroup;
            //var email = this.ui.studentEmail.val();
            //var phone = this.ui.studentPhone;

            if (this.ui.studentFirstName.val())
                this.model.get('students')[1].first = this.ui.studentFirstName.val();

            if (this.ui.studentLastName.val())
                this.model.get('students')[1].last = this.ui.studentLastName.val();

            if (this.ui.studentID.val())
                this.model.get('students')[1].emplId = this.ui.studentID.val();

            if (this.ui.studentNickname.val())
                this.model.get('students')[1].nickname = this.ui.studentNickname.val();

            if (this.ui.studentGroup.val())
                this.model.get('students')[1].group = this.ui.studentGroup.val();

            if (this.ui.studentEmail.val())
                this.model.get('students')[1].email = this.ui.studentEmail.val();

            if (this.ui.studentPhone.val())
                this.model.get('students')[1].phone = this.ui.studentPhone.val();

            this.ui.dialog.hide();
            Backbone.emulateHTTP = true;
            var self = this;
            this.model.save().then(function(){
                self.ui.modifyStudentButton.show();
            });
        },

        /**
         * Closes the modify student dialog without any changes to information.
         *
         * @this {ModifyStudentView}
         */

        closeModifyStudent : function() {
            this.ui.dialog.hide();
            this.ui.modifyStudentButton.show();
        },
    })

    App.Router.route("modifyStudent", "home", function() {
        App.UserCourses.fetch().then(function () {
            var course = App.UserCourses.at(0);
            var students = course.get('students');
            var promises = [];
            students.forEach(function(student){
                var url = '/api/Users?_id=' + student.user;
                var p = App.$.ajax({
                    url: url
                });
                promises.push(p);
            });
            App.Q.all(promises).then(function(arr) {
                arr = App._.flatten(arr);
                for(var i = 0; i < arr.length; ++i) {
                    students[i].user = arr[i];
                }
                var modifyView = new ModifyStudentView({
                    model: course
                });
                App.PopupRegion.show(modifyView);
            })
        });
    });
});