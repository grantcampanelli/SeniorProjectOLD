/**
 * @author Matt Bleifer
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
    var template = require('text!templates/selectCategory.hbs');
    var alertTemplate = require('text!ctemplates/alert-block.hbs');
    
    var Course = require('course/model/course');

    var SelectCategory = Mn.ItemView.extend({
        tagName: 'div',
        className: 'modifyCategory modal-dialog modal-lg',
        template: Hbs.compile(template),
        ui: {
            'category' : '.categorySelected',
            'ok' : '.ok',
            'error' : '.error'
        },

        /**
         * Initialize the select category dialog with the proper view.
         *
         * @author Matt Bleifer
         */
        initialize: function(options) {
            this.optionTemplate = Hbs.compile("<option value='{{path}}'>{{path}}</option>");
            this.model = courseChannel.request('current:course');
            this.alertTemplate = Hbs.compile(alertTemplate);
        },

        /**
         * Populate the dropdown menu for selecting a category.
         *
         * @author Matt Bleifer
         */
        onBeforeShow : function(){
            var ui = this.ui;

            var categories = this.model.categories;
            var self = this;

            categories.comparator = function(a, b) {
                a = a.get("path");
                b = b.get("path");
                return a > b ?  1
                     : a < b ? -1
                     :          0;
            }
            categories.sort().each(function(category) {
                ui.category.append(self.optionTemplate(category.attributes));
            });
        },
        events : {
            'click @ui.ok' :  'closeSelectCategory',
            'click @ui.cancel' :  'closeModifyCategory'
        },
        triggers : {
            'click @ui.ok' :  'success'
        },
        /**
         * Get the value for the selected category.
         *
         * @author Matt Bleifer
         */
        getSelectedCategory : function() {
            return $('#category-selected').val();
        },
        /**
         * Hide the select category dialog.
         *
         * @author Matt Bleifer
         */
        closeSelectCategory : function() {
            var modalRegion = pageChannel.request('modalRegion');
            _.defer(function() {
                modalRegion.empty();
            });
        },
    })

    courseChannel.reply('select:category', function promptCourse() {
        var defered = Q.defer();
        var view = new SelectCategory();
        var modalRegion = pageChannel.request('modalRegion');
        modalRegion.show(view);
        view.on('success', function() {
            defered.resolve(view.getSelectedCategory());
        });
        view.on('destroy', function() {
            defered.reject();
        });
        return defered.promise;
    })
    
    return SelectCategory;
});