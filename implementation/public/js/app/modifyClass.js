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
        onShow: function () {
            this.ui.dialog.hide();
        },
        events: {
            'click @ui.modifyClassButton': 'showModifyClass',
            'click @ui.ok': 'updateClassInfo',
            'click @ui.cancel': 'closeModifyClass'
        },
        updateClassInfo: function() {
            var code = this.ui.classCode.val();
            var number = this.ui.classNumber.val();
            this.model.set({"classCode": code});
            this.model.set({"classNumber": number});
            this.ui.dialog.hide();
            this.ui.modifyClassButton.show();
        },
        showModifyClass: function () {
            this.ui.dialog.show();
            this.ui.classCode.val(this.model.get('classCode'));
            this.ui.classNumber.val(this.model.get('classNumber'));
            this.ui.modifyClassButton.hide();
        },
        closeModifyClass: function () {
            this.ui.dialog.hide();
            this.ui.modifyClassButton.show();
        }
    });

    App.Router.route("modifyClass", "home", function () {
        App.$.ajax({
            url: '/api/Courses'
        }).done(function (data) {
            var props = data[0];
            props.url = '/api/Courses/' + props.colloquialUrl;
            var course = new App.Backbone.Model(props);
            console.dir(course);
            var modifyView = new ModifyCourseView({
                model: course
            });
            App.PopupRegion.show(modifyView);
        });
    });
});