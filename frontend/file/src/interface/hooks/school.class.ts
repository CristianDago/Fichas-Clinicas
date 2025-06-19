import { Student } from "../student/student";

export interface UseSchoolClassReturn {
  normalizedSchool: string;
  normalizedCourse: string;
  getFilteredStudentsBySchoolAndCourse: (allStudents: Student[]) => Student[];
}
