import { useCallback } from "react";
import type { Student } from "../../../../interface/student/student";
import FormInput from "../form.input";
import css from "../../../../assets/styles/layout/student.profile.module.scss";
import { formatDateForInput } from "../../../../utils/date.formatters";
import { useDocumentHandling } from "../../../../hooks/use.document.handling";
import type { StudentFormProps } from "../../../../interface/common/forms/update.student.form.props";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FormSection } from "../form-section/form.section";

import {
  GENDER_OPTIONS,
  SOURCE_OPTIONS,
  SCHOOL_OPTIONS,
  COURSE_OPTIONS,
  allFeedbacks,
  CONTACT_PERSON_OPTIONS,
  COMMUNICATION_PREFERENCE_OPTIONS,
  CALL_STATUS_OPTIONS,
} from "../../../../utils/constants";

const StudentForm: React.FC<StudentFormProps> = ({
  student,
  onChange,
  onSubmit,
  onDeleteFile,
}) => {
  const { handleFileChange, handleDeleteFile: handleConfirmDeleteFile } =
    useDocumentHandling({ onChange, onDeleteFile });

  const renderDocumentInput = useCallback(
    (label: string, name: keyof Student) => {
      const value = student[name];
      const hasExistingFile = value && typeof value === "string";

      return (
        <div className={css.documentInputContainer}>
          <FormInput
            label={label}
            name={name}
            type="file"
            accept="image/*"
            // ¡MODIFICACIÓN CLAVE! Ahora handleFileChange acepta el tipo de evento más amplio
            // por lo que podemos pasarlo directamente.
            onChange={handleFileChange}
          />
          {hasExistingFile && (
            <p className={css.fileStatusText}>Archivo cargado.</p>
          )}
          {hasExistingFile && (
            <div className={css.documentActions}>
              <a
                href={value as string}
                target="_blank"
                rel="noopener noreferrer"
                className={css.viewDocument}
              >
                Ver actual
              </a>
              <button
                type="button"
                onClick={() => handleConfirmDeleteFile(name)}
                className={css.deleteDocument}
              >
                <FontAwesomeIcon icon={faTrash} /> Eliminar
              </button>
            </div>
          )}
        </div>
      );
    },
    [handleFileChange, handleConfirmDeleteFile, student, css]
  );

  return (
    <form onSubmit={onSubmit}>
      <FormSection
        title="Datos personales"
        gridClassName="grid-columns-3"
        sectionCssClass={css.datosPersonales}
      >
        <FormInput
          label="Nombres"
          name="name"
          type="text"
          value={student.name || ""}
          onChange={onChange}
          required
        />
        <FormInput
          label="Apellido"
          name="lastname"
          type="text"
          value={student.lastname || ""}
          onChange={onChange}
          required
        />
        <FormInput
          label="RUT"
          name="rut"
          type="text"
          value={student.rut || ""}
          onChange={onChange}
        />
        <FormInput
          label="Email"
          name="email"
          type="email"
          value={student.email || ""}
          onChange={onChange}
        />
        <FormInput
          label="Teléfono"
          name="phone"
          type="text"
          value={student.phone || ""}
          onChange={onChange}
        />
        <FormInput
          label="Fecha de Nacimiento"
          name="birthdate"
          type="date"
          value={formatDateForInput(student.birthdate)}
          onChange={onChange}
        />
        <FormInput
          label="Género"
          name="sex"
          type="select"
          value={student.sex || ""}
          onChange={onChange}
          options={GENDER_OPTIONS}
        />
        <FormInput
          label="Dirección"
          name="address"
          type="text"
          value={student.address || ""}
          onChange={onChange}
        />
        <FormInput
          label="Nacionalidad"
          name="nationality"
          type="text"
          value={student.nationality || ""}
          onChange={onChange}
        />
        <FormInput
          label="Fuente"
          name="source"
          type="select"
          value={student.source || ""}
          onChange={onChange}
          options={SOURCE_OPTIONS}
        />
        <FormInput
          label="Escuela"
          name="school"
          type="select"
          value={student.school || ""}
          onChange={onChange}
          options={SCHOOL_OPTIONS}
        />
        <FormInput
          label="Curso"
          name="course"
          type="select"
          value={student.course || ""}
          onChange={onChange}
          options={COURSE_OPTIONS}
        />
      </FormSection>

      <FormSection
        title="Contacto"
        gridClassName="grid-columns-2"
        sectionCssClass={css.datosComunicacion}
      >
        <FormInput
          label="Estado"
          name="positiveFeedback"
          type="select"
          value={student.positiveFeedback || ""}
          onChange={onChange}
          options={allFeedbacks}
        />
        <FormInput
          label="¿Quién realizó el contacto?"
          name="contact"
          type="select"
          value={student.contact || ""}
          onChange={onChange}
          options={CONTACT_PERSON_OPTIONS}
        />
        <FormInput
          label="Fecha de contacto"
          name="contactDate"
          type="date"
          value={formatDateForInput(student.contactDate)}
          onChange={onChange}
        />
        <FormInput
          label="Preferencia de Comunicación"
          name="communicationPreference"
          type="select"
          value={student.communicationPreference || ""}
          onChange={onChange}
          options={COMMUNICATION_PREFERENCE_OPTIONS}
        />
        <FormInput
          label="Llamada 1 - Completada"
          name="call1"
          type="select"
          value={student.call1 || ""}
          onChange={onChange}
          options={CALL_STATUS_OPTIONS}
        />
        <FormInput
          label="Comentario Llamada 1"
          name="comments1"
          type="text"
          value={student.comments1 || ""}
          onChange={onChange}
        />
        <FormInput
          label="Llamada 2 - Completada"
          name="call2"
          type="select"
          value={student.call2 || ""}
          onChange={onChange}
          options={CALL_STATUS_OPTIONS}
        />
        <FormInput
          label="Comentario Llamada 2"
          name="comments2"
          type="text"
          value={student.comments2 || ""}
          onChange={onChange}
        />
        <FormInput
          label="Llamada 3 - Completada"
          name="call3"
          type="select"
          value={student.call3 || ""}
          onChange={onChange}
          options={CALL_STATUS_OPTIONS}
        />
        <FormInput
          label="Comentario Llamada 3"
          name="comments3"
          type="text"
          value={student.comments3 || ""}
          onChange={onChange}
        />
      </FormSection>

      <FormSection
        title="Documentación"
        gridClassName="grid-columns-2"
        sectionCssClass={css.datosDocumentacion}
      >
        {renderDocumentInput("Foto del Estudiante", "studentImage")}
        {renderDocumentInput("Certificado de nacimiento", "birthCertificate")}
        {renderDocumentInput("Certificado de estudio", "studyCertificate")}
        {renderDocumentInput("Cédula de identidad", "linkDni")}
      </FormSection>

      <button type="submit">Actualizar estudiante</button>
    </form>
  );
};

export default StudentForm;
