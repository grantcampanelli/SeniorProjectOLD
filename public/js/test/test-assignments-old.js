var course = new Course(/*...*/)

/* Empty the categories collection */
course.categories.reset();

/* Check that there are no category models in the categories collection */ 
course.categories.models.length === 0;

/* Add a new category */
course.categories.push({
    "name": "Exams",
    "path": "#Exams",
    "assignments": [],
    "weight": 1
});

/* Check that there is only one category now */ 
course.categories.models.length === 1;

/* Set a one time event listener for 'add' on the first category's assignments collection */
var b1 = false;
var ref1 = null;
course.categories.at(0).assignments.once(‘add’, function(model, collection, options) {
   /* Note these assignment statements */
   b1 = true;
   ref1 = model;
});

/* Verify that the assignment collection is empty */
course.categories.at(0).assignments.models.length === 0;

/* Model for a new assignment */
var assignment = {
	"name" : "Midterm 1",
	"rawPoints" : 100
};

/* Add a new assignment to the "Exams" category */
course.categories.at(0).assignments.push(assignment);

/* Test the accessor proxies */
course.categories.at(0).assignments.at(0).get("name") === course.categories.at(0).assignments.at(0).name;
course.categories.at(0).assignments.at(0).get("rawPoints") === course.categories.at(0).assignments.at(0).rawPoints;

/* Check that the 'add' event listener was triggered */
b1 === true && b2 === true;
/* Check that the model was set correctly in the event listener */
ref1 !== null && ref1.get("name") === "Midterm 1" && ref1.get("rawPoints") === 100;

/* Check that the assignment collection's length is now 1 */
course.categories.at(0).assignments.models.length === 1;

/* Verify that the model is set to the given assignment object */
course.categories.at(0).assignments.at(0) === assignment;

/* Change the assignment */
course.categories.at(0).assignments.at(0) = {
	"name" : "Midterm 2",
	"rawPoints" : 50
};

/* Verify that the assignment collection's length is still 1 */
course.categories.at(0).assignments.length === 1;
/* Check that the fields of the new assignment got changed to the correct values */
course.categories.at(0).assignments.at(0).get("name") = "Midterm 2";
course.categories.at(0).assignments.at(0).get("rawPoints") = 50;