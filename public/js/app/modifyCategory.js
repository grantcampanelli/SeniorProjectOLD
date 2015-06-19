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
    var template = require('text!templates/modifyCategory.hbs');
    var alertTemplate = require('text!ctemplates/alert-block.hbs');
    
    var Course = require('course/model/course');

    return Mn.ItemView.extend({
        tagName: 'div',
        className: 'modifyCategory modal-dialog modal-lg',
        template: Hbs.compile(template),
        ui: {
            'categoryName' : '.categoryName',
            'categoryWeight' : '.categoryWeight',
            'parentCategory' : '.categoryParent',
            'ok' : '.save',
            'error': '.error'
        },

        initialize: function(options) {
            this.model = courseChannel.request('current:course');
            this.category = options.category;
            this.alertTemplate = Hbs.compile(alertTemplate);
            this.optionTemplate = Hbs.compile("<option value='{{path}}'>{{path}}</option>");
        },

        /**
         * Set up the fields for the modify category dialog with the
         * selected categorie's values.
         *
         * @author Matt Bleifer
         */
        onShow : function(){
            var ui = this.ui;
            var self = this;

            var reqCatPath = this.category;

            var categories = this.model.categories;
            var category = categories.findWhere({"path" : reqCatPath});

            categories.comparator = function(a, b) {
                a = a.get("path");
                b = b.get("path");
                return a > b ?  1
                     : a < b ? -1
                     :          0;
            }

            ui.parentCategory.append(self.optionTemplate());
            categories.sort().each(function(catListItem) {
                if (catListItem.get("path").indexOf(category.get("path")) !== 0)
                    ui.parentCategory.append(self.optionTemplate(catListItem.attributes));
            });

            var path = category.get("path").split('#');
            path.pop();
            path = path.join("#");

            ui.parentCategory.val(path).attr("selected");

            ui.categoryName.val(category.get("name"));
            ui.categoryWeight.val(category.get("weight"));
        },
        events : {
            'click @ui.ok' :  'saveModifyCategory',
            'click @ui.cancel' :  'closeModifyCategory'
        },
        /**
         * Gather the new values from the modify category dialog and
         * set them in the model.
         *
         * @author Matt Bleifer
         */
        saveModifyCategory : function() {
            var ui = this.ui;
            var self = this;

            if (ui.categoryName.val().length === 0) {
                self.ui.error.html(self.alertTemplate({
                    message: "Category name can not be empty"
                }));
                return;
            }

            if (ui.categoryName.val().indexOf("#") !== -1) {
                self.ui.error.html(self.alertTemplate({
                    message: "Category name can not contain a '#' sign"
                }));
                return;
            }

            if (isNaN(ui.categoryWeight.val()) || ui.categoryWeight.val() < 0 || ui.categoryWeight.val() > 1) {
                self.ui.error.html(self.alertTemplate({
                    message: "Category weight must be a number between 0 and 1"
                }));
                return;
            }

            var reqCatPath = this.category;

            var categories = this.model.categories;
            var category = categories.findWhere({"path" : reqCatPath});
            catPath = category.get("path");

            var splitCatPath = catPath.split("#");
            splitCatPath.pop();

            var splitCatListItem, newSplitPath, finalPath;

            categories.each(function(catListItem) {
                splitCatListItem = catListItem.get("path").split("#");
                newSplitPath = _.difference(splitCatListItem, splitCatPath);
                finalPath = newSplitPath.join("#");

                if (catListItem.get("path").indexOf(catPath) === 0) {
                    if (newSplitPath.length === 0)
                        catListItem.set("path", ui.parentCategory.val());
                    else
                        catListItem.set("path", ui.parentCategory.val() + "#" + finalPath);
                }
            });

            //category.set();
            category.save({
                name : ui.categoryName.val(),
                weight : ui.categoryWeight.val()
            });
            self.closeModifyCategory();
        },
        /**
         * Hide the modify category dialog and save the data to the database.
         *
         * @author Matt Bleifer
         */
        closeModifyCategory : function() {
            var self = this;
            //Backbone.emulateHTTP = true;
            Q(this.model.save()).then(function(res) {
                var modalRegion = pageChannel.request('modalRegion');
               window.location.reload();
                //self.trigger("close");
                //courseChannel.command('updateCourses');
            },
            function(err) {
                self.ui.error.html(self.alertTemplate({message: err.responseText}));
                self.ui.saveButton.button('reset');
            }).done();
        },
    })
});