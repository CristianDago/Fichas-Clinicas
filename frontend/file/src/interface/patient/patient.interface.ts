// interface/patient/patient.interface.ts

// Interfaz para detalles de condiciones médicas (Sí/No con especificaciones)
export interface MedicalConditionDetails {
  present?: "Sí" | "No" | "" | null; // Permite `null` y `""`
  type?: string | null;
  medications?: string | null;
  dose?: string | null;
}

// Interfaz genérica para select con opción "Otros"
export interface SelectOptionWithSpecify {
  selected?: string | null; // Permite `null` y `""`
  specify?: string | null;
}

// --- Interfaces de Hábitos - AÑADIDAS AQUÍ Y EXPORTADAS ---
export interface SmokingData {
  isSmoker?: "Sí" | "No" | "" | null; // Permite `null` y `""`
  cigarettesPerDay?: number | null;
}

export interface DrugsData {
  usesDrugs?: "Sí" | "No" | "" | null; // Permite `null` y `""`
  type?: string | null;
}

export interface AlcoholData {
  consumesAlcohol?: "Sí" | "No" | "" | null; // Permite `null` y `""`
  quantity?: string | null;
}
// --- FIN Interfaces de Hábitos ---

// Interfaz principal de datos
export interface PatientData {
  // --- Datos Personales ---
  id?: string;
  createdAt?: Date;
  name: string;
  lastname: string;
  rut: string;
  age?: number | null; // Puedes añadir `| null` a los números también si pueden venir como null
  gender?: "Masculino" | "Femenino" | "Otro" | "" | null; // Permite `null` y `""`
  weight?: number | null;
  height?: number | null;
  imc?: number | null;
  email?: string | null;
  phone?: string | null;
  children?: number | null;
  occupation?: string | null;
  reasonForConsultation?: string | null;
  howDidYouHear: SelectOptionWithSpecify;
  // --- Antecedentes Médicos ---
  cardiovascular: MedicalConditionDetails;
  ophthalmological: MedicalConditionDetails;
  psychologicalPsychiatric: MedicalConditionDetails;
  diabetes: MedicalConditionDetails;
  hypertension: MedicalConditionDetails;
  allergies: SelectOptionWithSpecify;
  autoimmuneDiseases: MedicalConditionDetails;
  hematologicalDiseases: MedicalConditionDetails;
  respiratoryDiseases: MedicalConditionDetails;
  sleepApnea: MedicalConditionDetails;
  eatingDisorder: MedicalConditionDetails;
  currentMedicationUse: {
    present?: "Sí" | "No" | "" | null; // Permite `null` y `""`
    specify?: string | null;
  };
  otherDiseasesNotMentioned: MedicalConditionDetails;
  // --- Hábitos ---
  physicalActivity?: "Sí" | "No" | "" | null; // Permite `null` y `""`
  smoking: SmokingData; // ¡Ahora usa la interfaz exportada!
  drugs: DrugsData;     // ¡Ahora usa la interfaz exportada!
  alcohol: AlcoholData; // ¡Ahora usa la interfaz exportada!
  // --- Antecedentes Quirúrgicos ---
  surgeryDetails: {
    type: SelectOptionWithSpecify;
    anesthesiaType: SelectOptionWithSpecify;
    adverseEffect: SelectOptionWithSpecify;
  };
  // --- Procedimientos ---
  suggestedTreatmentBySurgeon?: string | null;
  patientDecidedTreatment?: string | null;

  // --- Documentación ---
  document1?: File | string | null;
  document2?: File | string | null;
  document3?: File | string | null;

  document1DriveId?: string | null;
  document2DriveId?: string | null;
  document3DriveId?: string | null;
}