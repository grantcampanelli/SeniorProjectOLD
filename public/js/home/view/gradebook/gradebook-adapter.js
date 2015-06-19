define(function (require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Q = require('q');
    var Backbone = require('util/backbone-helper');
    var Radio = require('backbone.radio');
    var Mn = require('backbone.marionette');
    var Hbs = require('handlebars');
    var template = require('text!course/view/gradebook/gradebookView.hbs');
    var channel = Radio.channel('course');

    return {
        groupByRow: function () {
            var categories = channel.request('current:course').categories;
            var arr = [];
            var groups = categories.groupBy(categories.depth);
            var keys = _.keys(groups).sort();

            _.map(keys, function (k) {
                arr.push(groups[k]);
            });
            return arr;
        },

        findRowSpans: function (colspan) {
            var categories = channel.request('current:course').categories;
            var result = {}
            var treeHeight = 1 + categories.findHeight();
            _.each(categories.tree(), _.partial(registerAll, _, treeHeight))
            return result;

            function registerAll(cat, h) {
                registerResult(cat, h);
                if (cat) {
                    var arr = cat.getAssignmentsArray()
                    if (arr.length > 0)
                        arr.map(_.partial(registerResult, _, h - 1));
                    _.map(cat.tree(), _.partial(registerAll, _, h - 1));
                }
            }

            function registerResult(a, h) {
                if (a) {
                    result[a] = h;
                }
            }
        },

        findColSpans: function () {
            var categories = channel.request('current:course').categories;
            var result = {}
            var self = this;
            _.each(categories.tree(), colSpan);
            return result;

            function colSpan(elm) {
                var sub = null;
                if (elm) {
                    var sub = elm.tree().map(colSpan);
                    var num = _.reduce(sub, self.sum, 0) | 0;
                    if (elm.has('assignments'))
                        num += elm.countOwnAssignments();
                    if (elm.id)
                        result[elm.id] = num;
                    return num;
                }
                return 0;
            }
        },

        calculateTableHeaderLayout: function () {
            var assignments = channel.request('current:course').assignments;
            var categories = channel.request('current:course').categories;
            var rowCats = this.groupByRow();
            var colspan = _.partial(lookup, this.findColSpans())

            var rowspan = _.partial(lookup, this.findRowSpans())
            var result = [];
            var height = 1 + categories.findHeight();

            categories.tree().forEach(_.partial(render, _, result, 0));
            return result;

            function lookup(table, item) {
                return table[item.id];
            }

            function assignmentColumn(arg) {
                var a = assignments.get({id: arg});
                return {
                    name: a.get('name'),
                    style: "assignment",
                    colspan: 1,
                    rowspan: rowspan(a),
                    id: a.id,
                    assignment: a
                }
            }

            function categoryColumn(cat) {
                return {
                    name: cat.get('name'),
                    style: "category",
                    colspan: colspan(cat),
                    rowspan: 1,
                    id: cat.id
                }
            }

            function appendColumnToRow(rows, rowNum, column) {
                while (rows.length <= rowNum) {
                    rows.push([]);
                }
                rows[rowNum].push(column);
            }

            function render(cat, rows, rowNum) {
                if (colspan(cat) < 1) {
                    return;
                }
                var addBelow = _.partial(appendColumnToRow, rows, rowNum + 1);
                var renderChild = _.partial(render, _, rows, rowNum + 1);
                var arr = cat.getAssignmentsArray();
                if (arr.length > 0) {
                    var mkLeaf = _.compose(addBelow, assignmentColumn);
                    cat.getAssignmentsArray().map(mkLeaf);
                }

                _.each(cat.tree(), renderChild);
                appendColumnToRow(rows, rowNum, categoryColumn(cat));
                return rows;
            }
        },

        sum: function (runningTotal, next) {
            return runningTotal + next;
        }
    }
});