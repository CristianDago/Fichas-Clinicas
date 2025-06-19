import { useEffect, useState } from "react";
import { useAuth } from "../components/auth/auth.context";
import { fetchStudentsList } from "../utils/fetch.students";
import type { Student } from "../interface/student/student";

export const useStudentsList = () => {
  const { token } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setError("Token no proporcionado");
        setLoading(false);
        return;
      }

      try {
        const data: Student[] = await fetchStudentsList(token);

        const sortedData = [...data].sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });

        setStudents(sortedData);
      } catch (err: any) {
        setError(err.message || "Error desconocido al obtener estudiantes");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  return { students, error, loading };
};
