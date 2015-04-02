package course;

import util.GraderObject;

/**
 * Holds all the methods associated with a course.
 */
public interface Course extends CourseAccessor, CourseModifier {
    /**
     * Accessor for the course snapshot.
     * @return <code>CourseSnapshot</code>.
     */
    CourseAccessor getCourseSnapshot();

    /**
     * Sets the course snapshot.
     * @param courseAccessor new course snapshot.

      pre:
         getCourseSnapshot() == null || getCourseSnapshot() != null
      post:
         getCourseSnapshot() == courseAccessor
     */
    void setCourseSnapshot(CourseAccessor courseAccessor);
}