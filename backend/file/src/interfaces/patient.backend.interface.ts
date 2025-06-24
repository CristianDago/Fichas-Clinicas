// backend/src/interfaces/patient.backend.interface.ts

// NOTA: Estas interfaces reflejan los datos TAL CUAL los manejará el backend (ej. JSONB para objetos)
// Asegúrate de que los tipos coincidan con los de tu modelo de Sequelize (Profile).

// Interfaz para detalles de condiciones médicas en el backend
export interface MedicalConditionDetailsBackend {
  present: 'SÍ' | 'NO' | '';
  type?: string;
  medications?: string;
  dose?: string;
}

// Interfaz para selects con opción "Otros" en el backend (esta es la genérica ahora)
export interface SelectOptionWithSpecifyBackend {
  selected: string; // El valor seleccionado, ej. "Otros", "Latex", "GENERAL"
  specify?: string; // El detalle adicional si 'Otros' fue seleccionado
}

// Interfaz principal para el modelo Profile en el backend
export interface PatientBackend {
  // Campos de Sequelize: 'id' es manejado por la DB, 'createdAt' también
  id: string; // Sequelize lo genera
  createdAt?: Date; // Sequelize lo maneja

  // --- Datos Personales ---
  name: string;
  lastname: string;
  rut?: string;
  age?: number;
  weight?: number; // en kg
  height?: number; // en cm
  imc?: number; // Calculado o ingresado
  email?: string;
  phone?: string;
  children?: number;
  occupation?: string;
  reasonForConsultation?: string;
  howDidYouHear: SelectOptionWithSpecifyBackend; // Tipo JSONB en Sequelize
  gender: string; // 'Hombre' | 'Mujer'

  // --- Antecedentes Médicos ---
  cardiovascular: MedicalConditionDetailsBackend; // Tipo JSONB
  ophthalmological: MedicalConditionDetailsBackend; // Tipo JSONB
  psychologicalPsychiatric: MedicalConditionDetailsBackend; // Tipo JSONB
  diabetes: MedicalConditionDetailsBackend; // Tipo JSONB
  hypertension: MedicalConditionDetailsBackend; // Tipo JSONB
  allergies: SelectOptionWithSpecifyBackend; // Tipo JSONB
  autoimmuneDiseases: MedicalConditionDetailsBackend; // Tipo JSONB
  hematologicalDiseases: MedicalConditionDetailsBackend; // Tipo JSONB
  respiratoryDiseases: MedicalConditionDetailsBackend; // Tipo JSONB
  sleepApnea: MedicalConditionDetailsBackend; // Tipo JSONB
  eatingDisorder: MedicalConditionDetailsBackend; // Tipo JSONB
  currentMedicationUse: { present: 'Sí' | 'No' | ''; specify?: string; }; // Tipo JSONB
  otherDiseasesNotMentioned: MedicalConditionDetailsBackend; // Tipo JSONB

  // --- Hábitos ---
  physicalActivity: string; // 'Sí' | 'No' | ''
  smoking: { isSmoker: string; cigarettesPerDay?: number; }; // Tipo JSONB
  drugs: { usesDrugs: string; type?: string; }; // Tipo JSONB
  alcohol: { consumesAlcohol: string; quantity?: string; }; // Tipo JSONB

  // --- Antecedentes Quirúrgicos ---
  surgeryDetails: {
    type: SelectOptionWithSpecifyBackend; // Tipo JSONB
    anesthesiaType: SelectOptionWithSpecifyBackend; // Tipo JSONB
    adverseEffect: SelectOptionWithSpecifyBackend; // Tipo JSONB
  };

  // --- Procedimientos ---
  suggestedTreatmentBySurgeon?: string;
  patientDecidedTreatment?: string;

  // --- Documentación (Links a Drive) ---
  document1?: string;
  document2?: string;
  document3?: string;

  // --- IDs de Google Drive (manejados por el backend) ---
  document1DriveId?: string | null;
  document2DriveId?: string | null;
  document3DriveId?: string | null;
}

// Interfaz para la data de creación (lo que recibe createPatient)
export type PatientCreationAttributes = Omit<PatientBackend, 'id' | 'createdAt'>;

// Interfaz para la data de actualización (lo que recibe updatePatient)
export type PatientUpdateAttributes = Partial<Omit<PatientBackend, 'id' | 'createdAt'>>;