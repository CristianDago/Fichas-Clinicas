import { Grid } from "../components/common/grid/grid";
import { useStudentsList } from "../hooks/use.students.list";
import { StudentTable } from "../components/student-table/student.table";

export default function Dashboard() {
  const { students, error, loading } = useStudentsList();

  if (loading) return <p>Cargando estudiantes...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Grid>
      <StudentTable
        students={students}
        title={`Estudiantes (${students.length})`}
        viewProfilePath="/dashboard/student"
      />
    </Grid>
  );
}
