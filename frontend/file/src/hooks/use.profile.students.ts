import { useState, useEffect, useCallback } from "react";
import {
  fetchStudent,
  updateStudent,
  deleteStudent,
} from "../utils/students.profile";
import type { Student } from "../interface/student/student";
import { toast } from "react-toastify";
import { mapStudentToFormData } from "../utils/student.form.mapper";

export const useStudentProfile = (
  id: string | undefined,
  token: string | null | undefined
) => {
  const [student, setStudent] = useState<Student | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState<Student | null>(null);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      setIsNotFound(false);
      if (!id) {
        setIsNotFound(true);
        return;
      }
      if (!token) {
        return;
      }

      try {
        const data = await fetchStudent(id, token);
        setStudent(data);
        setUpdatedData(data);
      } catch (err: any) {
        if (
          err.message &&
          (err.message.includes("no se encontraron datos") ||
            err.message.includes("404") ||
            err.message.includes("not found"))
        ) {
          setIsNotFound(true);
          setError(null);
        } else {
          setError(err.message || "Error desconocido al cargar el estudiante");
          setIsNotFound(false);
        }
      }
    };

    fetchData();
  }, [id, token]);

  const handleEdit = useCallback(() => setIsEditing(true), []);
  const handleChange = useCallback(
    (
      e:
        | React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
          >
        | { name: keyof Student; value: any }
    ) => {
      setUpdatedData((prevData) => {
        if (!prevData) return null;

        if ("target" in e) {
          const { name, value, type } = e.target;
          if (type === "file") {
            const inputElement = e.target as HTMLInputElement;
            return {
              ...prevData,
              [name]: inputElement.files?.[0] || null,
            };
          } else {
            return { ...prevData, [name]: value };
          }
        } else {
          return { ...prevData, [e.name]: e.value };
        }
      });
    },
    []
  );

  const handleDeleteFile = useCallback(
    (fieldName: keyof Student) => {
      handleChange({ name: fieldName, value: null });
    },
    [handleChange]
  );

  const handleSubmitEdit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!updatedData || !id || !token) {
        toast.error("Falta información para actualizar el estudiante.", {
          position: "top-right",
        });
        return;
      }

      const formData = mapStudentToFormData(updatedData);

      try {
        const data = await updateStudent(id, token, formData);
        setStudent(data);
        setUpdatedData(data);
        setIsEditing(false);
        toast.success("Estudiante actualizado con éxito", {
          position: "top-right",
        });
      } catch (error: any) {
        toast.error(error.message || "Error inesperado al actualizar", {
          position: "top-right",
        });
      }
    },
    [updatedData, id, token]
  );

  const handleDelete = useCallback(async () => {
    if (!id || !token) return;
    if (
      !window.confirm(
        "¿Estás seguro de eliminar este estudiante? Esta acción es irreversible."
      )
    )
      return;
    try {
      await deleteStudent(id, token);
      setIsDeleted(true);
      toast.success("Estudiante eliminado con éxito", {
        position: "top-right",
      });
    } catch (error: any) {
      toast.error(error.message || "Error al eliminar estudiante", {
        position: "top-right",
      });
    }
  }, [id, token]);

  return {
    student,
    error,
    isEditing,
    updatedData,
    handleEdit,
    handleChange,
    handleSubmitEdit,
    handleDelete,
    isDeleted,
    isNotFound,
    handleDeleteFile,
  };
};
