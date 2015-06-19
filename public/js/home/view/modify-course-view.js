/**
 * Event handler for the modify class view.
 * @author Mike Ryu
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
    var template = require('text!ctemplates/modifyCourseView.hbs');
    var alertTemplate = require('text!ctemplates/alert-block.hbs');

    var Course = require('course/model/course');

    return Mn.ItemView.extend({
        tagName: 'div',
        className: 'modifyCourse modal-dialog  modal-lg',
        template: Hbs.compile(template),

        ui: {
            courseCode: '.courseCode',
            courseNumber: '.courseNumber',
            courseSection: '.courseSection',
            winter: '.winter',
            spring: '.spring',
            summer: '.summer',
            fall: '.fall',
            year: '.courseYear',
            saveButton: '.save',
            cancelButton: '.cancel',
            error: '.error'
        },

        events: {
            'change @ui.courseCode': "updateCourseCode",
            'change @ui.courseNumber': "updateCourseNumber",
            'change @ui.courseSection': "updateCourseSection",
            'click @ui.winter': 'onSelectWinter',
            'click @ui.spring': 'onSelectSpring',
            'click @ui.summer': 'onSelectSummer',
            'click @ui.fall': 'onSelectFall',
            'change @ui.year': "onUpdateYear",
            'click @ui.saveButton': 'onSaveButton', // {
            //    event: 'onSaveCourse',
            //    preventDefault: false,
            //    stopPropagation: false
            //},
            'click @ui.cancelButton': 'onCancelButton' // {
            //    event: 'onCancelButton',
            //    preventDefault: false,
            //    stopPropagation: false
            //}
        },

        //modelEvents: {
        //    'change': 'onShownModal'
        //},

        initialize: function (options) {
            this.alertTemplate = Hbs.compile(alertTemplate);
            var self = this;
            _.each(['Winter', 'Spring', 'Summer', 'Fall'], function (term) {
                self['onSelect' + term] = _.bind(self.setTerm, self, term);
            });
            this.ensureModel();
        },

        ensureModel: function () {
            if (!this.model)
                this.model = courseChannel.request('current:course');
            this.originalState = this.model.toJSON();
            console.log('verify the original state');
            console.log(this.originalState);
        },

        onShow: function () {
            this.onShownModal();
        },

        onShownModal: function () {
            this.ui.courseCode.val(this.model.get('classCode'));
            this.ui.courseNumber.val(this.model.get('classNumber'));
            this.ui.courseSection.val(this.model.get('section'));
            this.ui.year.val(this.model.get('year'));
            this.resetTermButton();
        },

        resetTermButton: function () {
            var self = this;
            var modelValue = this.model.get('term').toLowerCase();

            _.each(['winter', 'spring', 'summer', 'fall'], function (term) {
                if (term === modelValue)
                    self.ui[term].addClass('active');
                else
                    self.ui[term].removeClass('active');
            });
        },

        updateCourseCode: function () {
            var value = this.ui.courseCode.val().toString();
            console.log('setting course code to ' + value);
            this.model.set({
                classCode: value
            });
            console.log('course code now ' + this.model.get('classCode'));
            console.log(this.model);

            console.log('verify the original state');
            console.log(this.originalState);
        },

        updateCourseNumber: function () {
            var value = this.ui.courseNumber.val().toString();
            console.log('setting course # to ' + value);
            this.model.set({
                classNumber: value
            });
            console.log('course # now ' + this.model.get('classNumber'));
            console.log(this.model);

            console.log('verify the original state');
            console.log(this.originalState);
        },

        updateCourseSection: function () {
            var value = this.ui.courseSection.val().toString();
            this.model.set({
                section: value
            });
        },

        setTerm: function (term) {
            this.model.set({
                term: term
            });
        },

        onUpdateYear: function () {
            var year = this.ui.year.val().toString();
            this.model.set({
                year: year
            });

        },

        updateCourseDates: function () {
            var term = this.model.get('term');
            var year = this.model.get('year');
            if (Course.isValidTerm(term) && Course.isValidYear(year)) {
                this.model.set(Course.findTermDates(term, year));
            }
        },

        onSaveButton: function () {
            var self = this;
            var ui = this.ui;
            this.updateCourseDates.call(this);
            var urlPath = Course.createColloquialUrl(this.model);
            console.log('url to be changed to: ' + urlPath);
            //if (urlPath) {
            //    this.model.set({
            //        colloquialUrl: urlPath
            //    });
            //}

            if (ui.courseCode.val().length === 0) {
                self.ui.error.html(self.alertTemplate({
                    message: "Course Abbreviation can not be empty"
                }));
                return;
            }
            if (ui.courseNumber.val().length === 0) {
                self.ui.error.html(self.alertTemplate({
                    message: "Course Number can not be empty"
                }));
                return;
            }

            if (ui.year.val().length === 0) {
                self.ui.error.html(self.alertTemplate({
                    message: "Year can not be empty"
                }));
                return;
            }
            if (isNaN(ui.courseNumber.val())) {
                self.ui.error.html(self.alertTemplate({
                    message: "Course Number must be a number"
                }));
                return;
            }
            if (isNaN(ui.courseSection.val())) {
                self.ui.error.html(self.alertTemplate({
                    message: "Section must be a number"
                }));
                return;
            }
            if (isNaN(ui.year.val())) {
                self.ui.error.html(self.alertTemplate({
                    message: "Year must be a number"
                }));
                return;
            }
            if (ui.courseSection.val().length === 0) {
                self.ui.error.html(self.alertTemplate({
                    message: "Section can not be empty"
                }));
                return;
            }
            if (!isNaN(ui.courseCode.val())) {
                self.ui.error.html(self.alertTemplate({
                    message: "Course Abbreviation can not be number"
                }));
                return;
            }

            this.model.save().then(function (res) {
                    console.dir(['new course save result:', res]);
                    var modalRegion = pageChannel.request('modalRegion');
                    modalRegion.hideModal();
                    courseChannel.command('updateCourses');
                },
                function (err) {
                    self.ui.error.html(self.alertTemplate({message: err.responseText}));
                    self.ui.saveButton.button('reset');
                }).done();
        },

        onCancelButton: function () {
            console.log('cancel clicked');
            this.model.set(this.originalState);
            //this.model.set({
            //    attributes: this.originalState
            //});
            console.log('current');
            console.log(this.model);
            console.log('original');
            console.log(this.originalState);
        }
    });
});