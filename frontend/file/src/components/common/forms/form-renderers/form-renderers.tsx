import React from "react";
import FormInput from "../form.input";
import formCss from "../../../../assets/styles/layout/add.patient.form.module.scss";
import {
  PatientData,
  MedicalConditionDetails,
  SelectOptionWithSpecify,
} from "../../../../interface/patient/patient.interface";
import { YES_NO_OPTIONS } from "../../../../utils/constants";

/* ---- Antecedentes Médicos (Si / No)---- */
export const renderMedicalConditionSection = (
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void,
  fieldName: keyof PatientData,
  label: string,
  data: MedicalConditionDetails
) => (
  <div className={formCss.medicalConditionGroup}>
    <FormInput
      label={`${label}:`}
      name={`${fieldName}.present`}
      type="select"
      value={data.present || ""}
      onChange={handleChange}
      options={YES_NO_OPTIONS}
    />
    {data.present === "Sí" && (
      <div className={formCss.conditionalDetailsBox}>
        <FormInput
          label="Tipo"
          name={`${fieldName}.type`}
          type="text"
          value={data.type || ""}
          onChange={handleChange}
        />
        <FormInput
          label="Medicamentos"
          name={`${fieldName}.medications`}
          type="text"
          value={data.medications || ""}
          onChange={handleChange}
        />
        <FormInput
          label="Dosis"
          name={`${fieldName}.dose`}
          type="text"
          value={data.dose || ""}
          onChange={handleChange}
        />
      </div>
    )}
  </div>
);

/* ---- Especificar Otros ---- */
export const renderSelectWithSpecify = (
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void,
  label: string,
  data: SelectOptionWithSpecify,
  options: { value: string; label: string }[],
  fullFieldName: string
) => (
  <div className={formCss.formGroup}>
    <FormInput
      label={`${label}:`}
      name={`${fullFieldName}.selected`}
      type="select"
      value={data.selected || ""}
      onChange={handleChange}
      options={options}
    />
    {data.selected === "Otros" && (
      <div className={formCss.conditionalDetailsBox}>
        <FormInput
          label="Especificar Otros"
          name={`${fullFieldName}.specify`}
          type="text"
          value={data.specify || ""}
          onChange={handleChange}
        />
      </div>
    )}
  </div>
);

/* ---- Hábitos (Campos especiales) ---- */
export const renderHabitInput = (
  patientData: PatientData,
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void,
  habitField: "smoking" | "drugs" | "alcohol",
  label: string,
  specificLabel?: string,
  specificType?: "text" | "number"
) => {
  let isYes: boolean = false;
  let specifyValue: string | number | undefined = undefined;
  let specifyName: string = "";

  if (habitField === "smoking") {
    isYes = patientData.smoking.isSmoker === "Sí";
    specifyValue = patientData.smoking.cigarettesPerDay;
    specifyName = "smoking.cigarettesPerDay";
  } else if (habitField === "drugs") {
    isYes = patientData.drugs.usesDrugs === "Sí";
    specifyValue = patientData.drugs.type;
    specifyName = "drugs.type";
  } else if (habitField === "alcohol") {
    isYes = patientData.alcohol.consumesAlcohol === "Sí";
    specifyValue = patientData.alcohol.quantity;
    specifyName = "alcohol.quantity";
  }

  return (
    <div className={formCss.formGroup}>
      <FormInput
        label={label}
        name={`${habitField}.${
          habitField === "smoking"
            ? "isSmoker"
            : habitField === "drugs"
            ? "usesDrugs"
            : "consumesAlcohol"
        }`}
        type="select"
        value={
          (patientData as any)[habitField][
            habitField === "smoking"
              ? "isSmoker"
              : habitField === "drugs"
              ? "usesDrugs"
              : "consumesAlcohol"
          ] || ""
        }
        onChange={handleChange}
        options={YES_NO_OPTIONS}
      />
      {isYes && (
        <div className={formCss.conditionalDetailsBox}>
          <FormInput
            label={specificLabel || "Especificar"}
            name={specifyName}
            type={specificType || "text"}
            value={specifyValue || ""}
            onChange={handleChange}
          />
        </div>
      )}
    </div>
  );
};
