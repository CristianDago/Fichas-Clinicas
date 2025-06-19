import { Student } from "../../../interface/student/student";
import { Grid } from "../grid/grid";
import css from "../../../assets/styles/layout/student.profile.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleUser,
  faIdCard,
  faBirthdayCake,
  faVenusMars,
  faMapMarkerAlt,
  faFlag,
  faSchool,
  faChalkboardTeacher,
  faBook,
  faCheckCircle,
  faUser,
  faCalendarAlt,
  faComment,
  faMobile,
  faEnvelope,
  faFile,
} from "@fortawesome/free-solid-svg-icons";

import ProfileField from "../profile-field/profile.field";

interface StudentDetailsProps {
  student: Student;
  onEdit: () => void;
  onDelete: () => void;
}

const StudentDetails = ({ student, onEdit, onDelete }: StudentDetailsProps) => {
  const getDocumentButton = (label: string, link?: string | File | null) => {
    const href = typeof link === "string" ? link : undefined;

    if (href) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer">
          <button>{label}</button>
        </a>
      );
    } else {
      return (
        <button disabled className={css.disabledButton}>
          <FontAwesomeIcon icon={faFile} /> {label}
        </button>
      );
    }
  };

  return (
    <>
      <Grid className={`grid-columns-2 ${css.mainInformation}`}>
        <div>
          <FontAwesomeIcon icon={faCircleUser} className={css.iconUser} />
        </div>

        <div>
          <h1>{`${student.name || "NO REGISTRADO"} ${
            student.lastname || "NO REGISTRADO"
          }`}</h1>

          <ul className={css.profile}>
            <ProfileField
              icon={faEnvelope}
              label="Email"
              value={student.email}
            />
            <ProfileField
              icon={faMobile}
              label="Teléfono"
              value={student.phone}
            />
          </ul>
          <Grid className="grid-columns-2">
            <button onClick={onEdit}>Editar</button>
            <button onClick={onDelete}>Eliminar</button>
          </Grid>
        </div>
      </Grid>

      <Grid className={`grid-columns-2 ${css.personalData}`}>
        <div>
          <h2>Datos Personales</h2>
          <ul>
            <ProfileField icon={faIdCard} label="Rut" value={student.rut} />
            <ProfileField
              icon={faBirthdayCake}
              label="Fecha de Nacimiento"
              value={
                student.birthdate
                  ? new Date(student.birthdate).toLocaleDateString()
                  : "NO REGISTRADA"
              }
            />
            <ProfileField
              icon={faVenusMars}
              label="Género"
              value={student.sex}
            />
            <ProfileField
              icon={faMapMarkerAlt}
              label="Dirección"
              value={student.address}
            />
            <ProfileField
              icon={faFlag}
              label="Nacionalidad"
              value={student.nationality}
            />
            <ProfileField
              icon={faSchool}
              label="Colegio"
              value={student.school}
            />
            <ProfileField
              icon={faChalkboardTeacher}
              label="Curso"
              value={student.course}
            />
          </ul>
        </div>

        <div>
          <h2>Datos de Contacto</h2>
          <ul>
            <ProfileField icon={faBook} label="Fuente" value={student.source} />
            <ProfileField
              icon={faCheckCircle}
              label="Estado"
              value={student.positiveFeedback}
            />
            <ProfileField
              icon={faUser}
              label="¿Quién realizó el contacto?"
              value={student.contact}
            />
            <ProfileField
              icon={faCalendarAlt}
              label="Fecha de contacto"
              value={
                student.contactDate
                  ? new Date(student.contactDate).toLocaleDateString()
                  : "NO REGISTRADA"
              }
            />
            <ProfileField
              icon={faComment}
              label="Preferencia de Comunicación"
              value={student.communicationPreference}
            />
          </ul>
        </div>
      </Grid>

      <Grid className={`grid-columns-2 ${css.personalData}`}>
        <div>
          <h2>Datos llamadas</h2>
        </div>
        <div></div>

        <div>
          <h3>Llamada 01</h3>
          <ul>
            <ProfileField
              icon={faMobile}
              label="¿Contestó la llamada?"
              value={student.call1}
            />
          </ul>
          <ul className={css.comments}>
            <ProfileField
              icon={faComment}
              label="Comentario 01"
              value={student.comments1}
            />
          </ul>
        </div>

        <div>
          <h3>Llamada 02</h3>
          <ul>
            <ProfileField
              icon={faMobile}
              label="¿Contestó la llamada?"
              value={student.call2}
            />
          </ul>
          <ul className={css.comments}>
            <ProfileField
              icon={faComment}
              label="Comentario 01"
              value={student.comments2}
            />
          </ul>
        </div>

        <div>
          <h3>Llamada 03</h3>
          <ul>
            <ProfileField
              icon={faMobile}
              label="¿Contestó la llamada?"
              value={student.call3}
            />
          </ul>
          <ul className={css.comments}>
            <ProfileField
              icon={faComment}
              label="Comentario 01"
              value={student.comments3}
            />
          </ul>
        </div>
      </Grid>

      <div className={`grid-columns-3 ${css.personalData}`}>
        <div>
          <h2>Documentos</h2>
          <Grid className="grid-columns-2">
            {getDocumentButton("Foto del Estudiante", student.studentImage)}
            {getDocumentButton(
              "Certificado de nacimiento",
              student.birthCertificate
            )}
            {getDocumentButton(
              "Certificado de estudio",
              student.studyCertificate
            )}
            {getDocumentButton("Cédula de identidad", student.linkDni)}
          </Grid>
        </div>
      </div>
      <div>
        <div>
          <ul>
            <ProfileField
              icon={faCalendarAlt}
              label="Fecha de Creación"
              value={
                student.createdAt
                  ? new Date(student.createdAt).toLocaleDateString()
                  : "NO REGISTRADA"
              }
            />
          </ul>
        </div>
      </div>
    </>
  );
};

export default StudentDetails;
