import { useState, useCallback } from "react";
import {
  PatientData,
  MedicalConditionDetails,
  SelectOptionWithSpecify,
} from "../interface/patient/patient.interface";
import { addPatient } from "../utils/fetch.patient";

import { isValueTrulyEmpty } from "../utils/helpers"; // Esta ya está correcta
import { updateNested } from "../utils/form.utils"; // <-- Nueva importación

// Modificación: Las propiedades pueden ser `undefined` o `null` si no hay valor lógico.
const initialMedicalCondition: MedicalConditionDetails = {
  present: undefined,
  type: undefined,
  medications: undefined,
  dose: undefined,
};
const initialSelectOptionWithSpecify: SelectOptionWithSpecify = {
  selected: undefined,
  specify: undefined,
};

// Modificación: Usamos `undefined` o `null` para las propiedades que no tienen un valor inicial significativo.
const initialPatientData: PatientData = {
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
  howDidYouHear: { ...initialSelectOptionWithSpecify },
  gender: undefined,

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
  currentMedicationUse: { present: undefined, specify: undefined },
  otherDiseasesNotMentioned: { ...initialMedicalCondition },

  physicalActivity: undefined,
  smoking: { isSmoker: undefined, cigarettesPerDay: undefined },
  drugs: { usesDrugs: undefined, type: undefined },
  alcohol: { consumesAlcohol: undefined, quantity: undefined },

  surgeryDetails: {
    type: { ...initialSelectOptionWithSpecify },
    anesthesiaType: { ...initialSelectOptionWithSpecify },
    adverseEffect: { ...initialSelectOptionWithSpecify },
  },

  suggestedTreatmentBySurgeon: undefined,
  patientDecidedTreatment: undefined,

  document1: null,
  document2: null,
  document3: null,
  document1DriveId: null,
  document2DriveId: null,
  document3DriveId: null,
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

      let files: FileList | null = null;
      if (target instanceof HTMLInputElement && target.type === "file") {
        files = target.files;
      }

      // `updateNested` ha sido movido a `utils/form.utils.ts`
      // y se importa al principio del archivo.

      setPatientData((prevData) => {
        let updatedData = prevData;

        if (type === "file" && files && files.length > 0) {
          updatedData = updateNested(prevData, name.split("."), files[0]);
        } else {
          const path = name.split(".");
          const parsedValue =
            type === "number"
              ? value === ""
                ? undefined
                : Number(value)
              : value;

          if (path.length > 1 && path[path.length - 1] === "selected") {
            const targetObjectPath = path.slice(0, path.length - 1);
            let currentNestedObject = updateNested(
              prevData, targetObjectPath, (prevData as any)[targetObjectPath.join('.')] || {}
            );
            // Asegúrate de que currentNestedObject es un objeto antes de spread
            currentNestedObject = {
              ...(typeof currentNestedObject === 'object' && currentNestedObject !== null ? currentNestedObject : {}),
              selected: parsedValue,
            };

            if (parsedValue !== "Otros") {
              currentNestedObject.specify = undefined;
            }
            updatedData = updateNested(
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
            let updatedSection = updateNested(
                prevData, [sectionName], (prevData as any)[sectionName] || {}
            );
            // Asegúrate de que updatedSection es un objeto antes de asignar propiedades
            updatedSection = {
                ...(typeof updatedSection === 'object' && updatedSection !== null ? updatedSection : {}),
                [fieldName]: parsedValue
            };

            if (parsedValue === "No" || isValueTrulyEmpty(parsedValue)) {
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
                  present: undefined,
                  type: undefined,
                  medications: undefined,
                  dose: undefined,
                };
              } else {
                updatedSection = {
                  present: undefined,
                  type: undefined,
                  medications: undefined,
                  dose: undefined,
                };
              }
            }
            updatedData = updateNested(prevData, [sectionName], updatedSection);
          } else {
            updatedData = updateNested(prevData, path, parsedValue);
          }
        }
        return updatedData;
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

        return response;
      } catch (error: any) {
        console.error("Error al enviar datos del paciente:", error);
        setErrorMessage(
          error.message || "Ocurrió un error inesperado al guardar el paciente."
        );
        throw error;
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