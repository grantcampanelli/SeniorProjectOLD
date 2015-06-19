/**
 * Testing Course
 * @author Mike Ryu
 */

define(function(require) {

    var App = require('app/app');
    var Radio = require('backbone.radio');
    var QUnit = require('qunit');
    var tChannel = Radio.channel('test');
    var Course = require('course/model/course');
    var _ = require('underscore');

    tChannel.once('start', function() {
        QUnit.test("hello amd", function(assert) {
            assert.ok(1 == "1", "Passed!");
        });

        /**************************************************
         * Creating new course and setting the attributes *
         **************************************************/

        var c = new Course;
        QUnit.test("Test setting valid class code", function(qunit) {

            /* Set */
            c.set({
                classCode: 'CPE'
            });

            /* Get and check */
            qunit.ok(c.get('classCode') == 'CPE');
        });

        QUnit.test("Test setting valid class number", function(qunit) {

            /* Set */
            c.set({
                classNumber: '101'
            });

            /* Get and check */
            qunit.ok(c.get('classNumber') == '101');
        });

        QUnit.test("Test setting invalid class number", function(qunit) {

            /* Set */
            c.set({
                classNumber: '!@#$'
            });

            /* Get and check */
            qunit.ok(c.get('classNumber') == '101');
        });

        QUnit.test("Test setting valid class section", function(qunit) {

            /* Set */
            c.set({
                section: '10'
            });

            /* Get and check */
            qunit.ok(c.get('classNumber') == '10');
        });

        QUnit.test("Test setting invalid class section", function(qunit) {

            /* Set */
            c.set({
                section: '!@#$'
            });

            /* Get and check */
            qunit.ok(c.get('classNumber') == '10');
        });

        QUnit.test("Test setting valid class term", function(qunit) {

            /* Set */
            _.bind(this.setTerm, this, 'Winter');
            function setTerm (term) {
                c.set({
                    term: term
                });
            }

            /* Get and check */
            qunit.ok(c.get('term') == 'Winter');
        });

        QUnit.test("Test setting invalid class term", function(qunit) {

            /* Set */
            _.bind(this.setTerm, this, 'Wonderland');
            function setTerm (term) {
                c.set({
                    term: term
                });
            }

            /* Get and check */
            qunit.ok(c.get('term') == 'Winter');
        });

        QUnit.test("Test setting valid class year", function(qunit) {

            /* Set */
            c.set({
                year: '2016'
            });

            /* Get and check */
            qunit.ok(c.get('year') == '2016');
        });

        QUnit.test("Test setting invalid class year", function(qunit) {

            /* Set */
            c.set({
                year: '!@#$'
            });

            /* Get and check */
            qunit.ok(c.get('year') == '2016');
        });

        QUnit.test("Test setting class URL", function(qunit) {

            /* Generate URL */
            var url = Course.createColloquialUrl(c);

            /* Check generated URL */
            qunit.ok(url == "CPE-101-10-Winter2016");

            /* Set */
            c.set({
                colloquialUrl: url
            });

            /* Get and check */
            qunit.ok(c.get('year') == 'url');
        });

        /*****************************************************
         * Testing functionality of the newly created course *
         *****************************************************/

        QUnit.test("test the once event trigger on category assignment collection", function(qunit) {
            /* Set a one time event listener for 'add' on the first category's assignments collection */
            var done = qunit.async();
            var b1 = false;
            var ref1 = null;
            c.get('categories').reset();
            c.get('categories').add({
                "name": "Exams",
                "path": "#Exams",
                "assignments": [],
                "weight": 1
            });
            c.get('categories').at(0).get('assignments').once('add', function(model, collection, options) {
                /* Note these assignment statements */
                b1 = true;
                ref1 = model;
                done();
            });

            /*1.  Verify that the assignment collection is empty */
            qunit.ok(c.get('categories').at(0).get('assignments').size() === 0);

            /* Model for a new assignment */
            var assignment = {
                "name": "Midterm 1",
                "rawPoints": 100
            };

            /* Add a new assignment to the "Exams" category */
            c.get('categories').at(0).get('assignments').push(assignment);

            /*2.  Check that the 'add' event listener was triggered */
            qunit.ok(b1 === true);
            /*3.  Check that the model was set correctly in the event listener */
            qunit.ok(ref1 !== null && ref1.get("name") === "Midterm 1" && ref1.get("rawPoints") === 100);

            /*4.  Check that the assignment collection's length is now 1 */
            qunit.ok(c.get('categories').at(0).get('assignments').size() === 1);

            /* Verify that the model is set to the given assignment object */
            qunit.ok(c.get('categories').at(0).get('assignments').at(0) === assignment);

        });

        QUnit.test("Adding Category", function(qunit) {

            /* Add a new category */
            c.get('categories').add([{
                "name": "Exams",
                "path": "#Exams",
                "assignments": [],
                "weight": 1
            }]);

            /* Check that there is only one category now */
            qunit.ok(c.get('categories').size() === 2);

        });

        QUnit.test("test multiple event dispatch with more than one listener", function(qunit) {
            var b1 = false;
            var ref1 = null;
            c.get('categories').once('add', function(model, collection, options) {
                /* Note these assignment statements */
                b1 = true;
                ref1 = model
            });

            var b2 = false;
            var ref2 = null;
            c.get('categories').once('add', function(model, collection, options) {
                /* Note these assignment statements */
                b2 = true;
                ref2 = model
            });

            var numCategoriesBefore = course.get('categories').models.length;
            var numTopLevelCategoriesBefore = course.get('categories').tree();
            c.get('categories').push({
                "name": "Projects",
                "path": "#Projects",
                "assignments": [],
                "weight": 1
            });
            var numCategoriesAfter = course.get('categories').models.length;
            var numTopLevelCategoriesAfter = course.get('categories').models.length;

            qunit.ok(b1 === true && b2 === true);
            qunit.ok(ref1 !== null && ref1.get('path') === '#Projects' && ref1 === ref2);

            qunit.ok((numCategoriesAfter - numCategoriesBefore) ==
                (numTopLevelCategoriesAfter - numTopLevelCategoriesBefore) == 1);
        })
    });
});
