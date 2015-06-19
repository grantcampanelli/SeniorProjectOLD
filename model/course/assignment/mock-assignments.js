var _ = require('underscore');
var generateMockCategory = require('./mock-category');


module.exports = function generateMockAssignments() {
   var categories = new Array();
   function fillSubCategory(parent, descriptions) {
      for (var d of descriptions) {
         var sub = generateMockCategory(d[0], parent.path);
         categories.push(sub);
         for(var i = 1; i <= d[2]; ++i) {
            sub.assignments.push({name: d[1]+" "+i})
         }
      }
      return categories;
   }

   var tests = generateMockCategory('Tests', '');
   categories.push(tests);
   fillSubCategory(tests, _.zip(['Exams', 'Midterms', 'Quizzes'], ['Exam', 'Midterm', 'Quiz'], [1, 2, 8]));

   var projects = generateMockCategory('Projects', '');
   categories.push(projects);
   fillSubCategory(projects, _.zip(['Programs', 'Research', 'Software', 'Others'], ['Program', 'Experiment', 'Milestone', 'Report'], [3, 4, 6, 2]));

   var coursework = generateMockCategory('Coursework', '');
   categories.push(coursework);
   fillSubCategory(coursework, _.zip(['Homework', 'Classwork'], ['Homework', 'Problem Set'], [5, 4]));

   fillSubCategory({path:''}, _.zip(['Labs'], ['Lab'], [6]));
   categories.sort((a, b) => {return a.path.localeCompare(b.path);});

   var assignments = _.flatten(categories
    .map(function(c){return c.assignments;})
    .reduce(function(pre,cur) {pre.push(cur); return pre}, []))

   return categories;
};