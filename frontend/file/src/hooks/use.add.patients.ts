import { useState, useCallback } from "react";
import {
  PatientData,
  MedicalConditionDetails,
  SelectOptionWithSpecify,
} from "../interface/patient/patient.interface"; 

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
  email: "",
  phone: "",
  age: undefined,
  weight: undefined,
  height: undefined,
  imc: undefined,
  children: undefined,
  occupation: "",
  reasonForConsultation: "",
  howDidYouHear: { ...initialSelectOptionWithSpecify },
  // --- Antecedentes Médicos ---
  cardiovascular: { ...initialMedicalCondition, present: "" },
  ophthalmological: { ...initialMedicalCondition, present: "" },
  psychologicalPsychiatric: { ...initialMedicalCondition, present: "" },
  diabetes: { ...initialMedicalCondition, present: "" },
  hypertension: { ...initialMedicalCondition, present: "" },
  allergies: { ...initialSelectOptionWithSpecify }, 
  autoimmuneDiseases: { ...initialMedicalCondition, present: "" },
  hematologicalDiseases: { ...initialMedicalCondition, present: "" },
  respiratoryDiseases: { ...initialMedicalCondition, present: "" },
  sleepApnea: { ...initialMedicalCondition, present: "" },
  eatingDisorder: { ...initialMedicalCondition, present: "" },
  currentMedicationUse: { present: "", specify: "" },
  otherDiseasesNotMentioned: { ...initialMedicalCondition, present: "" },
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
      const { name, value, type, files } = e.target as HTMLInputElement;

      setPatientData((prevData) => {
        const newData = { ...prevData };

        if (type === "file" && files) {
          (newData as any)[name] = files[0];
          return newData;
        }

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

        const path = name.split(".");

        if (type === "select") {
          const isOtherSelectedValue = value === "Otros";

          // Manejo general de selects con opción "Otros" que usan SelectOptionWithSpecify
          // Esto cubre howDidYouHear, allergies, surgeryDetails.type, surgeryDetails.anesthesiaType, surgeryDetails.adverseEffect
          if (path.length > 1 && path[path.length - 1] === "selected") {
            // Si el campo termina en '.selected'
            const targetSection = newData as any;
            const targetField = path
              .slice(0, path.length - 1)
              .reduce((obj, key) => obj[key], targetSection);

            targetField.selected = value; // Actualiza el valor seleccionado
            if (!isOtherSelectedValue) {
              // Si NO es 'Otros', limpiar el campo 'specify'
              targetField.specify = "";
            }
            return updateNested(
              newData,
              path.slice(0, path.length - 1),
              targetField
            ); // Actualizar el objeto padre
          } else {
            // Para MedicalConditionDetails (ej. cardiovascular.present) O hábitos (ej. smoking.isSmoker)
            const [section, field] = path;
            let updatedSection = { ...(newData as any)[section] };

            updatedSection[field] = value;

            if (value === "No" || value === "") {
              // Limpieza general si es 'No' o 'Seleccionar'
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
        } else {
          // Manejo de otros tipos de input (text, number, textarea, file)
          const parsedValue =
            type === "number"
              ? value === ""
                ? undefined
                : Number(value)
              : value;

          // Manejo de campos 'specify', 'type', 'medications', 'dose' anidados
          if (path.length > 1) {
            // Esto cubre howDidYouHear.specify, allergies.specify, surgeryDetails.X.specify,
            // otherDiseasesNotMentioned.type/medications/dose
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

      console.log("Datos del paciente a enviar:", patientData);

      try {
        setSuccessMessage("Paciente guardado con éxito!");
        setPatientData(initialPatientData);
        setFormKey((prevKey) => prevKey + 1);
      } catch (error: any) {
        setErrorMessage(error.message || "Ocurrió un error inesperado.");
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
