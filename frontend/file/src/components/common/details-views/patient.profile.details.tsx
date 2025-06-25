import { Grid } from "../grid/grid";
import css from "../../../assets/styles/layout/patient.profile.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PatientDetailsProps } from "../../../interface/common/forms/form.render.props"; // Asegúrate de que esta ruta sea correcta
import {
  faCircleUser,
  faFile,
  faMobile,
  faEnvelope,
  faCalendarAlt,
  faIdCard,
  faWeightHanging,
  faArrowsUpDown,
  faUser,
  faBriefcase,
  faQuestionCircle,
  faChild,
  faHeartPulse,
  faEye,
  faBrain,
  faHouseMedical,
  faAllergies,
  faLungs,
  faBed,
  faBowlFood,
  faPills,
  faSyringe,
  faBone,
  faNotesMedical,
  faRunning,
  faSmoking,
  faCapsules,
  faWineGlass,
  faCut,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";

// Importa todas las interfaces relevantes desde tu archivo principal de interfaces
import {
  PatientData,
} from "../../../interface/patient/patient.interface.props"; // <-- Importación clave

import ProfileField from "../profile-field/profile.field";
import MedicalConditionDisplay from "./medical.condition.display";
import SelectWithSpecifyDisplay from "./select.with.specify.display";
import HabitDisplay from "./habit.display";

// Asegúrate de que `isValueTrulyEmpty` esté importada o definida si la usas localmente aquí.
// Idealmente, deberías importarla desde `utils/helpers.ts` como hicimos antes.
const isValueTrulyEmpty = (val: any): boolean => {
  return (
    val === null ||
    val === undefined ||
    (typeof val === "string" && val.trim() === "") ||
    (typeof val === "number" && isNaN(val))
  );
};


const PatientDetails: React.FC<PatientDetailsProps> = ({
  patient,
  onEdit,
  onDelete,
}) => {
  const getSimpleValue = (value: any): string => {
    return isValueTrulyEmpty(value) ? "NO REGISTRADO" : String(value);
  };

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

  // --- ¡SOLUCIÓN CLAVE AQUÍ: Asigna explícitamente el tipo PatientData! ---
  // Esto le dice a TypeScript que `patientSafe` debe tener la estructura de `PatientData`.
  const patientSafe: PatientData = {
    ...patient, // Propaga todas las propiedades del paciente.

    // Sobrescribe/asegura la estructura de las propiedades JSON anidadas.
    // Usamos `patient.prop || valorPorDefecto` para asegurar que siempre sea un objeto válido,
    // y `undefined` para los valores internos si no hay dato.
    howDidYouHear: patient.howDidYouHear || {
      selected: undefined,
      specify: undefined,
    },

    cardiovascular: patient.cardiovascular || {
      present: undefined,
      type: undefined,
      medications: undefined,
      dose: undefined,
    },
    ophthalmological: patient.ophthalmological || {
      present: undefined,
      type: undefined,
      medications: undefined,
      dose: undefined,
    },
    psychologicalPsychiatric: patient.psychologicalPsychiatric || {
      present: undefined,
      type: undefined,
      medications: undefined,
      dose: undefined,
    },
    diabetes: patient.diabetes || {
      present: undefined,
      type: undefined,
      medications: undefined,
      dose: undefined,
    },
    hypertension: patient.hypertension || {
      present: undefined,
      type: undefined,
      medications: undefined,
      dose: undefined,
    },
    allergies: patient.allergies || { selected: undefined, specify: undefined },
    autoimmuneDiseases: patient.autoimmuneDiseases || {
      present: undefined,
      type: undefined,
      medications: undefined,
      dose: undefined,
    },
    hematologicalDiseases: patient.hematologicalDiseases || {
      present: undefined,
      type: undefined,
      medications: undefined,
      dose: undefined,
    },
    respiratoryDiseases: patient.respiratoryDiseases || {
      present: undefined,
      type: undefined,
      medications: undefined,
      dose: undefined,
    },
    sleepApnea: patient.sleepApnea || {
      present: undefined,
      type: undefined,
      medications: undefined,
      dose: undefined,
    },
    eatingDisorder: patient.eatingDisorder || {
      present: undefined,
      type: undefined,
      medications: undefined,
      dose: undefined,
    },
    currentMedicationUse: patient.currentMedicationUse || {
      present: undefined,
      specify: undefined,
    },
    otherDiseasesNotMentioned: patient.otherDiseasesNotMentioned || {
      present: undefined,
      type: undefined,
      medications: undefined,
      dose: undefined,
    },

    smoking: patient.smoking || { isSmoker: undefined, cigarettesPerDay: undefined },
    drugs: patient.drugs || { usesDrugs: undefined, type: undefined },
    alcohol: patient.alcohol || { consumesAlcohol: undefined, quantity: undefined },

    // Para `surgeryDetails`, asumimos que `patient.surgeryDetails` ya es un objeto (gracias a la normalización en `usePatientProfile`).
    // Aquí solo aseguramos que sus propiedades internas sean objetos válidos.
    surgeryDetails: {
      type: patient.surgeryDetails.type || { selected: undefined, specify: undefined },
      anesthesiaType: patient.surgeryDetails.anesthesiaType || { selected: undefined, specify: undefined },
      adverseEffect: patient.surgeryDetails.adverseEffect || { selected: undefined, specify: undefined },
    },
    
    // Usamos `??` (Nullish Coalescing Operator) para mantener `null` si viene del backend,
    // o para usar `undefined` si no viene nada.
    suggestedTreatmentBySurgeon: patient.suggestedTreatmentBySurgeon ?? undefined,
    patientDecidedTreatment: patient.patientDecidedTreatment ?? undefined,
    
    // Documentación y Drive IDs (usamos `?? null` para mantener `null` si viene así)
    document1: patient.document1 ?? null,
    document2: patient.document2 ?? null,
    document3: patient.document3 ?? null,
    document1DriveId: patient.document1DriveId ?? null,
    document2DriveId: patient.document2DriveId ?? null,
    document3DriveId: patient.document3DriveId ?? null,

    // Asegura que estas propiedades que no inicializas explícitamente se copien de `patient`.
    // Si PatientData requiere id y createdAt (no opcionales), deberías proveerlos.
    id: patient.id,
    createdAt: patient.createdAt,
    // Otras propiedades de PatientData que no tienen lógica de sobrescritura JSON
    gender: patient.gender ?? undefined,
    rut: patient.rut ?? undefined,
    age: patient.age ?? undefined,
    weight: patient.weight ?? undefined,
    height: patient.height ?? undefined,
    imc: patient.imc ?? undefined,
    email: patient.email ?? undefined,
    phone: patient.phone ?? undefined,
    children: patient.children ?? undefined,
    occupation: patient.occupation ?? undefined,
    reasonForConsultation: patient.reasonForConsultation ?? undefined,
    physicalActivity: patient.physicalActivity ?? undefined,

  };

  return (
    <>
      <Grid className={`grid-columns-2 ${css.mainInformation}`}>
        <div>
          <FontAwesomeIcon icon={faCircleUser} className={css.iconUser} />
        </div>

        <div>
          <h1 className={`name`}>{`${patientSafe.name || "NO REGISTRADO"} ${
            patientSafe.lastname || "NO REGISTRADO"
          }`}</h1>

          <ul className={css.profile}>
            <ProfileField
              icon={faEnvelope}
              label="Email"
              value={patientSafe.email}
            />
            <ProfileField
              icon={faMobile}
              label="Teléfono"
              value={patientSafe.phone}
            />
            <ProfileField
              icon={faCalendarAlt}
              label="Fecha de Creación"
              value={
                patientSafe.createdAt === undefined
                  ? "Cargando..."
                  : patientSafe.createdAt
                  ? new Date(patientSafe.createdAt).toLocaleDateString()
                  : "NO REGISTRADA"
              }
            />
          </ul>
          <Grid className="grid-columns-2">
            <button onClick={onEdit}>Editar</button>
            <button onClick={onDelete}>Eliminar</button>
          </Grid>
        </div>
      </Grid>

      {/* --- Datos Personales Completos --- */}
      <Grid className={`grid-columns-2 ${css.personalData}`}>
        <div>
          <h2>Datos Personales</h2>
          <ul>
            <ProfileField icon={faIdCard} label="RUT" value={patientSafe.rut} />
            <ProfileField
              icon={faCalendarAlt}
              label="Edad"
              value={patientSafe.age}
            />
            <ProfileField
              icon={faWeightHanging}
              label="Peso (kg)"
              value={patientSafe.weight}
            />
            <ProfileField
              icon={faArrowsUpDown}
              label="Estatura (cm)"
              value={patientSafe.height}
            />
            <ProfileField icon={faBone} label="IMC" value={patientSafe.imc} />
            <ProfileField
              icon={faUser}
              label="Género"
              value={patientSafe.gender}
            />
            <ProfileField
              icon={faChild}
              label="Hijos"
              value={patientSafe.children}
            />
            <ProfileField
              icon={faBriefcase}
              label="Ocupación"
              value={patientSafe.occupation}
            />
            <ProfileField
              icon={faNotesMedical}
              label="Motivo de Consulta"
              value={patientSafe.reasonForConsultation}
            />
            <SelectWithSpecifyDisplay
              icon={faQuestionCircle}
              label="¿Cómo Llegó a Nosotros?"
              data={patientSafe.howDidYouHear}
            />
          </ul>
        </div>

        {/* --- Antecedentes Médicos --- */}
        <div>
          <h2>Antecedentes Médicos</h2>
          <ul>
            <MedicalConditionDisplay
              icon={faHeartPulse}
              label="Cardiovascular"
              data={patientSafe.cardiovascular}
            />
            <MedicalConditionDisplay
              icon={faEye}
              label="Oftalmológica"
              data={patientSafe.ophthalmological}
            />
            <MedicalConditionDisplay
              icon={faBrain}
              label="Psicológica/Psiquiátrica"
              data={patientSafe.psychologicalPsychiatric}
            />
            <MedicalConditionDisplay
              icon={faSyringe}
              label="Diabetes"
              data={patientSafe.diabetes}
            />
            <MedicalConditionDisplay
              icon={faHouseMedical}
              label="Hipertensión"
              data={patientSafe.hypertension}
            />
            <SelectWithSpecifyDisplay
              icon={faAllergies}
              label="Alergias"
              data={patientSafe.allergies}
            />
            <MedicalConditionDisplay
              icon={faHouseMedical}
              label="Enfermedades Autoinmunes"
              data={patientSafe.autoimmuneDiseases}
            />
            <MedicalConditionDisplay
              icon={faPills}
              label="Enfermedades Hematológicas"
              data={patientSafe.hematologicalDiseases}
            />
            <MedicalConditionDisplay
              icon={faLungs}
              label="Enfermedades Respiratorias"
              data={patientSafe.respiratoryDiseases}
            />
            <MedicalConditionDisplay
              icon={faBed}
              label="Apnea del Sueño"
              data={patientSafe.sleepApnea}
            />
            <MedicalConditionDisplay
              icon={faBowlFood}
              label="Trastorno Alimenticio"
              data={patientSafe.eatingDisorder}
            />
            <MedicalConditionDisplay
              icon={faSyringe}
              label="Uso de Otros Medicamentos"
              data={patientSafe.currentMedicationUse}
            />
            <MedicalConditionDisplay
              icon={faNotesMedical}
              label="Otra Enfermedad No Mencionada"
              data={patientSafe.otherDiseasesNotMentioned}
            />
          </ul>
        </div>
      </Grid>

      {/* --- Hábitos --- */}
      <Grid className={`grid-columns-2 ${css.datosHabitos}`}>
        <div>
          <h2>Hábitos</h2>
          <ul>
            <ProfileField
              icon={faRunning}
              label="Actividad Física"
              value={getSimpleValue(patientSafe.physicalActivity)}
            />
            <HabitDisplay
              icon={faSmoking}
              label="Fumador"
              data={patientSafe.smoking}
              habitType="smoking"
            />
            <HabitDisplay
              icon={faCapsules}
              label="Drogas"
              data={patientSafe.drugs}
              habitType="drugs"
            />
            <HabitDisplay
              icon={faWineGlass}
              label="Alcohol"
              data={patientSafe.alcohol}
              habitType="alcohol"
            />
          </ul>
        </div>
        {/* --- Antecedentes Quirúrgicos --- */}
        <div>
          <h2>Antecedentes Quirúrgicos</h2>
          <ul>
            <SelectWithSpecifyDisplay
              icon={faCut}
              label="Tipo de Cirugía"
              data={patientSafe.surgeryDetails.type}
            />
            <SelectWithSpecifyDisplay
              icon={faSyringe}
              label="Tipo de Anestesia"
              data={patientSafe.surgeryDetails.anesthesiaType}
            />
            <SelectWithSpecifyDisplay
              icon={faExclamationTriangle}
              label="Efecto Adverso"
              data={patientSafe.surgeryDetails.adverseEffect}
            />
          </ul>
        </div>
      </Grid>

      {/* --- Procedimientos --- */}
      <Grid className={`grid-columns-1 ${css.personalData}`}>
        <div>
          <h2>Procedimientos</h2>
          <ul>
            <li className={css.twoLineItem}>
              <div className={css.firstLine}>
                <FontAwesomeIcon
                  icon={faNotesMedical}
                  className={css.profileIcon}
                />
                <strong>Sugerido por Cirujano:</strong>
              </div>
              <div className={css.detailsLine}>
                {getSimpleValue(patientSafe.suggestedTreatmentBySurgeon)}
              </div>
            </li>
            <li className={css.twoLineItem}>
              <div className={css.firstLine}>
                <FontAwesomeIcon icon={faUser} className={css.profileIcon} />
                <strong>Decide Realizarse:</strong>
              </div>
              <div className={css.detailsLine}>
                {getSimpleValue(patientSafe.patientDecidedTreatment)}
              </div>
            </li>
          </ul>
        </div>
      </Grid>

      {/* --- Documentos --- */}
      <Grid className={`grid-columns-1 ${css.personalData}`}>
        <div>
          <h2>Documentos</h2>
          <Grid className="grid-columns-3">
            {getDocumentButton("Documento 1", patientSafe.document1)}
            {getDocumentButton("Documento 2", patientSafe.document2)}
            {getDocumentButton("Documento 3", patientSafe.document3)}
          </Grid>
        </div>
      </Grid>
    </>
  );
};

export default PatientDetails;