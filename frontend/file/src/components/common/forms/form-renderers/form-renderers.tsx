import React from "react";
import FormInput from "../form.input";
import formCss from "../../../../assets/styles/layout/add.patient.form.module.scss";
import {
  PatientData,
  MedicalConditionDetails,
  SelectOptionWithSpecify,
} from "../../../../interface/patient/patient.interface";
import { YES_NO_OPTIONS } from "../../../../utils/constants";

const isValueEmpty = (val: any): boolean => {
  return (
    val === null ||
    val === undefined ||
    (typeof val === "string" && val.trim() === "") ||
    (typeof val === "number" && isNaN(val))
  );
};

export const renderHowDidYouHearSelect = (
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void,
  label: string,
  // MODIFICACIÓN: Añade un valor por defecto para 'data'
  data: SelectOptionWithSpecify = { selected: "", specify: undefined },
  options: { value: string; label: string }[]
) => (
  <div className={formCss.formGroup}>
    <FormInput
      label={`${label}:`}
      name="howDidYouHear.selected"
      type="select"
      value={data.selected || ""}
      onChange={handleChange}
      options={options}
    />
    {(data.selected?.toUpperCase() === "OTROS" || // Acceso seguro
      !isValueEmpty(data.specify)) && ( // Acceso seguro
      <div className={formCss.conditionalDetailsBox}>
        <FormInput
          label="Especificar Otros"
          name="howDidYouHear.specify"
          type="text"
          value={data.specify || ""}
          onChange={handleChange}
        />
      </div>
    )}
  </div>
);

export const renderMedicalConditionSection = (
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void,
  fieldName: keyof PatientData,
  label: string,
  // MODIFICACIÓN: Añade un valor por defecto para 'data'
  data: MedicalConditionDetails = {
    present: "",
    type: undefined,
    medications: undefined,
    dose: undefined,
  }
) => {
  const handlePresentChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const selected = e.target.value.toUpperCase();
    handleChange(e); // sigue llamando al onChange original

    if (selected === "NO") {
      const clearFields = ["type", "medications", "dose"];
      clearFields.forEach((field) => {
        const fakeEvent = {
          target: {
            name: `${fieldName}.${field}`,
            value: "",
          },
        } as React.ChangeEvent<HTMLInputElement>;
        handleChange(fakeEvent);
      });
    }
  };

  // Acceso seguro: data.present ahora siempre es un string vacío o el valor real
  const shouldShowDetails =
    data.present?.toUpperCase() === "SÍ" ||
    !isValueEmpty(data.type) ||
    !isValueEmpty(data.medications) ||
    !isValueEmpty(data.dose);

  return (
    <div className={formCss.medicalConditionGroup}>
      <FormInput
        label={`${label}:`}
        name={`${fieldName}.present`}
        type="select"
        value={data.present || ""}
        onChange={handlePresentChange}
        options={YES_NO_OPTIONS}
      />

      {shouldShowDetails && (
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
};

export const renderSelectWithSpecify = (
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void,
  label: string,
  // MODIFICACIÓN: Añade un valor por defecto para 'data'
  data: SelectOptionWithSpecify = { selected: "", specify: undefined },
  options: { value: string; label: string }[],
  fullFieldName: string
) => {
  // Ahora, data.selected está garantizado como un string vacío o el valor real
  const normalizedSelected = data.selected ? data.selected.toUpperCase() : "";
  const matchedOption = options.find(
    (opt) => opt.value.toUpperCase() === normalizedSelected
  );
  const selectValue = matchedOption ? matchedOption.value : "";

  const handleSelectChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const selected = e.target.value.toUpperCase();

    const normalizedEvent = {
      target: {
        name: `${fullFieldName}.selected`,
        value: selected,
      },
    } as React.ChangeEvent<HTMLInputElement>;

    handleChange(normalizedEvent);

    // Si no es OTROS, limpiar el campo "specify"
    if (selected !== "OTROS") {
      const clearSpecifyEvent = {
        target: {
          name: `${fullFieldName}.specify`,
          value: "",
        },
      } as React.ChangeEvent<HTMLInputElement>;

      handleChange(clearSpecifyEvent);
    }
  };

  // Mostrar specify solo si la opción es OTROS y tiene valor, sino vacío
  // data.specify ahora es seguro
  const specifyValueToShow =
    normalizedSelected === "OTROS" ? data.specify || "" : "";

  return (
    <div className={formCss.formGroup}>
      <FormInput
        label={`${label}:`}
        name={`${fullFieldName}.selected`}
        type="select"
        value={selectValue}
        onChange={handleSelectChange}
        options={options}
      />
      {(normalizedSelected === "OTROS" ||
        !isValueEmpty(specifyValueToShow)) && (
        <div className={formCss.conditionalDetailsBox}>
          <FormInput
            label="Especificar Otros"
            name={`${fullFieldName}.specify`}
            type="text"
            value={specifyValueToShow}
            onChange={handleChange}
          />
        </div>
      )}
    </div>
  );
};

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
  // Aseguramos que los objetos de hábito existan antes de acceder a sus propiedades
  // Esto es crucial para renderHabitInput ya que recibe patientData directamente
  const safePatientData = {
    ...patientData,
    smoking: patientData.smoking || { isSmoker: "", cigarettesPerDay: undefined },
    drugs: patientData.drugs || { usesDrugs: "", type: undefined },
    alcohol: patientData.alcohol || { consumesAlcohol: "", quantity: undefined },
  };

  let isYes = false;
  let specifyValue: any;
  let specifyName = "";

  if (habitField === "smoking") {
    isYes = safePatientData.smoking.isSmoker?.toUpperCase() === "SÍ";
    specifyValue = safePatientData.smoking.cigarettesPerDay;
    specifyName = "smoking.cigarettesPerDay";
  } else if (habitField === "drugs") {
    isYes = safePatientData.drugs.usesDrugs?.toUpperCase() === "SÍ";
    specifyValue = safePatientData.drugs.type;
    specifyName = "drugs.type";
  } else if (habitField === "alcohol") {
    isYes = safePatientData.alcohol.consumesAlcohol?.toUpperCase() === "SÍ";
    specifyValue = safePatientData.alcohol.quantity;
    specifyName = "alcohol.quantity";
  }

  const hasDetail = !isValueEmpty(specifyValue);

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
        // Acceso seguro a las propiedades del hábito
        value={
          (safePatientData as any)[habitField][
            habitField === "smoking"
              ? "isSmoker"
              : habitField === "drugs"
              ? "usesDrugs"
              : "consumesAlcohol"
          ] || ""
        }
        onChange={(e) => {
          const selected = e.target.value.toUpperCase();
          handleChange(e);

          if (selected === "NO") {
            const fakeEvent = {
              target: {
                name:
                  habitField === "smoking"
                    ? "smoking.cigarettesPerDay"
                    : habitField === "drugs"
                    ? "drugs.type"
                    : "alcohol.quantity",
                value: "",
              },
            } as React.ChangeEvent<HTMLInputElement>;

            handleChange(fakeEvent);
          }
        }}
        options={YES_NO_OPTIONS}
      />

      {(isYes || hasDetail) && (
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