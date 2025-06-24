// components/forms/add.patient.form/add.patient.form.tsx

import React from "react";
import FormInput from "../form.input";
import { FormSection } from "../form-section/form.section";
import { AddPatientFormProps } from "../../../../interface/common/forms/add.patient.form.props";
import formCss from "../../../../assets/styles/layout/add.patient.form.module.scss";
import { useDocumentHandling } from "../../../../hooks/use.document.handling";

import {
  YES_NO_OPTIONS,
  ALLERGY_OPTIONS,
  SURGERY_TYPE_OPTIONS,
  ANESTHESIA_TYPE_OPTIONS,
  ADVERSE_EFFECT_OPTIONS,
  HOW_DID_YOU_HEAR,
  GENDER_OPTIONS,
} from "../../../../utils/constants";
import {
  renderMedicalConditionSection,
  renderSelectWithSpecify,
  renderHabitInput,
} from "../form-renderers/form-renderers";

export const AddPatientForm: React.FC<AddPatientFormProps> = ({
  patientData,
  handleChange,
  handleSubmit,
}) => {
  const { handleFileChange } = useDocumentHandling({
    onChange: ({ name, value }) =>
      handleChange({ target: { name, value } } as any),
  });

  // Aseguramos que surgeryDetails exista antes de acceder a sus subpropiedades.
  // Esto es una buena práctica de seguridad a nivel de componente.
  const safeSurgeryDetails = patientData.surgeryDetails || {
    type: { selected: undefined, specify: undefined }, // Usar `undefined` para que sea consistente con la interfaz y helpers
    anesthesiaType: { selected: undefined, specify: undefined },
    adverseEffect: { selected: undefined, specify: undefined },
  };


  return (
    <form onSubmit={handleSubmit} className={formCss.patientForm}>
      {/* ---- Datos personales ---- */}
      <FormSection title="Datos personales" gridClassName="grid-columns-4">
        <FormInput
          label="Nombres"
          name="name"
          type="text"
          value={patientData.name || ""}
          onChange={handleChange}
          required
        />
        <FormInput
          label="Apellidos"
          name="lastname"
          type="text"
          value={patientData.lastname || ""}
          onChange={handleChange}
          required
        />
        <FormInput
          label="RUT (sin puntos ni guión)"
          name="rut"
          type="text"
          value={patientData.rut || ""}
          onChange={handleChange}
        />
        <FormInput
          label="Edad"
          name="age"
          type="number"
          value={patientData.age ?? ""}
          onChange={handleChange}
        />
        <FormInput
          label="Género:"
          name="gender"
          type="select"
          value={patientData.gender || ""}
          onChange={handleChange}
          options={GENDER_OPTIONS}
        />
        <FormInput
          label="Peso (kg)"
          name="weight"
          type="number"
          value={patientData.weight ?? ""}
          onChange={handleChange}
        />
        <FormInput
          label="Estatura"
          name="height"
          type="number"
          value={patientData.height ?? ""}
          onChange={handleChange}
        />
        <FormInput
          label="IMC"
          name="imc"
          type="number"
          value={patientData.imc ?? ""}
          onChange={handleChange}
        />
        <FormInput
          label="Correo electrónico"
          name="email"
          type="email"
          value={patientData.email || ""}
          onChange={handleChange}
        />
        <FormInput
          label="Teléfono"
          name="phone"
          type="tel"
          value={patientData.phone || ""}
          onChange={handleChange}
        />
        <FormInput
          label="Hijos"
          name="children"
          type="number"
          value={patientData.children ?? ""}
          onChange={handleChange}
          min={0}
        />
        <FormInput
          label="Ocupación"
          name="occupation"
          type="text"
          value={patientData.occupation || ""}
          onChange={handleChange}
        />
        <FormInput
          label="Motivo de consulta"
          name="reasonForConsultation"
          type="text"
          value={patientData.reasonForConsultation || ""}
          onChange={handleChange}
        />
        {renderSelectWithSpecify(
          handleChange,
          "¿Cómo llegaste a nosotros?",
          patientData.howDidYouHear,
          HOW_DID_YOU_HEAR,
          "howDidYouHear"
        )}
      </FormSection>

      {/* ---- Antecedentes Médicos ---- */}
      <FormSection title="Antecedentes Médicos" gridClassName="grid-columns-3">
        {renderMedicalConditionSection(
          handleChange,
          "cardiovascular",
          "Cardiovascular",
          patientData.cardiovascular
        )}
        {renderMedicalConditionSection(
          handleChange,
          "ophthalmological",
          "Oftalmológica",
          patientData.ophthalmological
        )}
        {renderMedicalConditionSection(
          handleChange,
          "psychologicalPsychiatric",
          "Psicológica/Psiquiátrica",
          patientData.psychologicalPsychiatric
        )}
        {renderMedicalConditionSection(
          handleChange,
          "diabetes",
          "Diabetes",
          patientData.diabetes
        )}
        {renderMedicalConditionSection(
          handleChange,
          "hypertension",
          "Hipertensión",
          patientData.hypertension
        )}
        {renderSelectWithSpecify(
          handleChange,
          "Alergias",
          patientData.allergies,
          ALLERGY_OPTIONS,
          "allergies"
        )}
        {renderMedicalConditionSection(
          handleChange,
          "autoimmuneDiseases",
          "Enfermedades Autoinmunes",
          patientData.autoimmuneDiseases
        )}
        {renderMedicalConditionSection(
          handleChange,
          "hematologicalDiseases",
          "Enfermedades Hematológicas",
          patientData.hematologicalDiseases
        )}
        {renderMedicalConditionSection(
          handleChange,
          "respiratoryDiseases",
          "Enfermedades Respiratorias",
          patientData.respiratoryDiseases
        )}
        {renderMedicalConditionSection(
          handleChange,
          "sleepApnea",
          "Apnea del Sueño",
          patientData.sleepApnea
        )}
        {renderMedicalConditionSection(
          handleChange,
          "eatingDisorder",
          "Trastorno Alimenticio",
          patientData.eatingDisorder
        )}
        {renderMedicalConditionSection(
          handleChange,
          "currentMedicationUse",
          "Uso de otros medicamentos",
          patientData.currentMedicationUse
        )}
        {renderMedicalConditionSection(
          handleChange,
          "otherDiseasesNotMentioned",
          "Otra enfermedad no mencionada",
          patientData.otherDiseasesNotMentioned
        )}
      </FormSection>

      {/* ---- Hábitos ---- */}
      <FormSection title="Hábitos" gridClassName="grid-columns-2">
        <FormInput
          label="Realiza actividad física:"
          name="physicalActivity"
          type="select"
          value={patientData.physicalActivity || ""}
          onChange={handleChange}
          options={YES_NO_OPTIONS}
        />
        {renderHabitInput(
          patientData,
          handleChange,
          "smoking",
          "Fumador:",
          "¿Cuántos al día?",
          "number"
        )}
        {renderHabitInput(
          patientData,
          handleChange,
          "drugs",
          "Drogas:",
          "Tipo"
        )}
        {renderHabitInput(
          patientData,
          handleChange,
          "alcohol",
          "Alcohol:",
          "Frecuencia"
        )}
      </FormSection>

      {/* ---- Antecedentes Quirúrgicos ---- */}
      <FormSection
        title="Antecedentes Quirúrgicos"
        gridClassName="grid-columns-1"
      >
        {renderSelectWithSpecify(
          handleChange,
          "Cirugía",
          safeSurgeryDetails.type,
          SURGERY_TYPE_OPTIONS,
          "surgeryDetails.type"
        )}
        {renderSelectWithSpecify(
          handleChange,
          "Tipo de anestesia",
          safeSurgeryDetails.anesthesiaType,
          ANESTHESIA_TYPE_OPTIONS,
          "surgeryDetails.anesthesiaType"
        )}
        {renderSelectWithSpecify(
          handleChange,
          "¿Presentó algún efecto adverso?",
          safeSurgeryDetails.adverseEffect,
          ADVERSE_EFFECT_OPTIONS,
          "surgeryDetails.adverseEffect"
        )}
      </FormSection>

      {/* Procedimientos */}
      <FormSection title="Procedimientos" gridClassName="grid-columns-1">
        <FormInput
          label="Tratamiento quirúrgico sugerido por el Cirujano plástico:"
          name="suggestedTreatmentBySurgeon"
          type="textarea"
          value={patientData.suggestedTreatmentBySurgeon || ""}
          onChange={handleChange}
        />
        <FormInput
          label="Tratamiento quirúrgico que decide realizarse el/la paciente:"
          name="patientDecidedTreatment"
          type="textarea"
          value={patientData.patientDecidedTreatment || ""}
          onChange={handleChange}
        />
      </FormSection>

      {/* Sección de Documentación */}
      <FormSection title="Documentación" gridClassName="grid-columns-3">
        <FormInput
          label="Documento 1"
          name="document1"
          type="file"
          accept="image/*, application/pdf"
          onChange={handleFileChange}
        />
        <FormInput
          label="Documento 2"
          name="document2"
          type="file"
          accept="image/*, application/pdf"
          onChange={handleFileChange}
        />
        <FormInput
          label="Documento 3"
          name="document3"
          type="file"
          accept="image/*, application/pdf"
          onChange={handleFileChange}
        />
      </FormSection>

      <button type="submit">Agregar Paciente</button>
    </form>
  );
};