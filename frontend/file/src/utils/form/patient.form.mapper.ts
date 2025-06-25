// frontend/src/utils/patient.form.mapper.ts

import { PatientData } from "../../interface/patient/patient.interface.props";

export const mapPatientToFormData = (patientData: PatientData): FormData => {
  const formData = new FormData();

  Object.entries(patientData).forEach(([key, value]) => {
    // Manejo de archivos (File objects)
    if (value instanceof File) {
      formData.append(key, value);
    }
    // Manejo de la señal de borrado de archivos (cuando el valor es null)
    // Esto es para cuando un archivo existente se elimina en el formulario de edición
    else if (
      value === null &&
      ["document1", "document2", "document3"].includes(key)
    ) {
      formData.append(`${key}_delete`, "true"); // Señal para el backend de que se debe borrar
    }
    // Manejo de objetos anidados y arrays (JSONB en el backend)
    else if (value !== null && typeof value === "object") {
      // Check if it's an object/array, but not null
      // Serializar a JSON string: incluye todos tus objetos complejos y arrays
      // Ejemplos: howDidYouHear, cardiovascular, allergies, surgeryDetails, smoking, drugs, alcohol, currentMedicationUse, otherDiseasesNotMentioned
      formData.append(key, JSON.stringify(value));
    }
    // Manejo de strings, numbers, booleans, y undefined (para campos que no deben enviarse si son undefined)
    else if (value !== undefined) {
      formData.append(key, String(value));
    }
  });

  return formData;
};
