// Interfaz para detalles de condiciones médicas (Sí/No con especificaciones)
export interface MedicalConditionDetails {
  present: 'Sí' | 'No' | ''; // Ahora es un string del select
  type?: string;
  medications?: string;
  dose?: string;
}

// Interfaz genérica para select con opción "Otros" 
export interface SelectOptionWithSpecify {
  selected: string; // Puede ser CUALQUIER string de la opción seleccionada (ej. "Latex", "Otros")
  specify?: string; // Campo para especificar si 'Otros' fue seleccionado
}

// Interfaz principal de datos 
export interface PatientData {
  // --- Datos Personales ---
  name: string;
  lastname: string;
  rut: string;
  age?: number;
  weight?: number; 
  height?: number; 
  imc?: number;
  email: string;
  phone: string;
  children?: number; 
  occupation?: string;
  reasonForConsultation?: string; 
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
    present: 'Sí' | 'No' | '';
    specify?: string;
  };
  otherDiseasesNotMentioned: MedicalConditionDetails;
  // --- Hábitos ---
  physicalActivity: 'Sí' | 'No' | '';
  smoking: {
    isSmoker: 'Sí' | 'No' | '';
    cigarettesPerDay?: number;
  };
  drugs: {
    usesDrugs: 'Sí' | 'No' | '';
    type?: string;
  };
  alcohol: {
    consumesAlcohol: 'Sí' | 'No' | '';
    quantity?: string;
  };
  // --- Antecedentes Quirúrgicos ---
  surgeryDetails: {
    type: SelectOptionWithSpecify; // Usa SelectOptionWithSpecify
    anesthesiaType: SelectOptionWithSpecify; // Usa SelectOptionWithSpecify
    adverseEffect: SelectOptionWithSpecify; // Usa SelectOptionWithSpecify (simplificamos para consistencia)
  };
  // --- Procedimientos ---
  suggestedTreatmentBySurgeon?: string;
  patientDecidedTreatment?: string;

  // --- Documentación ---
  document1?: File | null;
  document2?: File | null;
  document3?: File | null;
}