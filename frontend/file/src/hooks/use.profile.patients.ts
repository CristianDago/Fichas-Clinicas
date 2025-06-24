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

// Modificación: Las propiedades pueden ser `undefined` o `null` si no hay valor lógico.
// Asegúrate que estas constantes se usen consistentemente en todo el proyecto.
const initialMedicalCondition: MedicalConditionDetails = {
  present: undefined, // Ahora permite undefined/null según la interfaz
  type: undefined,
  medications: undefined,
  dose: undefined,
};
const initialSelectOptionWithSpecify: SelectOptionWithSpecify = {
  selected: undefined, // Ahora permite undefined/null según la interfaz
  specify: undefined,
};

// Modificación: Usamos `undefined` o `null` para las propiedades que no tienen un valor inicial significativo.
const initialPatientData: PatientData = {
  id: undefined,
  createdAt: undefined,
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
  occupation: undefined,
  reasonForConsultation: undefined,
  howDidYouHear: { ...initialSelectOptionWithSpecify }, // Usamos la constante con undefined
  gender: undefined, // Si gender puede ser null/undefined en tu DB

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
  currentMedicationUse: { present: undefined, specify: undefined }, // También usa undefined
  otherDiseasesNotMentioned: { ...initialMedicalCondition },

  // --- Hábitos ---
  physicalActivity: undefined, // Si physicalActivity puede ser null/undefined en tu DB
  smoking: { isSmoker: undefined, cigarettesPerDay: undefined }, // Usa undefined
  drugs: { usesDrugs: undefined, type: undefined }, // Usa undefined
  alcohol: { consumesAlcohol: undefined, quantity: undefined }, // Usa undefined

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
  // Asegúrate de que estos campos existan en tu interfaz PatientData si son usados.
  document1DriveId: null,
  document2DriveId: null,
  document3DriveId: null,
};

export const usePatientProfile = (
  id: string | undefined,
  token: string | null | undefined
) => {
  const [patient, setPatient] = useState<PatientData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState<PatientData | null>(null);
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
        const fetchedData: PatientData = await fetchPatient(id, token);

        // --- ¡¡¡NORMALIZACIÓN DE DATOS AL CARGAR!!! ---
        // Combinamos valores por defecto con datos del backend para asegurar la estructura.
        const normalizedData: PatientData = {
          ...initialPatientData, // Base segura con todos los objetos JSON definidos
          ...fetchedData,       // Sobrescribe con los datos reales del backend
          id: fetchedData.id,
          createdAt: fetchedData.createdAt,

          // Normalización explícita para cada campo JSON completo.
          // Usamos `|| initialPatientData.campo` para que `null` o `undefined` se conviertan al objeto predefinido.
          howDidYouHear: fetchedData.howDidYouHear || initialPatientData.howDidYouHear,
          cardiovascular: fetchedData.cardiovascular || initialPatientData.cardiovascular,
          ophthalmological: fetchedData.ophthalmological || initialPatientData.ophthalmological,
          psychologicalPsychiatric: fetchedData.psychologicalPsychiatric || initialPatientData.psychologicalPsychiatric,
          diabetes: fetchedData.diabetes || initialPatientData.diabetes,
          hypertension: fetchedData.hypertension || initialPatientData.hypertension,
          allergies: fetchedData.allergies || initialPatientData.allergies,
          autoimmuneDiseases: fetchedData.autoimmuneDiseases || initialPatientData.autoimmuneDiseases,
          hematologicalDiseases: fetchedData.hematologicalDiseases || initialPatientData.hematologicalDiseases,
          respiratoryDiseases: fetchedData.respiratoryDiseases || initialPatientData.respiratoryDiseases,
          sleepApnea: fetchedData.sleepApnea || initialPatientData.sleepApnea,
          eatingDisorder: fetchedData.eatingDisorder || initialPatientData.eatingDisorder,
          currentMedicationUse: fetchedData.currentMedicationUse || initialPatientData.currentMedicationUse,
          otherDiseasesNotMentioned: fetchedData.otherDiseasesNotMentioned || initialPatientData.otherDiseasesNotMentioned,
          smoking: fetchedData.smoking || initialPatientData.smoking,
          drugs: fetchedData.drugs || initialPatientData.drugs,
          alcohol: fetchedData.alcohol || initialPatientData.alcohol,

          // Manejo especial para `surgeryDetails` por sus sub-objetos anidados.
          surgeryDetails: {
            type: fetchedData.surgeryDetails?.type || initialPatientData.surgeryDetails.type,
            anesthesiaType: fetchedData.surgeryDetails?.anesthesiaType || initialPatientData.surgeryDetails.anesthesiaType,
            adverseEffect: fetchedData.surgeryDetails?.adverseEffect || initialPatientData.surgeryDetails.adverseEffect,
          },
          // Normalización para los Drive IDs si existen en tu interfaz y son parte del fetch.
          document1DriveId: fetchedData.document1DriveId ?? null,
          document2DriveId: fetchedData.document2DriveId ?? null,
          document3DriveId: fetchedData.document3DriveId ?? null,
        };

        setPatient(normalizedData);
        setUpdatedData(normalizedData);
      } catch (err: any) {
        if (
          err.message &&
          (err.message.includes("no se encontraron datos") ||
            err.message.includes("404") ||
            err.message.includes("not found") ||
            err.message.includes("ID de paciente no es válido"))
        ) {
          setIsNotFound(true);
          setError(null);
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

  const handleEdit = useCallback(() => {
    setIsEditing(true);
    // Aseguramos que `updatedData` siempre sea un objeto PatientData válido al entrar en edición.
    setUpdatedData(patient || initialPatientData);
  }, [patient]);


  const handleChange = useCallback(
    (
      e:
        | React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
          >
        | { name: keyof PatientData; value: any }
    ) => {
      setUpdatedData((prevData) => {
        if (!prevData) return { ...initialPatientData };

        const updateNested = (obj: any, path: string[], val: any) => {
          const newObj = JSON.parse(JSON.stringify(obj));
          let current = newObj;
          for (let i = 0; i < path.length - 1; i++) {
            if (!current[path[i]]) {
              current[path[i]] = {};
            }
            current[path[i]] = { ...current[path[i]] };
            current = current[path[i]];
          }
          current[path[path.length - 1]] = val;
          return newObj;
        };

        const target = "target" in e ? e.target : e;
        const name = target.name as keyof PatientData;
        const value = "value" in target ? target.value : undefined;
        const type = "type" in target ? target.type : undefined;
        const files =
          target instanceof HTMLInputElement && target.type === "file"
            ? target.files
            : null;

        const path = name.split(".");

        if (type === "file" && files && files.length > 0) {
          return updateNested(prevData, path, files[0]);
        } else if (
          !("target" in e) &&
          e.value === null &&
          ["document1", "document2", "document3"].includes(name as string)
        ) {
          return updateNested(prevData, path, null);
        } else if (type === "select") {
          const isOtherSelectedValue = value === "Otros";

          if (path.length > 1 && path[path.length - 1] === "selected") {
            const targetObjectPath = path.slice(0, path.length - 1);
            let currentNestedObject = targetObjectPath.reduce(
              (obj: any, key: string) => obj[key],
              prevData
            );

            currentNestedObject = { ...currentNestedObject, selected: value };

            if (!isOtherSelectedValue) {
              currentNestedObject.specify = undefined;
            }
            return updateNested(
              prevData,
              targetObjectPath,
              currentNestedObject
            );
          } else if (
            path.length > 1 &&
            (path[path.length - 1] === "present" ||
              ["isSmoker", "usesDrugs", "consumesAlcohol"].includes(
                path[path.length - 1] as string
              ))
          ) {
            const sectionName = path[0];
            const fieldName = path[1];
            let updatedSection = { ...(prevData as any)[sectionName] };

            updatedSection[fieldName] = value;

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
                  present: undefined, // Ahora se usa undefined
                  type: undefined,
                  medications: undefined,
                  dose: undefined,
                };
              } else {
                updatedSection = {
                  present: undefined, // Ahora se usa undefined
                  type: undefined,
                  medications: undefined,
                  dose: undefined,
                };
              }
            }
            return updateNested(prevData, [sectionName], updatedSection);
          } else {
            return updateNested(prevData, [name], value);
          }
        } else {
          const parsedValue =
            type === "number"
              ? value === ""
                ? undefined
                : Number(value)
              : value;

          return updateNested(prevData, path, parsedValue);
        }
      });
    },
    []
  );

  const handleDeleteFile = useCallback(
    (fieldName: keyof PatientData) => {
      handleChange({ name: fieldName, value: null });
    },
    [handleChange]
  );

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
        // *** IMPORTANTE: Normalizar también los datos devueltos por la actualización ***
        const normalizedUpdatedData: PatientData = {
            ...initialPatientData,
            ...data,
            id: data.id,
            createdAt: data.createdAt,
            howDidYouHear: data.howDidYouHear || initialPatientData.howDidYouHear,
            cardiovascular: data.cardiovascular || initialPatientData.cardiovascular,
            ophthalmological: data.ophthalmological || initialPatientData.ophthalmological,
            psychologicalPsychiatric: data.psychologicalPsychiatric || initialPatientData.psychologicalPsychiatric,
            diabetes: data.diabetes || initialPatientData.diabetes,
            hypertension: data.hypertension || initialPatientData.hypertension,
            allergies: data.allergies || initialPatientData.allergies,
            autoimmuneDiseases: data.autoimmuneDiseases || initialPatientData.autoimmuneDiseases,
            hematologicalDiseases: data.hematologicalDiseases || initialPatientData.hematologicalDiseases,
            respiratoryDiseases: data.respiratoryDiseases || initialPatientData.respiratoryDiseases,
            sleepApnea: data.sleepApnea || initialPatientData.sleepApnea,
            eatingDisorder: data.eatingDisorder || initialPatientData.eatingDisorder,
            currentMedicationUse: data.currentMedicationUse || initialPatientData.currentMedicationUse,
            otherDiseasesNotMentioned: data.otherDiseasesNotMentioned || initialPatientData.otherDiseasesNotMentioned,
            smoking: data.smoking || initialPatientData.smoking,
            drugs: data.drugs || initialPatientData.drugs,
            alcohol: data.alcohol || initialPatientData.alcohol,
            surgeryDetails: {
                type: data.surgeryDetails?.type || initialPatientData.surgeryDetails.type,
                anesthesiaType: data.surgeryDetails?.anesthesiaType || initialPatientData.surgeryDetails.anesthesiaType,
                adverseEffect: data.surgeryDetails?.adverseEffect || initialPatientData.surgeryDetails.adverseEffect,
            },
            // Repetimos la lógica de normalización para los Drive IDs si están en tu interfaz/modelo
            document1DriveId: (data as any).document1DriveId ?? null,
            document2DriveId: (data as any).document2DriveId ?? null,
            document3DriveId: (data as any).document3DriveId ?? null,
        };
        setPatient(normalizedUpdatedData);
        setUpdatedData(normalizedUpdatedData);
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
    [updatedData, id, token, initialPatientData]
  );

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