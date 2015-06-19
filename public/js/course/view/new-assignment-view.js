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
    var template = require('text!ctemplates/addNewAssignmentView.hbs');
    var alertTemplate = require('text!ctemplates/alert-block.hbs');
    var Assignment = require('course/model/assignment');

    var Course = require('course/model/course');
    var Assignment= require('course/model/assignment');
    //var currentAssignment;

    var NewAssignmentView = Mn.ItemView.extend({
        tagName: 'div',
        className: 'new-assignment modal-dialog  modal-lg',
        template: Hbs.compile(template),
        ui: {
            //'newAssignmentButton' : '.newAssignmentButton',
            'save' : '.save',
            'cancel' : '.cancel',
            'name' : '.name',
            'weight' : '.weight',
            'totalScore' : '.total-score',
            'category' : '.category',
            'error': '.error'
        },
        /**
         * Hides the dialog on initial load
         */

        events : {
            'click @ui.save' :  'saveNewAssignment',
            'click @ui.cancel' :  'closeNewAssignment'
        },
        traverseCat : function(indent, o) {

            for (i in o) {
                if (o[i] &&
                    typeof o[i].tree === 'function'
                    && typeof(o[i].tree()) == "object") {

                    if(o[i].tree().length > 0) {
                        console.log("traverse")
                        this.traverseCat(o[i].get('name') + " /", o[i].tree());
                    }
                    else {
                        console.log("push")
                        this.categoryList.push({
                            name: indent + " " + o[i].get('name'),
                            cid: o[i].cid,
                            path: o[i].get('path')
                        });
                    }
                }
                //if(o[i] &&
                //    typeof o[i].tree === 'function'
                //    && typeof(o[i].tree()) == "object"
                //    && o[i].tree() == null) {
                //    this.categoryList.push({
                //        name: indent + " " + o[i].get('name'),
                //        cid: o[i].cid,
                //        path: o[i].get('path')
                //    });
                //}
            }

        },

        initialize : function() {
            this.model = courseChannel.request('current:course');
            this.alertTemplate = Hbs.compile(alertTemplate);
        },
        onShow : function() {
            var categories = this.model.categories;
            console.log(categories)
            var categoryTree = categories.tree();
            this.categoryList = [];
            var self = this;

            self.traverseCat("", categoryTree);

            var optionString;
            this.categoryList.forEach(function(c) {

                optionString = '<option value="' + c.path +'" >'+ c.name + '</option>';
                $('#new-assignment-category').append(optionString);
            });
        },
        saveNewAssignment : function() {
            var self = this;
            var ui = this.ui;
            var newAssignment = {};
            var chosenCategory;
            var categories = this.model.categories;
            newAssignment.course = this.model.get('colloquialUrl');

            if(ui.name.val() == null || ui.name.val().length === 0) {
                self.ui.error.html(self.alertTemplate({
                        message: "Invalid assignment name"
                    }));
                    
                return;
            }
            else {
                newAssignment.name = ui.name.val();
            }

            if(ui.weight.val() == null || ui.weight.val().length === 0 || isNaN(ui.weight.val())
                || ui.weight.val() < 0 || ui.weight.val() > 1) {
                self.ui.error.html(self.alertTemplate({
                    message: "Weight must be a number between 0 and 1"
                }));
                    
                return;
            }
            else {
                newAssignment.weight = ui.weight.val();
            }

            
            if(ui.totalScore.val() == null || ui.totalScore.val().length === 0 || isNaN(ui.totalScore.val())) {
                self.ui.error.html(self.alertTemplate({
                    message: "Total score must be a number"
                }));
            }
            else {
                newAssignment.rawPoints = ui.totalScore.val();
            }

            if(this.ui.category.val() == null || this.ui.category.val().length === 0 || !isNaN(this.ui.category.val())) {
                self.ui.error.html(self.alertTemplate({
                    message: "Category must be a valid category"
                }));
            }
            else {
                chosenCategory = self.ui.category.val();
            }

            //newAssignment.dueDate = null;

            var assignment = new Assignment(newAssignment);
            assignment.save().then(function () {
                categories.each(function(c) {
                    if(c.get('path') == chosenCategory) {
                       console.log('pushing to category', assignment)
                        c.addAssignment(assignment);
                        console.log("after AddAssignment")
                        c.save();
                        console.log("cat")
                        console.log(c)
                    }
                })
            })


            var modalRegion = pageChannel.request('modalRegion');
            this.model.save().then(modalRegion.hideModal())
            window.location.reload();
        }



    });

    return NewAssignmentView;
});
