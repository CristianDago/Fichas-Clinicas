export const addStudent = async (token: string, studentData: FormData) => {
  if (!token) {
    throw new Error("Token no válido o no presente.");
  }

  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/students`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: studentData,
    }
  );

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(
      errorBody.message ||
        errorBody.error ||
        "Error al agregar el estudiante. Por favor, intente de nuevo."
    );
  }

  return response.json();
};

export const fetchStudentsList = async (token: string) => {
  if (!token) {
    throw new Error("Token de autenticación no proporcionado.");
  }

  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/students`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      "Error al obtener los estudiantes. Por favor, intente de nuevo."
    );
  }

  return await response.json();
};
