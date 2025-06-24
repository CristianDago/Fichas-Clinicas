import { useState, useEffect, useCallback } from "react";
import {
  fetchPatient,
  updatePatient,
  deletePatient,
} from "../utils/fetch.patient";
import type {
  PatientData,
  MedicalConditionDetails,
  SelectOptionWithSpecify,
} from "../interface/patient/patient.interface";
import { toast } from "react-toastify";
import { mapPatientToFormData } from "../utils/patient.form.mapper";

const initialMedicalCondition: MedicalConditionDetails = {
  present: "",
  type: undefined,
  medications: undefined,
  dose: undefined,
};
const initialSelectOptionWithSpecify: SelectOptionWithSpecify = {
  selected: "",
  specify: undefined,
};


const initialPatientData: PatientData = {
  id: undefined, // ID es opcional al inicio
  createdAt: undefined, // createdAt es opcional al inicio
  // --- Datos Personales ---
  name: "",
  lastname: "",
  rut: "",
  age: undefined,
  weight: undefined,
  height: undefined,
  imc: undefined,
  email: "",
  phone: "",
  children: undefined,
  occupation: "",
  reasonForConsultation: "",
  howDidYouHear: { ...initialSelectOptionWithSpecify },
  gender: "",

  // --- Antecedentes Médicos ---
  cardiovascular: { ...initialMedicalCondition },
  ophthalmological: { ...initialMedicalCondition },
  psychologicalPsychiatric: { ...initialMedicalCondition },
  diabetes: { ...initialMedicalCondition },
  hypertension: { ...initialMedicalCondition },
  allergies: { ...initialSelectOptionWithSpecify },
  autoimmuneDiseases: { ...initialMedicalCondition },
  hematologicalDiseases: { ...initialMedicalCondition },
  respiratoryDiseases: { ...initialMedicalCondition },
  sleepApnea: { ...initialMedicalCondition },
  eatingDisorder: { ...initialMedicalCondition },
  currentMedicationUse: { present: "", specify: undefined },
  otherDiseasesNotMentioned: { ...initialMedicalCondition },

  // --- Hábitos ---
  physicalActivity: "",
  smoking: { isSmoker: "", cigarettesPerDay: undefined },
  drugs: { usesDrugs: "", type: "" },
  alcohol: { consumesAlcohol: "", quantity: undefined },

  // --- Antecedentes Quirúrgicos ---
  surgeryDetails: {
    type: { ...initialSelectOptionWithSpecify },
    anesthesiaType: { ...initialSelectOptionWithSpecify },
    adverseEffect: { ...initialSelectOptionWithSpecify },
  },

  // --- Procedimientos ---
  suggestedTreatmentBySurgeon: undefined,
  patientDecidedTreatment: undefined,

  // --- Documentación ---
  document1: null,
  document2: null,
  document3: null,
};

export const usePatientProfile = (
  id: string | undefined,
  token: string | null | undefined
) => {
  const [patient, setPatient] = useState<PatientData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  // ¡CORRECCIÓN AQUÍ! Inicializamos updatedData con patientData
  const [updatedData, setUpdatedData] = useState<PatientData | null>(
    patient ? patient : initialPatientData
  );
  const [isDeleted, setIsDeleted] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);

  // Función para obtener los datos del paciente al cargar o si cambia el ID/token
  useEffect(() => {

    const fetchData = async () => {
      setError(null);
      setIsNotFound(false);
      if (!id) {
        setIsNotFound(true);
        setError("ID de paciente no proporcionado.");
        return;
      }
      if (!token) {
        setError("Token de autenticación no proporcionado.");
        return;
      }
      try {
        const data: PatientData = await fetchPatient(id, token);
        setPatient(data);
        setUpdatedData(data); // Inicializa updatedData con los datos del paciente
      } catch (err: any) {
        if (
          err.message &&
          (err.message.includes("no se encontraron datos") ||
            err.message.includes("404") ||
            err.message.includes("not found") ||
            err.message.includes("ID de paciente no es válido"))
        ) {
          setIsNotFound(true);
          setError(null); // Limpiar error si es un 404 de "no encontrado"
        } else {
          setError(
            err.message || "Error desconocido al cargar la ficha clínica."
          );
          setIsNotFound(false);
        }
      }
    };

    fetchData();
  }, [id, token]);

  // Función para activar el modo de edición
  const handleEdit = useCallback(() => setIsEditing(true), []);

  // Función genérica para manejar cambios en los campos del formulario
  const handleChange = useCallback(
    (
      e:
        | React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
          >
        | { name: keyof PatientData; value: any } // Para manejo de archivos o valores nulos pasados directamente
    ) => {
      setUpdatedData((prevData) => {
        // ¡CORRECCIÓN AQUÍ! Si no hay datos previos, crea una nueva instancia de initialPatientData
        if (!prevData) return { ...initialPatientData };

        // Helper para actualizar objetos anidados de forma inmutable
        const updateNested = (obj: any, path: string[], val: any) => {
          const newObj = { ...obj };
          let current = newObj;
          for (let i = 0; i < path.length - 1; i++) {
            if (!current[path[i]]) {
              current[path[i]] = {};
            }
            current[path[i]] = { ...current[path[i]] }; // Clonar el objeto anidado para inmutabilidad
            current = current[path[i]];
          }
          current[path[path.length - 1]] = val;
          return newObj;
        };

        const target = "target" in e ? e.target : e; // El elemento que disparó el cambio o el objeto {name, value}
        const name = target.name as keyof PatientData;
        const value = "value" in target ? target.value : undefined;
        const type = "type" in target ? target.type : undefined;
        const files =
          target instanceof HTMLInputElement && target.type === "file"
            ? target.files
            : null;

        const path = name.split(".");

        // --- Manejo de Archivos ---
        if (type === "file" && files && files.length > 0) {
          return updateNested(prevData, path, files[0]); // Asigna el objeto File
        }
        // Lógica para marcar archivos como "borrados" (cuando se hace clic en "Eliminar" en el frontend)
        else if (
          !("target" in e) &&
          e.value === null &&
          ["document1", "document2", "document3"].includes(name)
        ) {
          return updateNested(prevData, path, null); // Establece el valor a null para indicar borrado
        }

        // --- Manejo de Selects (incluyendo "Otros" y "Sí/No") ---
        else if (type === "select") {
          const isOtherSelectedValue = value === "Otros";

          // Si el campo termina en '.selected' (SelectOptionWithSpecify)
          if (path.length > 1 && path[path.length - 1] === "selected") {
            const targetObjectPath = path.slice(0, path.length - 1);
            let currentNestedObject = targetObjectPath.reduce(
              (obj: any, key: string) => obj[key],
              prevData
            );

            currentNestedObject = { ...currentNestedObject, selected: value };

            if (!isOtherSelectedValue) {
              currentNestedObject.specify = undefined; // Limpia 'specify' si no es "Otros"
            }
            return updateNested(
              prevData,
              targetObjectPath,
              currentNestedObject
            );
          }
          // Si el campo termina en '.present' (MedicalConditionDetails) o es un booleano de hábito
          else if (
            path.length > 1 &&
            (path[path.length - 1] === "present" ||
              ["isSmoker", "usesDrugs", "consumesAlcohol"].includes(
                path[path.length - 1]
              ))
          ) {
            const sectionName = path[0];
            const fieldName = path[1];
            let updatedSection = { ...(prevData as any)[sectionName] };

            updatedSection[fieldName] = value;

            // Lógica de limpieza si el valor es 'No' o 'Seleccionar' (valor vacío)
            if (value === "No" || value === "") {
              if (sectionName === "smoking") {
                updatedSection.cigarettesPerDay = undefined;
              } else if (sectionName === "drugs") {
                updatedSection.type = undefined;
              } else if (sectionName === "alcohol") {
                updatedSection.quantity = undefined;
              } else if (sectionName === "currentMedicationUse") {
                updatedSection.specify = undefined;
              } else if (
                sectionName === "otherDiseasesNotMentioned" &&
                fieldName === "present"
              ) {
                updatedSection = {
                  present: "",
                  type: undefined,
                  medications: undefined,
                  dose: undefined,
                };
              } else {
                updatedSection = {
                  present: "",
                  type: undefined,
                  medications: undefined,
                  dose: undefined,
                };
              }
            }
            return updateNested(prevData, [sectionName], updatedSection);
          }
          // Lógica para campos 'select' de nivel superior (ej. 'physicalActivity' o 'gender')
          else {
            return updateNested(prevData, [name], value);
          }
        }
        // --- Manejo de Inputs de Texto, Número, Textarea ---
        else {
          const parsedValue =
            type === "number"
              ? value === ""
                ? undefined
                : Number(value)
              : value;

          // Esto cubre todos los campos 'specify' y los detalles de MedicalConditionDetails/Hábitos
          return updateNested(prevData, path, parsedValue);
        }
      });
    },
    []
  );

  // --- Definición de handleDeleteFile ---
  const handleDeleteFile = useCallback(
    (fieldName: keyof PatientData) => {
      handleChange({ name: fieldName, value: null });
    },
    [handleChange]
  );
  // --- FIN Definición de handleDeleteFile ---

  // Función para enviar los cambios del formulario
  const handleSubmitEdit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!updatedData || !id || !token) {
        toast.error("Falta información para actualizar el paciente.", {
          position: "top-right",
        });
        return;
      }

      const formData = mapPatientToFormData(updatedData);

      try {
        const data = await updatePatient(id, token, formData);
        setPatient(data);
        setUpdatedData(data);
        setIsEditing(false);
        toast.success("Ficha clínica actualizada con éxito", {
          position: "top-right",
        });
      } catch (error: any) {
        toast.error(
          error.message || "Error inesperado al actualizar la ficha clínica",
          {
            position: "top-right",
          }
        );
      }
    },
    [updatedData, id, token]
  );

  // Función para eliminar un paciente
  const handleDelete = useCallback(async () => {
    if (!id || !token) return;
    if (
      !window.confirm(
        "¿Estás seguro de eliminar esta ficha clínica? Esta acción es irreversible."
      )
    )
      return;
    try {
      await deletePatient(id, token);
      setIsDeleted(true);
      toast.success("Ficha clínica eliminada con éxito", {
        position: "top-right",
      });
    } catch (error: any) {
      toast.error(error.message || "Error al eliminar la ficha clínica", {
        position: "top-right",
      });
    }
  }, [id, token]);

  // Retorna el estado y las funciones del hook
  return {
    patient,
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
