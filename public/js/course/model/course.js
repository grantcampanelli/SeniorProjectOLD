define(function(require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('util/backbone-helper');
    var Hbs = require('handlebars');
    var Mn = require('backbone.marionette');
    var Q = require('q');
    var Radio = require('backbone.radio');
    var Category = require('course/model/category');
    var RoleManager = require('course/model/role-manager');
    require('backbone-documentmodel');
    var courseChannel = Radio.channel('course');

    var DocModel = require('util/doc-model');
    var DocCollection = require('util/doc-collection');

    var adminUserText = require('text!api/Users/admin');

    var defaultCourse = JSON.stringify({
        "minCredit": 60,
        "minD": 60,
        "minC": 70,
        "minB": 80,
        "minA": 90,
        "roles": [{
            "name": "NONE",
            "users": [JSON.parse(adminUserText)._id],
            "permissions": []
        }],
        "students": [],
        "categories": [],
    });

    return Backbone.Model.extend({
        idAttribute: "_id",
        urlRoot: '/api/courses',

        defaults: function() {
            return JSON.parse(defaultCourse);
        },

        findGraphArray: function(data) {

        },

        initialize: function(options) {
            this.setupUrl();
            this.listenTo(this, 'all', function() {
                if (console.warn)
                    console.warn("DEBUG: ", arguments[0]);
            });


        },

        calculateCategoryTotalWeight: function(cat) {
            var items = cat.getAssignmentsArray();
            var subcats = cat.tree();
            var assignments = this.assignments;
            var assignmentTotal = items.map(function(item) {
                var a = assignments.get(item);
                var w = a.getWeight();
                return w;
            }).reduce(function(total, cur) {
                return total + cur;
            }, 0);
            var categoryTotal = subcats.map(function(cat) {
                return cat.getWeight();
            }).reduce(function(total, cur) {
                return total + cur;
            }, 0);
            var grandTotal = assignmentTotal + categoryTotal;
            return grandTotal;
        },
        
        calculateCategoryGrade: function(cat, student) {
            var self = this
            var totalWeight = this.calculateCategoryTotalWeight(cat);
            var items = cat.getAssignmentsArray();
            var subcats = cat.tree();
            
            function multi(weight) {
                // console.log('weight', weight)
                // console.log('totalWeight', totalWeight);
                return weight/(totalWeight);
            }
            
            var assignmentsScore = items.map(function(item){
                var a = self.assignments.get(item)
                // console.log('item weight',a.getWeight());
                // console.log('item grade ', student.getGrade(item));
                return multi(a.getWeight()) * student.getGrade(item);
            }).reduce(function(total, cur) {
                if (_.isFinite(total), _.isFinite(Number(cur)))
                return total + cur;
                else {
                    return total;
                }
            }, 0);
            
            var categoriesScore = subcats.map(function (subcat){
                return multi(subcat.getWeight()) * self.calculateCategoryGrade(subcat, student);
            }).reduce(function(total, cur) {
                // console.log(cur);
                if (_.isFinite(cur))
                    return total + cur;
                else {
                    return total;
                }
            }, 0);
            var grade = 0;
            if (_.isFinite(assignmentsScore))
                grade += assignmentsScore
            if (_.isFinite(categoriesScore))
                grade += categoriesScore;
                
            return grade;
        },

        calculateGrade: function(student) {
            var self = this
            var categories = this.categories;
            var students = this.students;
            var assignments = this.assignments;
            var toplevelTotals = 0;
            return this.categories.tree().map(function(cat){
                
                if (_.isFinite((cat.getWeight())))
                toplevelTotals += cat.getWeight();
                return {
                    total: self.calculateCategoryGrade(cat, student),
                    category: cat,
                    weight: cat.getWeight()
                };
            }).reduce(function(total, cur) {
                if (_.isFinite(cur.total) && _.isFinite(cur.weight) && _.isFinite(toplevelTotals))
                return total + cur.total*cur.weight / toplevelTotals;
                else {
                    throw new Error(cur)
                    return total;
                }
                
            }, 0);
            
            
        },

        getLetterGrade: function(totalScore, course) {
            //console.log("made it to getLetterGrade");
            //var course = this.model.get('course');
            //console.log("got course");
            //console.log(course)
            var minA = course.get('minA');
            var minB = course.get('minB');
            var minC = course.get('minC');
            var minD = course.get('minD');
            //console.log("got minimums")
            if(totalScore >= minA) {
                return "A"
            }
            else if(totalScore >= minB) {
                return "B"
            }
            else if(totalScore >= minC) {
                return "C"
            }
            else if(totalScore >= minD) {
                return "D"
            }
            else {
                return "F"
            }

        },

        setupUrl: function() {
            var colloquialUrl = this.get("colloquialUrl");
            if (colloquialUrl) {
                this.url = '/api/courses/' + colloquialUrl + "";
            }
            else {
                this.url = '/api/courses'
            }
        },

        // For collections
        getNestedCollection: getNestedCollection

    }, {
        createColloquialUrl: createColloquialUrl,
        findTermDates: findTermDates,
        isValidTerm: isValidTerm,
        isValidYear: isValidYear
    });

    function getNestedCollection(nestedKey, nestedValue, nestedOptions) {
        switch (nestedKey) {
            case 'categories':
                return new Category(nestedValue, nestedOptions);

            case 'roles':
                return new RoleManager(nestedValue, nestedOptions);

            case 'aColor':
            case 'bColor':
            case 'cColor':
            case 'dColor':
            case 'fColor':
            default:
                return new DocCollection(nestedValue, nestedOptions);
        }
    }

    function createColloquialUrl(course) {
        var fields = [
            'classCode',
            'classNumber',
            'section',
            'term',
        ]
        var year = course.get('year');
        var term = course.get('term');
        if (_.every(fields, course.has, course) && isValidYear(year) &&
            isValidTerm(term)) {
            return _.map(fields, course.get, course).join('-') + year;
        }
        return false;
    }

    function findTermDates(term, year) {
        function date(m1, d1, m2, d2) {
            return {
                start: new Date(year, m1, d1),
                end: new Date(year, m2, d2)
            }
        }
        return {
            'Winter': date(0, 5, 2, 20),
            'Spring': date(2, 30, 5, 12),
            'Summer': date(5, 19, 7, 29),
            'Fall': date(8, 22, 11, 12)
        }[term];
    }

    function isValidTerm(term) {
        var validTerms = [
            'Winter',
            'Spring',
            'Summer',
            'Fall'
        ];
        return _.contains(validTerms, term);
    }

    function isValidYear(year) {
        return /^\d{4}$/.test(year);
    }

});