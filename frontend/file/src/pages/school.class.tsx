import { useMemo } from "react";
import { Grid } from "../components/common/grid/grid";
import { useStudentsList } from "../hooks/use.students.list";
import { StudentTable } from "../components/student-table/student.table";
import { useSchoolClass } from "../hooks/use.school.class";

export default function SchoolClass() {
  const { students, error, loading } = useStudentsList();

  const {
    normalizedSchool,
    normalizedCourse,
    getFilteredStudentsBySchoolAndCourse,
  } = useSchoolClass();

  const studentsForTable = useMemo(() => {
    if (!students) {
      return [];
    }
    return getFilteredStudentsBySchoolAndCourse(students);
  }, [students, getFilteredStudentsBySchoolAndCourse]);

  if (loading) {
    return <p>Cargando estudiantes...</p>;
  }

  if (error) {
    return <p>Error al cargar estudiantes: {error}</p>;
  }

  if (studentsForTable.length === 0) {
    return (
      <p>
        No se encontraron estudiantes para{" "}
        <strong>
          {normalizedSchool} - {normalizedCourse}
        </strong>
        .
      </p>
    );
  }

  return (
    <Grid>
      <StudentTable
        students={studentsForTable}
        title={`${normalizedSchool} - ${normalizedCourse}`}
        viewProfilePath="/dashboard/student"
      />
    </Grid>
  );
}
