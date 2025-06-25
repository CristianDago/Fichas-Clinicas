import { useState, useCallback } from "react";
import { addPatient } from "../../utils/api/fetch.patient";
import { initialPatientData } from "../../constants/patient/patient.initial.state";
import { mapPatientToFormData } from "../../utils/form/patient.form.mapper";
import { updateNested } from "../../utils/form/form.utils";
import { isValueTrulyEmpty } from "../../utils/helpers/general.helpers";
import type { PatientData } from "../../interface/patient/patient.interface";

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
      const path = name.split(".");

      let files: FileList | null = null;
      if (target instanceof HTMLInputElement && target.type === "file") {
        files = target.files;
      }

      const parsedValue =
        type === "number" && value === ""
          ? undefined
          : type === "number"
          ? Number(value)
          : value;

      setPatientData((prevData) => {
        const sectionName = path.length > 1 ? path[0] : null;
        const field = path.length > 1 ? path[1] : undefined;

        if (type === "file" && files && files.length > 0) {
          return updateNested(prevData, path, files[0]);
        }

        if (
          sectionName &&
          typeof field === "string" &&
          [
            "selected",
            "present",
            "isSmoker",
            "usesDrugs",
            "consumesAlcohol",
          ].includes(field)
        ) {
          const currentSection = { ...((prevData as any)[sectionName] ?? {}) };
          currentSection[field] = parsedValue;

          if (field === "selected" && parsedValue !== "Otros") {
            currentSection.specify = "";
          }

          if (
            (field === "present" ||
              ["isSmoker", "usesDrugs", "consumesAlcohol"].includes(field)) &&
            (parsedValue === "NO" || isValueTrulyEmpty(parsedValue))
          ) {
            if (sectionName === "smoking")
              currentSection.cigarettesPerDay = null;
            if (sectionName === "drugs") currentSection.type = "";
            if (sectionName === "alcohol") currentSection.quantity = "";
            if (sectionName === "currentMedicationUse")
              currentSection.specify = "";
            if (
              [
                "cardiovascular",
                "ophthalmological",
                "psychologicalPsychiatric",
                "diabetes",
                "hypertension",
                "autoimmuneDiseases",
                "hematologicalDiseases",
                "respiratoryDiseases",
                "sleepApnea",
                "eatingDisorder",
                "otherDiseasesNotMentioned",
              ].includes(sectionName)
            ) {
              currentSection.type = "";
              currentSection.medications = "";
              currentSection.dose = "";
            }
          }

          return updateNested(prevData, [sectionName], currentSection);
        }

        return updateNested(prevData, path, parsedValue);
      });
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSuccessMessage(null);
      setErrorMessage(null);

      const formData = mapPatientToFormData(patientData);

      try {
        const response = await addPatient(token!, formData);
        setSuccessMessage("Paciente guardado con éxito.");
        setPatientData(initialPatientData);
        setFormKey((prev) => prev + 1);
        return response;
      } catch (error: any) {
        console.error("Error al enviar paciente:", error);
        setErrorMessage(
          error.message || "Error inesperado al guardar el paciente."
        );
        throw error;
      }
    },
    [patientData, token]
  );

  return {
    patientData,
    successMessage,
    errorMessage,
    formKey,
    handleChange,
    handleSubmit,
  };
};
