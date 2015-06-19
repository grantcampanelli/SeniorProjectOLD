/**
 * Event handler for the modify class view.
 * @author Mike Ryu
 */
define(['app/app', 'text!templates/modifyClassView.hbs' ], function(App, template) {

    var ModifyCourseView = App.Mn.ItemView.extend({
        model: App.Course,
        template: App.Handlebars.compile(template),
        ui: {
            'modifyClassButton': '.modifyClassButton',
            'ok': '.ok',
            'cancel': '.cancel',
            'dialog': '.popup-dialog',
            classCode: 'input.classCode',
            classNumber: 'input.classNumber'
        },
        events: {
            'click @ui.modifyClassButton': 'showModifyClass',
            'click @ui.ok': 'updateClassInfo',
            'click @ui.cancel': 'closeModifyClass'
        },

        /**
         * Hides the dialog on initial load
         */
        onShow: function onShow () {
            this.ui.dialog.hide();
        },

        /**
         * Updates the class information as entered by user,
         * and saves changes to the database.
         */
        updateClassInfo: function updateClassInfo () {
            if ((this.ui.classCode.val() + '').length === 0 ||
                (this.ui.classNumber.val() + '').length === 0) {
                alert("Please enter BOTH class code and number.");
                console.log("ERROR");
            }
            else {
                console.log("OK");
                var code = this.ui.classCode.val();
                var number = this.ui.classNumber.val();
                this.model.set({"classCode": code});
                this.model.set({"classNumber": number});
                this.ui.dialog.hide();
                this.ui.modifyClassButton.show();
                Backbone.emulateHTTP = true;
                this.model.save();
            }
        },

        /**
         * Shows the Modify Class dialog on click.
         */
        showModifyClass: function showDialog() {
            this.ui.dialog.show();
            this.ui.classCode.val(this.model.get('classCode'));
            this.ui.classNumber.val(this.model.get('classNumber'));
            this.ui.modifyClassButton.hide();
        },

        /**
         * Closes the Modify Class dialog.
         */
        closeModifyClass: function () {
            this.ui.dialog.hide();
            this.ui.modifyClassButton.show();
        }
    });

    App.Router.route("modifyClass", "home", function() {
        App.UserCourses.fetch().then(function() {
            var course = App.UserCourses.at(0);
            var modifyView = new ModifyCourseView({
                model: course
            });
            App.PopupRegion.show(modifyView);
        });
    });
});