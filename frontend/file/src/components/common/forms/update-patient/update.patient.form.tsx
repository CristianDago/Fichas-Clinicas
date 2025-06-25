// src/components/common/forms/update.patient.form.tsx

import React from "react";
import FormInput from "../form.input";
import { FormSection } from "../form-section/form.section";
// Asegúrate de que PatientData se importe correctamente desde patient.interface.ts
import { PatientData } from "../../../../interface/patient/patient.interface.props"; 
import formCss from "../../../../assets/styles/layout/add.patient.form.module.scss";
import { useDocumentHandling } from "../../../../hooks/files/use.document.handling";

import {
  YES_NO_OPTIONS,
  ALLERGY_OPTIONS,
  SURGERY_TYPE_OPTIONS,
  ANESTHESIA_TYPE_OPTIONS,
  ADVERSE_EFFECT_OPTIONS,
  HOW_DID_YOU_HEAR,
  GENDER_OPTIONS,
} from "../../../../utils/constants/select.options";

import {
  renderMedicalConditionSection,
  renderSelectWithSpecify,
  renderHabitInput,
} from "../form-renderers/form.renderers";

interface UpdatePatientFormProps {
  patient: PatientData;
  onChange: (
    e:
      | React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
      | { name: keyof PatientData; value: any }
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  onDeleteFile: (fieldName: keyof PatientData) => void; // Esta prop es pasada a useDocumentHandling
}

const UpdatePatientForm: React.FC<UpdatePatientFormProps> = ({
  patient,
  onChange,
  onSubmit,
}) => {
  // useDocumentHandling ya recibe `onChange`, y `handleDeleteFile` lo usa.
  // La prop `onDeleteFile` de UpdatePatientFormProps es un poco redundante si useDocumentHandling ya la provee.
  // Pero si la necesitas para un `onClick` directo en el padre, está bien.
  const { handleFileChange, handleDeleteFile } =
    useDocumentHandling<PatientData>({ onChange });

  const renderDocumentButtons = (
    _label: string, // El `_` indica que `label` es un parámetro que no se usa en esta función.
    fieldName: keyof PatientData
  ) => {
    const fileValue = patient[fieldName];

    if (typeof fileValue === "string" && fileValue.startsWith("http")) {
      return (
        <div className={formCss.documentActions}>
          <a
            href={fileValue}
            target="_blank"
            rel="noopener noreferrer"
            className={formCss.viewDocument}
          >
            Ver Documento
          </a>
          <button
            type="button"
            onClick={() => handleDeleteFile(fieldName)} // Usa handleDeleteFile del hook
            className={formCss.deleteDocument}
          >
            Eliminar
          </button>
        </div>
      );
    } else if (fileValue instanceof File) {
      return (
        <div className={formCss.documentActions}>
          <span className={formCss.fileStatusText}>
            Archivo seleccionado: {fileValue.name}
          </span>
          <button
            type="button"
            onClick={() => handleDeleteFile(fieldName)} // Usa handleDeleteFile del hook
            className={formCss.deleteDocument}
          >
            Cambiar
          </button>
        </div>
      );
    } else {
      return (
        <FormInput
          label="" // No necesita label aquí, ya que el label principal del documento está arriba
          name={fieldName as string}
          type="file"
          accept="image/*, application/pdf"
          onChange={
            handleFileChange as React.ChangeEventHandler<
              HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
            >
          }
        />
      );
    }
  };

  // ASEGURAMOS QUE surgeryDetails exista antes de acceder a sus subpropiedades.
  // Confiamos en que la `patient` prop (que viene de `usePatientProfile`) ya viene normalizada
  // con `surgeryDetails` como un objeto. Esta línea es más una salvaguarda.
  const safeSurgeryDetails = patient.surgeryDetails || {
    type: { selected: undefined, specify: undefined }, // Usar `undefined` para consistencia
    anesthesiaType: { selected: undefined, specify: undefined },
    adverseEffect: { selected: undefined, specify: undefined },
  };

  return (
    <form onSubmit={onSubmit} className={formCss.patientForm}>
      <h1 className={formCss.name}>Editar Ficha Clínica</h1>
      {/* --- Datos personales --- */}
      <FormSection title="Datos personales" gridClassName="grid-columns-4">
        <FormInput
          label="Nombres"
          name="name"
          type="text"
          value={patient.name || ""} // Mantener || "" para strings en inputs
          onChange={onChange}
          required
        />
        <FormInput
          label="Apellidos"
          name="lastname"
          type="text"
          value={patient.lastname || ""}
          onChange={onChange}
          required
        />
        <FormInput
          label="RUT (sin puntos ni guión)"
          name="rut"
          type="text"
          value={patient.rut || ""}
          onChange={onChange}
        />
        <FormInput
          label="Edad"
          name="age"
          type="number"
          value={patient.age ?? ""} // Usar ?? "" para números
          onChange={onChange}
        />
        <FormInput
          label="Peso (kg)"
          name="weight"
          type="number"
          value={patient.weight ?? ""}
          onChange={onChange}
        />
        <FormInput
          label="Estatura (cm)"
          name="height"
          type="number"
          value={patient.height ?? ""}
          onChange={onChange}
        />
        <FormInput
          label="IMC"
          name="imc"
          type="number"
          value={patient.imc ?? ""}
          onChange={onChange}
        />
        <FormInput
          label="Correo electrónico"
          name="email"
          type="email"
          value={patient.email || ""}
          onChange={onChange}
        />
        <FormInput
          label="Teléfono"
          name="phone"
          type="tel"
          value={patient.phone || ""}
          onChange={onChange}
        />
        <FormInput
          label="Hijos"
          name="children"
          type="number"
          value={patient.children ?? ""}
          onChange={onChange}
          min={0}
        />
        <FormInput
          label="Ocupación"
          name="occupation"
          type="text"
          value={patient.occupation || ""}
          onChange={onChange}
        />
        <FormInput
          label="Motivo de consulta"
          name="reasonForConsultation"
          type="text"
          value={patient.reasonForConsultation || ""}
          onChange={onChange}
        />
        <FormInput
          label="Género:"
          name="gender"
          type="select"
          value={patient.gender || ""}
          onChange={onChange}
          options={GENDER_OPTIONS}
        />
        {renderSelectWithSpecify(
          onChange,
          "¿Cómo llegaste a nosotros?",
          patient.howDidYouHear,
          HOW_DID_YOU_HEAR,
          "howDidYouHear"
        )}
      </FormSection>

      {/* --- Antecedentes Médicos --- */}
      <FormSection title="Antecedentes Médicos" gridClassName="grid-columns-3">
        {renderMedicalConditionSection(
          onChange,
          "cardiovascular",
          "Cardio Vascular",
          patient.cardiovascular
        )}
        {renderMedicalConditionSection(
          onChange,
          "ophthalmological",
          "Oftalmológica",
          patient.ophthalmological
        )}
        {renderMedicalConditionSection(
          onChange,
          "psychologicalPsychiatric",
          "Psicológica/Psiquiátrica",
          patient.psychologicalPsychiatric
        )}
        {renderMedicalConditionSection(
          onChange,
          "diabetes",
          "Diabetes",
          patient.diabetes
        )}
        {renderMedicalConditionSection(
          onChange,
          "hypertension",
          "Hipertensión",
          patient.hypertension
        )}
        {renderSelectWithSpecify(
          onChange,
          "Alergias",
          patient.allergies,
          ALLERGY_OPTIONS,
          "allergies"
        )}
        {renderMedicalConditionSection(
          onChange,
          "autoimmuneDiseases",
          "Enfermedades Autoinmunes",
          patient.autoimmuneDiseases
        )}
        {renderMedicalConditionSection(
          onChange,
          "hematologicalDiseases",
          "Enfermedades Hematológicas",
          patient.hematologicalDiseases
        )}
        {renderMedicalConditionSection(
          onChange,
          "respiratoryDiseases",
          "Enfermedades Respiratorias",
          patient.respiratoryDiseases
        )}
        {renderMedicalConditionSection(
          onChange,
          "sleepApnea",
          "Apnea del Sueño",
          patient.sleepApnea
        )}
        {renderMedicalConditionSection(
          onChange,
          "eatingDisorder",
          "Trastorno Alimenticio",
          patient.eatingDisorder
        )}
        {renderMedicalConditionSection(
          onChange,
          "currentMedicationUse",
          "Uso de otros medicamentos",
          patient.currentMedicationUse
        )}
        {renderMedicalConditionSection(
          onChange,
          "otherDiseasesNotMentioned",
          "Otra enfermedad no mencionada",
          patient.otherDiseasesNotMentioned
        )}
      </FormSection>
      {/* --- Hábitos --- */}
      <FormSection title="Hábitos" gridClassName="grid-columns-2">
        <FormInput
          label="Realiza actividad física:"
          name="physicalActivity"
          type="select"
          value={patient.physicalActivity || ""}
          onChange={onChange}
          options={YES_NO_OPTIONS}
        />
        {renderHabitInput(
          patient,
          onChange,
          "smoking",
          "Fumador:",
          "¿Cuántos al día?",
          "number"
        )}
        {renderHabitInput(patient, onChange, "drugs", "Drogas:", "Tipo")}
        {renderHabitInput(
          patient,
          onChange,
          "alcohol",
          "Alcohol:",
          "Frecuencia"
        )}
      </FormSection>

      {/* --- Antecedentes Quirúrgicos --- */}
      <FormSection
        title="Antecedentes Quirúrgicos"
        gridClassName="grid-columns-1"
      >
        {renderSelectWithSpecify(
          onChange,
          "Cirugía",
          safeSurgeryDetails.type,
          SURGERY_TYPE_OPTIONS,
          "surgeryDetails.type"
        )}
        {renderSelectWithSpecify(
          onChange,
          "Tipo de anestesia",
          safeSurgeryDetails.anesthesiaType,
          ANESTHESIA_TYPE_OPTIONS,
          "surgeryDetails.anesthesiaType"
        )}
        {renderSelectWithSpecify(
          onChange,
          "¿Presentó algún efecto adverso?",
          safeSurgeryDetails.adverseEffect,
          ADVERSE_EFFECT_OPTIONS,
          "surgeryDetails.adverseEffect"
        )}
      </FormSection>
      {/* --- Procedimientos --- */}
      <FormSection title="Procedimientos" gridClassName="grid-columns-1">
        <FormInput
          label="Tratamiento quirúrgico sugerido por el Cirujano plástico:"
          name="suggestedTreatmentBySurgeon"
          type="textarea"
          value={patient.suggestedTreatmentBySurgeon || ""}
          onChange={onChange}
        />
        <FormInput
          label="Tratamiento quirúrgico que decide realizarse el/la paciente:"
          name="patientDecidedTreatment"
          type="textarea"
          value={patient.patientDecidedTreatment || ""}
          onChange={onChange}
        />
      </FormSection>

      {/* --- Documentación (Archivos) --- */}
      <FormSection title="Documentación" gridClassName="grid-columns-3">
        {/* Documento 1 */}
        <div className={formCss.formGroup}>
          <label>Documento 1:</label>
          {renderDocumentButtons("Documento 1", "document1")}
        </div>
        {/* Documento 2 */}
        <div className={formCss.formGroup}>
          <label>Documento 2:</label>
          {renderDocumentButtons("Documento 2", "document2")}
        </div>
        {/* Documento 3 */}
        <div className={formCss.formGroup}>
          <label>Documento 3:</label>
          {renderDocumentButtons("Documento 3", "document3")}
        </div>
      </FormSection>

      <button type="submit">Actualizar Ficha Clínica</button>
    </form>
  );
};

export default UpdatePatientForm;