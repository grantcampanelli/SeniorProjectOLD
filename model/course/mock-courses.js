var _ = require('underscore');
var MockAssignments = require('./assignment/mock-assignments')();
var COURSE_ABBREVIATION = require('./abbreviations');
var TERMS = ['Winter', 'Spring', 'Summer', 'Fall'];


function generateMockCourses(admin, allUsers) {
   var i = 0;
   

   function addUsers(course) {
      for (var w = 0; w < 1; w++) {
         course.roles[0].users.push(allUsers[i++ % allUsers.length]);
      }

      for (var x = 0; x < 2; x++) {
         course.roles[1].users.push(allUsers[i++ % allUsers.length]);
      }

      for (var y = 0; y < 20; y++) {
         var student = allUsers[i++ % allUsers.length];
         course.roles[2].users.push(student);
         var studentRecord = _.pick(student, 'first', 'last', 'username', 'email', 'major', 'emplId');

         studentRecord.user = student.id.toString();
         course.students.push(studentRecord);
      }
      return course;
   }
   var arr = new Array(50);
   for (var index = 0; index < 50; index++) {
      arr[index] = addUsers(generateCourse(admin));
   }
   return arr;
}

function generateCourse(admin) {
   var defaultRoles = new Array(4);
   defaultRoles[0] = {name: "INSTRUCTOR", permissions: new Array(), users: new Array()},
   defaultRoles[1] = {name: "TEACHER_ASSISTANT", permissions: new Array(), users: new Array()},
   defaultRoles[2] = {name: "STUDENT", permissions: new Array(), users: new Array()},
   defaultRoles[3] = {name: "NONE", permissions: new Array(), users: (function(){var a = new Array(); a[0] = admin.id.toString();})()};

   function course_code_generator() {
      return COURSE_ABBREVIATION[randomInt(COURSE_ABBREVIATION.length)];
   }

   function COURSE_NUMBER_GENERATOR() {
      return genStr('12345',1) + genStr('1234567890', 2);
   }

   function COURSE_SECTION_GENERATOR() {
      return randomLetter('123456789');
   }

   function genDates(term, year) {
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
   
   
   var result = new Object();
   result.classCode = course_code_generator.call();
   result.classNumber = COURSE_NUMBER_GENERATOR.call();
   result.section = COURSE_SECTION_GENERATOR.call();
   result.roles = defaultRoles;
   result.term = TERMS[Math.floor(Math.random() * TERMS.length)];
   result.year = 2014 + Math.ceil(Math.random() * 3);
   result.categories = MockAssignments;
   result.students = new Array();
   _.extend(result, genDates(result.term, Number(result.year)));
   result.colloquialUrl =  result.classCode + "-" + result.classNumber + "-" + result.section + "-" + result.term + result.year;

   return result;
}

function randomInt(max) {
   return Math.floor(Math.random() * max);
}

function randomLetter(alphabet) {
   return alphabet.charAt(randomInt(alphabet.length))
}

function genStr(alphabet, len) {
   var result = "";
   while (len--) {
      result += randomLetter(alphabet);
   }
   return result;
}

module.exports = generateMockCourses;