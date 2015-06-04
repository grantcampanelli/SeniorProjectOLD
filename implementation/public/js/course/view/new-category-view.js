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
    var template = require('text!ctemplates/addNewCategoryView.hbs');
    var alertTemplate = require('text!ctemplates/alert-block.hbs');

    var Course = require('course/model/course');

    var NewCategoryView = Mn.ItemView.extend({
        tagName: 'div',
        className: 'new-category modal-dialog  modal-lg',
        template: Hbs.compile(template),
        ui: {
            //'newCategoryButton' : '.newCategoryButton',
            'save': '.save',
            'cancel': '.cancel',
            'name': '.name',
            'weight': '.weight',
            'category': '.parent-category'
        },
        /**
         * Hides the dialog on initial load
         */

        events: {
            'click @ui.save': 'saveNewCategory',
            'click @ui.cancel': 'closeNewCategory'
        },
        traverseCat: function (indent, o) {

            for (i in o) {
                if (o[i] &&
                    typeof o[i].tree === 'function'
                    && typeof(o[i].tree()) == "object") {
                    this.categoryList.push({
                        name: indent + " " + o[i].get('name'),
                        cid: o[i].cid
                    });
                    this.traverseCat(indent + "---", o[i].tree());
                }
            }

        },

        initialize: function () {
            this.model = courseChannel.request('current:course');
            this.alertTemplate = Hbs.compile(alertTemplate);
        },
        onShow: function () {
            var categories = this.model.categories;
            var categoryTree = categories.tree();
            this.categoryList = [];
            var self = this;

            self.traverseCat("", categoryTree);

            var optionString;
            this.categoryList.forEach(function (c) {
                optionString = '<option value="' + c.cid + '" >' + c.name + '</option>';
                $('#new-category-parent-category').append(optionString);
            });
        },
        saveNewCategory: function () {
            var ui = this.ui;
            var newCategory = [];

            if (ui.name.val() == null)
                console.log('error');
            else
                newCategory.name = ui.name.val();

            if (ui.weight.val() == null)
                console.log('error');
            else
                newCategory.weight = ui.weight.val();


            if (ui.category.val() == null)
                console.log('error');
            else
                newCategory.parentCategory = ui.category.val();


            console.log(newCategory);

            //TODO Input value checking above!!
            //TODO Please save this to DB

            $('.cancel').click()
        }
    })

    return NewCategoryView;
});
