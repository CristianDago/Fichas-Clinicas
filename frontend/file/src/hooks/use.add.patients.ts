import { useState, useCallback } from "react";
import {
  PatientData,
  MedicalConditionDetails,
  SelectOptionWithSpecify,
} from "../interface/patient/patient.interface";
import { addPatient } from "../utils/fetch.patient";

// ¡IMPORTANTE! Asegúrate de que estas inicializaciones coincidan
// EXACTAMENTE con la interfaz PatientData y las opciones de constants.ts
const initialMedicalCondition: MedicalConditionDetails = {
  present: "",
  type: "",
  medications: "",
  dose: "",
};
const initialSelectOptionWithSpecify: SelectOptionWithSpecify = {
  selected: "",
  specify: "",
};

const initialPatientData: PatientData = {
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
  currentMedicationUse: { present: "", specify: "" },
  otherDiseasesNotMentioned: { ...initialMedicalCondition },

  // --- Hábitos ---
  physicalActivity: "",
  smoking: { isSmoker: "", cigarettesPerDay: undefined },
  drugs: { usesDrugs: "", type: "" },
  alcohol: { consumesAlcohol: "", quantity: "" },

  // --- Antecedentes Quirúrgicos ---
  surgeryDetails: {
    type: { ...initialSelectOptionWithSpecify },
    anesthesiaType: { ...initialSelectOptionWithSpecify },
    adverseEffect: { ...initialSelectOptionWithSpecify },
  },

  // --- Procedimientos ---
  suggestedTreatmentBySurgeon: "",
  patientDecidedTreatment: "",

  // --- Documentación ---
  document1: null,
  document2: null,
  document3: null,
};

export const useAddPatient = (token: string | null) => {
  const [patientData, setPatientData] =
    useState<PatientData>(initialPatientData);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(0);

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const target = e.target;
      const { name, value, type } = target;

      // --- ¡AJUSTE CLAVE 1: Tipado de 'files' para aceptar 'null'! ---
      let files: FileList | null = null; // Ahora puede ser null

      if (target instanceof HTMLInputElement && target.type === "file") {
        files = target.files;
      }

      // --- ¡AJUSTE CLAVE 2: Mover 'updateNested' ANTES de su primer uso! ---
      const updateNested = (obj: any, path: string[], val: any) => {
        const newObj = { ...obj };
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
      // --- FIN AJUSTES CLAVE ---

      setPatientData((prevData) => {
        const newData = { ...prevData };

        // Manejo de Archivos
        if (type === "file" && files && files.length > 0) {
          return updateNested(newData, name.split("."), files[0]);
        }

        const path = name.split(".");

        // --- Manejo de Selects (Sí/No/Otros y Seleccionar) ---
        if (type === "select") {
          const isOtherSelectedValue = value === "Otros";

          if (path.length > 1 && path[path.length - 1] === "selected") {
            const targetObjectPath = path.slice(0, path.length - 1);
            let currentNestedObject = targetObjectPath.reduce(
              (obj: any, key: string) => obj[key],
              newData
            );

            currentNestedObject = { ...currentNestedObject, selected: value };

            if (!isOtherSelectedValue) {
              currentNestedObject.specify = "";
            }
            return updateNested(newData, targetObjectPath, currentNestedObject);
          } else {
            const [section, field] = path;
            let updatedSection = { ...(newData as any)[section] };

            updatedSection[field] = value;

            if (value === "No" || value === "") {
              if (section === "smoking") {
                updatedSection.cigarettesPerDay = undefined;
              } else if (section === "drugs") {
                updatedSection.type = "";
              } else if (section === "alcohol") {
                updatedSection.quantity = "";
              } else if (
                section === "currentMedicationUse" &&
                field === "present"
              ) {
                updatedSection.specify = "";
              } else if (
                section === "otherDiseasesNotMentioned" &&
                field === "present"
              ) {
                updatedSection = {
                  present: "",
                  type: "",
                  medications: "",
                  dose: "",
                };
              } else {
                updatedSection = {
                  present: "",
                  type: "",
                  medications: "",
                  dose: "",
                };
              }
            }
            return updateNested(newData, [section], updatedSection);
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

          if (path.length > 1) {
            return updateNested(newData, path, parsedValue);
          } else {
            return updateNested(newData, [name], parsedValue);
          }
        }
      });
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSuccessMessage(null);
      setErrorMessage(null);

      const formData = new FormData();

      for (const key in patientData) {
        const value = patientData[key as keyof typeof patientData];

        if (value instanceof File) {
          formData.append(key, value);
        } else if (
          value !== null &&
          typeof value === "object" &&
          !Array.isArray(value)
        ) {
          formData.append(key, JSON.stringify(value));
        } else if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      }

      try {
        const response = await addPatient(token!, formData);

        setSuccessMessage("Paciente guardado con éxito!");
        setPatientData(initialPatientData);
        setFormKey((prevKey) => prevKey + 1);

        console.log("Respuesta del backend:", response);
      } catch (error: any) {
        console.error("Error al enviar datos del paciente:", error);
        setErrorMessage(
          error.message || "Ocurrió un error inesperado al guardar el paciente."
        );
      }
    },
    [patientData, token]
  );

  return {
    successMessage,
    errorMessage,
    handleSubmit,
    patientData,
    handleChange,
    formKey,
  };
};
