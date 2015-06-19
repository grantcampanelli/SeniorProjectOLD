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
    var template = require('text!ctemplates/groupStudentsView.hbs');
    var alertTemplate = require('text!ctemplates/alert-block.hbs');

    //var Course = require('course/model/course');
    //var studentObjects = [];
    var studentObjects = [];

    dynamicSort = function (property) {
        var sortOrder = 1;
        if (property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a, b) {
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
            while (result === 0 && i < numberOfProperties) {
                result = dynamicSort(props[i])(obj1, obj2);
                i++;
            }
            return result;
        }
    };

    return Mn.ItemView.extend({
        tagName: 'div',
        className: 'group-students modal-dialog modal-lg',
        template: Hbs.compile(template),
        ui: {
            'listStudents': '#list-students',
            'save': '.save',
            'error': '.error'
        },

        initialize: function (options) {
            //this.optionTemplate = Hbs.compile("<option value='{{path}}'>{{path}}</option>");
            //this.model = courseChannel.request('current:course');
            this.model = courseChannel.request('current:course');
            //this.render();
            this.alertTemplate = Hbs.compile(alertTemplate);
        },

        onShow: function () {
            var students = this.model.students;
            var first, last, index = 0;
            console.log("listStudents");
            console.log("before student loop")
            //console.log(this.model)
            students.each(function (s) {
                first = s.get('first');
                last = s.get('last');
                emplId = s.get('emplId');
                studentObjects.push({
                    first: first,
                    last: last,
                    index: index,
                    emplId: emplId
                });
                index++;
            });

            console.log(studentObjects)


            studentObjects.sort(dynamicSortMultiple('last', 'first'));
            console.log("after sort");

            var nameString;
            for (var i = 0; i < studentObjects.length; i++) {
                nameString = "<li>" + studentObjects[i].first + " " + studentObjects[i].last + "</li>";
                $('#list-students').append(nameString);
            }
        },
        events: {
            'click @ui.save': 'saveGroupStudents',
            'click @ui.cancel': 'closeGroupStudents'
        },

        closeGroupStudents: function () {
            var modalRegion = pageChannel.request('modalRegion');
            _.defer(function () {
                modalRegion.empty();
            });
            $('.modal-content').hide();
            //this.$el.data('modal', null);
            //this.remove();
        },
        saveGroupStudents: function () {
            $('.cancel').click()
        }

    });

});
/**
 * Created by grantcampanelli on 5/28/15.
 */
