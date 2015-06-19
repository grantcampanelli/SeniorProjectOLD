define(function(require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('util/backbone-helper');
    var Hbs = require('handlebars');
    var Mn = require('backbone.marionette');
    var Radio = require('backbone.radio');
    var courseChannel = Radio.channel('course');

    var Category = Backbone.Model.extend({
        idAttribute: '_id',
        urlRoot: '/api/categories',
        
        defaults: {
            weight: 1
        },
        
        getWeight: function() {
            var w = this.get('weight')
            if (_.isFinite(Number(w)))
            return Number(w);
            else {
                return 0;
            }
        },

        treeFilterFunc: function(model) {
            var regex = new RegExp('^' + this.get('path') + '#[^#]+$')
            return regex.test(model.get('path'));
        },

        tree: function() {
            var subTreeOnly = this.treeFilterFunc.bind(this);
            return this.collection.filter(subTreeOnly);
        },

        initialize: function(options) {
            if (!this.isNew()) {
                this.url = this.urlRoot + '/' + this.id;
            }
        },

        countOwnAssignments: function() {
            var a = this.get('assignments')
            if (_.isString(a) && a.length > 0)
                return a.split(",").length;
                
            return 0;
        },

        addAssignment: function(assignment) {
            var inputId = this.errorCheckAssignmentId(assignment);
            var assignments = this.getAssignmentsArray();
            assignments.push(inputId);
            var value = _.uniq(assignments);
            this.set({
                assignments: value.join(',')
            });
        },

        removeAssignment: function(assignment) {
            var inputId = this.errorCheckAssignmentId(assignment);
            var currentAssignments = this.getAssignmentsArray();
            var after = _.without(currentAssignments, inputId);
            this.set({
                assignments: after.join(',')
            });
        },

        getAssignmentsArray: function() {
            var assignments = this.get('assignments');
            var arr = []
            if (_.isString(assignments))
                 arr = _.compact(assignments.split(","));
            return arr;
        },

        errorCheckAssignmentId: function(assignment) {
            var idToAdd = assignment;
            if (_.isObject(assignment) && _.isFunction(assignment.get)) {
                idToAdd = assignment.id;
            }

            if (idToAdd.indexOf(',') !== -1) {
                throw new Error('assignment id cannot have a "," in it');
            }

            return idToAdd;
        }
    });

    var CategoriesCollection = Backbone.Collection.extend({
        model: Category,
        url: '/api/categories',

        treeFilterFunc: function(model) {
            return /^#[^#]+$/.test(model.get('path'));
        },

        findHeight: function() {
            return _.reduce(this.map(_.partial(depth)), max, 0)
        },

        initialize: function(options) {
            this.tree = function() {
                var subTreeOnly = this.treeFilterFunc.bind(this);
                return this.filter(subTreeOnly);
            }
            this.url = this.url + '?course=' + options.restQueryParam;
        },
        depth: depth
    });

    courseChannel.reply('categories', function(course) {
        var url = null;
        if (!course) {
            url = courseChannel.request('current:course').get('colloquialUrl');
        }
        else if (_.isString(course)) {
            url = course;
        }
        else if (_.isObject(course) && _.isFunction(course.get)) {
            url = course.get('colloquialUrl');
        }
        return new CategoriesCollection({
            restQueryParam: url
        });
    })

    return Category;

    function depth(elm) {
        return elm.get('path').split('#').length - 1;
    }

    function max(a, b) {
        return Math.max(a, b);
    }
})