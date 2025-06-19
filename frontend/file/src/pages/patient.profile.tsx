import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../components/auth/auth.context";
import { useStudentProfile } from "../hooks/use.profile.students";
import UpdateStudentForm from "../components/common/forms/update-student/update.student.form";
import StudentDetails from "../components/common/details-views/student.profile.details";

const StudentProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const {
    student,
    error,
    isEditing,
    updatedData,
    handleEdit,
    handleChange,
    handleSubmitEdit,
    handleDelete,
    handleDeleteFile,
    isDeleted,
  } = useStudentProfile(id, token);
  const navigate = useNavigate();

  useEffect(() => {
    if (isDeleted) {
      navigate("/dashboard");
    }
  }, [isDeleted, navigate]);
  if (error) {
    return <div>{error}</div>;
  }

  if (!student) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      {isEditing ? (
        <UpdateStudentForm
          student={updatedData!}
          onChange={handleChange}
          onSubmit={handleSubmitEdit}
          onDeleteFile={handleDeleteFile}
        />
      ) : (
        <StudentDetails
          student={student}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default StudentProfile;
