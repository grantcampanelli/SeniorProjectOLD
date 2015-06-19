/** @author Michael Murphy
    @author Matt Bleifer
    @author Scotty Beauchamp  */

define(function(require) {

    var App = require('app/app');
    var Radio = require('backbone.radio');
    var QUnit = require('qunit');
    var tchannel = Radio.channel('test');
    tchannel.once('start', function() {
        QUnit.test("hello amd", function(assert) {
            assert.ok(1 == "1", "Passed!");
        });

        var course = tchannel.request('test-course') //new Course(/*...*/)
        QUnit.test("Does reset categories make length zero", function(qunit) {

            /* Empty the categories collection */
            course.get('categories').reset();

            /* Check that there are no category models in the categories collection */
            qunit.ok(course.get('categories').size() === 0);

        })

        QUnit.test("Pushing Category", function(qunit) {

            /* Add a new category */
            course.get('categories').push({
                "name": "Exams",
                "path": "#Exams",
                "assignments": [],
                "weight": 1
            });

            /* Check that there is only one category now */
            qunit.ok(course.get('categories').size() === 1);

        })



        QUnit.test("test the once event trigger on category assignment collection", function(qunit) {
            /* Set a one time event listener for 'add' on the first category's assignments collection */
            var done = qunit.async()
            var b1 = false;
            var ref1 = null;
            course.get('categories').reset();
            course.get('categories').add({
                "name": "Exams",
                "path": "#Exams",
                "assignments": [],
                "weight": 1
            });
            course.get('categories').at(0).get('assignments').once('add', function(model, collection, options) {
                /* Note these assignment statements */
                b1 = true;
                ref1 = model;
                done();
            })

            /*1.  Verify that the assignment collection is empty */
            qunit.ok(course.get('categories').at(0).get('assignments').size() === 0);

            /* Model for a new assignment */
            var assignment = {
                "name": "Midterm 1",
                "rawPoints": 100
            };

            /* Add a new assignment to the "Exams" category */
            course.get('categories').at(0).get('assignments').push(assignment);

            /*2.  Check that the 'add' event listener was triggered */
            qunit.ok(b1 === true);
            /*3.  Check that the model was set correctly in the event listener */
            qunit.ok(ref1 !== null && ref1.get("name") === "Midterm 1" && ref1.get("rawPoints") === 100)

            /*4.  Check that the assignment collection's length is now 1 */
            qunit.ok(course.get('categories').at(0).get('assignments').size() === 1);

            /* Verify that the model is set to the given assignment object */
            qunit.ok(course.get('categories').at(0).get('assignments').at(0) === assignment);


        });




        //   /* Change the assignment */
        //   course.categories.at(0).assignments.at(0) = {
        //   	"name" : "Midterm 2",
        //   	"rawPoints" : 50
        //   };

        //   /* Verify that the assignment collection's length is still 1 */
        //   course.categories.at(0).assignments.length === 1;
        //   /* Check that the fields of the new assignment got changed to the correct values */
        //   course.categories.at(0).assignments.at(0).get("name") = "Midterm 2";
        //   course.categories.at(0).assignments.at(0).get("rawPoints") = 50;

        QUnit.test("Adding Category", function(qunit) {

            /* Add a new category */
            course.get('categories').add([{
                "name": "Exams",
                "path": "#Exams",
                "assignments": [],
                "weight": 1
            }]);

            /* Check that there is only one category now */
            qunit.ok(course.get('categories').size() === 2);

        })
    });
})
