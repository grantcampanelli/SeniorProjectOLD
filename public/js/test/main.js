
/****
 *
 * GENERAL TEST PLAN OF NODE GRADER
 *
 * Class ScheduleTest is the companion testing class for class <a href=
 * Schedule.html> Schedule </a>.  It implements the following module test plan:
 *                                                                         <pre>
 *     Phase 1: Unit test the constructor.
 *
 *     Phase 2: Unit test the simple access method getCategories. -- Not Necessary, all library code
 *
 *     Phase 3: Unit test the constructive methods scheduleAppointment,          -- do on creating category or adding student or assignment
 *              scheduleTask, and scheduleEvent.
 *
 *     Phase 4: Unit test the constructive methods scheduleMeeting and   --   Same as before
 *              confirmMeeting.
 *
 *     Phase 5: Unit test the changeItem and deleteItem methods. -- Most important ones, specifically on change and delete category
 *
 *     Phase 6: Repeat phases 1 through 5.
 *
 *     Phase 7: Stress test by scheduling and deleting 100000 items.  -- Do this on creating and deleting categories
 *                                                                        </pre>
 */

QUnit.test("hello test", function(assert) {
   assert.ok(1 == "1", "Passed!");
});

QUnit.test("courses test", function(assert) {

   // use course-tests.js
   assert.ok(1 == "1", "Passed!");
});


QUnit.test("grant's test", function(assert) {
    assert.ok(5 == '6', "Passed!");
});

//public class ScheduleTest extends Schedule { }