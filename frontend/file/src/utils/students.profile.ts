export const fetchStudent = async (id: string, token: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/students/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorBody = await response.json();
    console.error(`Error de la API al obtener estudiante ${id}:`, errorBody);

    throw new Error(
      errorBody.message ||
        errorBody.error ||
        "Error al obtener los datos del estudiante."
    );
  }

  return response.json();
};

export const updateStudent = async (
  id: string,
  token: string,
  updatedData: FormData
) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/students/${id}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: updatedData,
    }
  );

  if (!response.ok) {
    const errorBody = await response.json();
    console.error(`Error de la API al actualizar estudiante ${id}:`, errorBody);

    throw new Error(
      errorBody.message ||
        errorBody.error ||
        "Error al actualizar el estudiante."
    );
  }

  return response.json();
};

export const deleteStudent = async (id: string, token: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/students/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorBody = await response.json();
    console.error(`Error de la API al eliminar estudiante ${id}:`, errorBody);

    throw new Error(
      errorBody.message || errorBody.error || "Error al eliminar el estudiante."
    );
  }

  return response.json();
};
