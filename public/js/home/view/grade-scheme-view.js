define(function (require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var App = require('app/app');
    var Backbone = require('util/backbone-helper');
    var Hbs = require('handlebars');
    var Mn = require('backbone.marionette');
    var Q = require('q');
    var Radio = require('backbone.radio');
    var pageChannel = Radio.channel('page');
    //var courseChannelRadio = Radio.channel('course');
    var courseRadioChannel = Radio.channel('course');
    var template = require('text!ctemplates/gradeSchemeView.hbs');
    var alertTemplate = require('text!ctemplates/alert-block.hbs');


    var Course = require('course/model/course');

    return Mn.ItemView.extend({
        tagName: 'div',
        className: 'gradeScheme modal-dialog  modal-lg',
        template: Hbs.compile(template),

        ui: {
            'saveButton': '.save',
            'aMin': '#grade-scheme-min-a',
            'bMin': '#grade-scheme-min-b',
            'cMin': '#grade-scheme-min-c',
            'dMin': '#grade-scheme-min-d',
            'passMin': '#grade-scheme-min-pass',
            'buttonGraded': '#grade-scheme-graded',
            'buttonPassFail': '#grade-scheme-pass-fail',
            'graded': '.graded',
            'passFail': '.pass-fail',
            error: '.error'

        },

        events: {
            'click @ui.saveButton': 'onSaveGradeScheme',
            'change @ui.aMin': 'updateMinimumA',
            'change @ui.bMin': 'updateMinimumB',
            'change @ui.cMin': 'updateMinimumC',
            'change @ui.dMin': 'updateMinimumD',
            'change @ui.passMin': 'updateMinimumPassing',
            'click @ui.graded': 'updateSchemeGraded',
            'click @ui.passFail': 'updateSchemePassFail'
            //'change @ui.grade-scheme-buttons': 'updateGradeScheme'

        },

        initialize: function (options) {
            this.model = courseRadioChannel.request('current:course');
            this.alertTemplate = Hbs.compile(alertTemplate);
            //this.model = courseChannel.request('current:course');
            //console.log(this.model);


        },
        onShow: function () {

            //this.model = this.model.course;
            console.log(this.model.get('minA'));

            // TODO make this pull from db whether graded or pass fail
            $('.graded').addClass('active');
            $('#graded').attr('checked', true);


            var ui = this.ui;
            var course = this.model;
            console.log(course);

            ui.aMin.val(course.get('minA'));
            ui.bMin.val(course.get('minB'));
            ui.cMin.val(course.get('minC'));
            ui.dMin.val(course.get('minD'));
            ui.passMin.val(course.get('minCredit'));
        },
        setNewMinimums: function () {

        },

        updateMinimumA: function () {
            var newAMin = this.ui.aMin.val();
            var self = this;
            if (newAMin <= this.ui.bMin.val()) {
                self.ui.error.html(self.alertTemplate({
                    message: "A Minimum cannot be lower than B Minimum"
                }));
                console.log('A Minimum cannot be lower than B Minimum')
                this.ui.aMin.val(this.model.get('minA'))
                return;
            }

            this.model.set('minA', parseInt(newAMin))
            this.model.save();
            //self.model.save()
            //self.updatePieChart();
            //this.model.set('minA', newAMin).then(this.model.save());
            this.ui.aMin.val(newAMin);
            //this.model.save();
        },
        updateMinimumB: function () {
            var newBMin = this.ui.bMin.val();
            var self = this;
            if (newBMin <= this.ui.cMin.val()) {
                self.ui.error.html(self.alertTemplate({
                    message: "B Minimum cannot be lower than C Minimum"
                }));
                console.log('B Minimum cannot be lower than C Minimum')
                this.ui.bMin.val(this.model.get('minB'))
                return;
            }
            if (newBMin >= this.ui.aMin.val()) {
                self.ui.error.html(self.alertTemplate({
                    message: "B Minimum cannot be higher than A Minimum"
                }));
                this.ui.bMin.val(this.model.get('minB'))
                return;
            }

            this.model.set('minB', parseInt(newBMin))
            this.model.save()
            //self.model.save();
            //self.updatePieChart();
            //this.model.set('minB', newBMin).then(this.model.save());
            this.ui.bMin.val(newBMin);
            //this.model.save();
        },
        updateMinimumC: function () {
            var newCMin = this.ui.cMin.val();
            var self = this;
            if (newCMin <= this.ui.dMin.val()) {
                self.ui.error.html(self.alertTemplate({
                    message: "C Minimum cannot be lower than D Minimum"
                }));
                console.log('C Minimum cannot be lower than D Minimum')
                this.ui.cMin.val(this.model.get('minC'))
                return;
            }
            if (newCMin >= this.ui.bMin.val()) {
                self.ui.error.html(self.alertTemplate({
                    message: "C Minimum cannot be higher than B Minimum"
                }));
                console.log('C Minimum cannot be higher than B Minimum')
                this.ui.cMin.val(this.model.get('minC'))
                return;
            }

            this.model.set('minC', parseInt(newCMin))
            this.model.save()
            //self.model.save();
            //self.updatePieChart();
            //this.model.set('minC', newCMin).then(this.model.save());
            this.ui.cMin.val(newCMin);

        },

        updateMinimumPassing: function () {
            var newMinPass = this.ui.passMin.val();
            var self = this;

            if (newMinPass < 0 || newMinPass > 100) {
                self.ui.error.html(self.alertTemplate({
                    message: "Minimum passing grade must be between 0 and 100"
                }));
                console.log('Minimum passing grade must be between 0 and 100')
                this.ui.passMin.val(this.model.get('minCredit'))
                return;
            }
            console.log("minPass Change -----", parseInt(newMinPass))
            this.model.set('minCredit', parseInt(newMinPass))
            this.model.save();

            this.ui.passMin.val(newMinPass);
        },
        updateMinimumD: function () {
            var newDMin = this.ui.dMin.val();
            var self = this;
            if (newDMin >= this.ui.cMin.val()) {
                self.ui.error.html(self.alertTemplate({
                    message: "D Minimum cannot be higher than C Minimum"
                }));
                console.log('D Minimum cannot be higher than C Minimum')
                this.ui.dMin.val(this.model.get('minD'))
                return;
            }

            this.model.set('minD', parseInt(newDMin))

            this.model.save();
            this.ui.dMin.val(newDMin);

        },

        updateSchemeGraded: function () {
            console.log("made it updateSchemeGraded")
            this.model.set('GradeScheme', 'graded');
            this.model.save();
        },

        updateSchemePassFail: function () {
            console.log("made it updateSchemePassFail")
            this.model.set('GradeScheme', 'pass-fail');
            this.model.save();
        },

        closeModal: function () {
            var modalRegion = pageChannel.request('modalRegion');
            this.model.save().then(modalRegion.hideModal())
            window.location.reload();
        },


        onSaveGradeScheme: function () {
            //this.setNewMinimums();
            var self = this;

            var newAMin = this.ui.aMin.val();
            var newBMin = this.ui.bMin.val();
            var newCMin = this.ui.cMin.val();
            var newDMin = this.ui.dMin.val();
            var newMinPass = this.ui.passMin.val();

            //var gradeBookRegion = pageChannel.request('mainRegion');
            //gradeBookRegion.show();

            if (newAMin <= this.ui.bMin.val()) {
                self.ui.error.html(self.alertTemplate({
                    message: "A Minimum cannot be lower than B Minimum"
                }));
                console.log('A Minimum cannot be lower than B Minimum')
                this.ui.aMin.val(this.model.get('minA'))
                return 1;
            }
            if (newBMin <= this.ui.cMin.val()) {
                self.ui.error.html(self.alertTemplate({
                    message: "B Minimum cannot be lower than C Minimum"
                }));
                console.log('B Minimum cannot be lower than C Minimum')
                this.ui.bMin.val(this.model.get('minB'))
                return 1;
            }
            if (newBMin >= this.ui.aMin.val()) {
                self.ui.error.html(self.alertTemplate({
                    message: "B Minimum cannot be higher than A Minimum"
                }));
                this.ui.bMin.val(this.model.get('minB'))
                return 1;
            }
            if (newCMin <= this.ui.dMin.val()) {
                self.ui.error.html(self.alertTemplate({
                    message: "C Minimum cannot be lower than D Minimum"
                }));
                console.log('C Minimum cannot be lower than D Minimum')
                this.ui.cMin.val(this.model.get('minC'))
                return 1;
            }
            if (newCMin >= this.ui.bMin.val()) {
                self.ui.error.html(self.alertTemplate({
                    message: "C Minimum cannot be higher than B Minimum"
                }));
                console.log('C Minimum cannot be higher than B Minimum')
                this.ui.cMin.val(this.model.get('minC'))
                return 1;
            }
            if (newMinPass < 0 || newMinPass > 100) {
                self.ui.error.html(self.alertTemplate({
                    message: "Minimum passing grade must be between 0 and 100"
                }));
                console.log('Minimum passing grade must be between 0 and 100')
                this.ui.passMin.val(this.model.get('minCredit'))
                return 1;
            }
            if (newDMin >= this.ui.cMin.val()) {
                self.ui.error.html(self.alertTemplate({
                    message: "D Minimum cannot be higher than C Minimum"
                }));
                console.log('D Minimum cannot be higher than C Minimum')
                this.ui.dMin.val(this.model.get('minD'))
                return 1;
            }

            this.closeModal();

            //$('.cancel').click();
        }

    });
});