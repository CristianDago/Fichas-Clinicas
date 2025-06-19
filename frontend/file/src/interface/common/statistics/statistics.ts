// src/interface/common/statistics.ts
import type { Student } from "../../student/student";
import type { Source, School, Course } from "../enums/enums"; // Importa enums desde la nueva ubicación

export interface StudentFiltersProps {
  students: Student[];
  sourceFilter: Source | null;
  schoolFilter: School | null;
  courseFilter: Course | null;
}

export interface SourceFilterProps {
  students: Student[];
  source: Source;
}

export interface SchoolFilterProps {
  students: Student[];
  school: School;
}

export interface CourseFilterProps {
  students: Student[];
  course: Course;
}

export interface StatisticsFiltersProps {
  students: Student[];
  source: Source | null;
  school: School | null;
  course: Course | null;
}

export interface FilteredStatistics {
  socialMediaCount: number;
  captadorCount: number;
  noRegisteredSource: number;
  whatsappCount: number;
  phoneCount: number;
  noRegisteredCommunication: number;
  contactsByPerson: { Captador: string; Contacto: number }[];
  studentsBySchool: { school: string; students: number }[];
  studentsByCollegeCourse: { [school: string]: { [course: string]: number } };
  studentsBySchoolCourseFeedback: {
    Escuela: string;
    Curso: string;
    feedback: string;
    Estudiantes: number;
  }[];
  genderCount: {
    hombres: number;
    mujeres: number;
    otros: number;
    noContesta: number;
  };
  studentsByGeneralState: { estado: string; cantidad: number }[];
  studentsWithoutSchoolAndCourse: number;
}

export interface BarChartProps {
  data: { name: string; value: number }[];
  title: string;
}

export interface TableProps {
  data: Record<string, any>[];
  columns: string[];
}

export interface StudentTableProps {
  students: Student[];
  title: string;
  viewProfilePath: string;
}
