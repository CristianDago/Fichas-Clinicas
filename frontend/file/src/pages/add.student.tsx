import { useEffect } from "react";
import { AddStudentForm } from "../components/common/forms/add-student/add.student.form";
import { useAuth } from "../components/auth/auth.context";
import { useAddStudent } from "../hooks/use.add.students";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddStudent() {
  const { token } = useAuth();
  const {
    successMessage,
    errorMessage,
    handleSubmit,
    studentData,
    handleChange,
    formKey,
  } = useAddStudent(token);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage, { position: "top-right", autoClose: 5000 });
    }
    if (errorMessage) {
      toast.error(errorMessage, { position: "top-right", autoClose: 5000 });
    }
  }, [successMessage, errorMessage]);

  if (!token) {
    return (
      <div>
        <h1>Agregar Estudiante</h1>
        <p style={{ color: "red" }}>
          No estás autenticado. Inicia sesión para agregar estudiantes.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1>Agregar Estudiante</h1>
      <AddStudentForm
        key={formKey}
        studentData={studentData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}
