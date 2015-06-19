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
    var template = require('text!ctemplates/selectStudentView.hbs');
    var alertTemplate = require('text!ctemplates/alert-block.hbs');
    var DeleteStudentView = require('course/view/delete-student-view');

    //var Course = require('course/model/course');
    var studentObjects = [];

    dynamicSort = function (property) {
        var sortOrder = 1;
        if(property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a,b) {
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    };

    function dynamicSortMultiple() {
        /*
         * save the arguments object as it will be overwritten
         * note that arguments object is an array-like object
         * consisting of the names of the properties to sort by
         */
        var props = arguments;
        return function (obj1, obj2) {
            var i = 0, result = 0, numberOfProperties = props.length;
            /* try getting a different result from 0 (equal)
             * as long as we have extra properties to compare
             */
            while(result === 0 && i < numberOfProperties) {
                result = dynamicSort(props[i])(obj1, obj2);
                i++;
            }
            return result;
        }
    };

    var SelectStudent = Mn.ItemView.extend({
        tagName: 'div',
        className: 'selectStudent modal-dialog modal-lg',
        template: Hbs.compile(template),
        ui: {
            'student' : '.studentSelected',
            'ok' : '.ok',
            'error' : '.error'
        },

        initialize: function(options) {
            //this.optionTemplate = Hbs.compile("<option value='{{path}}'>{{path}}</option>");
            this.model = courseChannel.request('current:course');
            this.alertTemplate = Hbs.compile(alertTemplate);
        },
        onBeforeShow : function() {
            var ui = this.ui;
            var self = this;
        },

        /**
         * Hide the modify category dialog on initial load. Also,
         * create a dropdown menu for testing purposes that allows
         * the user to select which category to modify.
         *
         * @author Matt Bleifer
         */
        render: function() {
            var students = this.model.students;
            var first, last, index = 0;

            studentObjects = [];
            students.each(function(s){
                console.log(s.get('first'));
                first = s.get('first');
                last = s.get('last');
                emplId =  s.get('emplId');
                studentObjects.push({
                    first: first,
                    last: last,
                    index: index,
                    emplId: emplId
                });
                index++;
            });

            studentObjects.sort(dynamicSortMultiple('last', 'first'));

            // render using the template
            this.$el.html(this.template({ studentsoption : studentObjects}));

            return this;
        },
        events : {
            'click @ui.ok' :  'closeSelectStudent',
            'click @ui.cancel' :  'closeSelectStudent'
        },
        triggers : {
            'click @ui.ok' :  'success'
        },

        getSelectedStudent : function() {
            return $('#student-selected').val();
        },

        closeSelectStudent : function() {
            var modalRegion = pageChannel.request('modalRegion');
            _.defer(function() {
                modalRegion.empty();
            });
            $('.modal-content').hide();
            //this.$el.data('modal', null);
            //this.remove();
        }
    });

    courseChannel.reply('select:student', function promptCourse() {
        var defered = Q.defer();
        var view = new SelectStudent();
        var modalRegion = pageChannel.request('modalRegion');
        modalRegion.show(view);
        view.on('success', function() {
            defered.resolve(view.getSelectedStudent());
        });
        view.on('destroy', function() {
            defered.reject();
        });
        return defered.promise;
    })
});/**
 * Created by grantcampanelli on 5/28/15.
 */
