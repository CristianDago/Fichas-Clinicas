export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

// Opciones estándar para selects Sí/No
export const YES_NO_OPTIONS: SelectOption[] = [
  { value: "", label: "Seleccione" },
  { value: "Sí", label: "Sí" },
  { value: "No", label: "No" },
];

// ¡CAMBIO CRÍTICO AQUÍ!: Opciones para el select de Alergias (¡SELECCIÓN ÚNICA!)
export const ALLERGY_OPTIONS: SelectOption[] = [
  { value: "", label: "Seleccionar" }, // Opción por defecto (no disabled)
  { value: "Latex", label: "Látex" },
  { value: "Lidocaina", label: "Lidocaína" },
  { value: "Corticoides", label: "Corticoides" },
  { value: "Iodo", label: "Iodo" },
  { value: "Otros", label: "Otros (Especificar)" },
];

// Opciones para Cirugía 
export const SURGERY_TYPE_OPTIONS: SelectOption[] = [
  { value: "", label: "Seleccione" },
  { value: "Cirugía bariátrica", label: "Cirugía bariátrica" },
  { value: "Cirugía tiroidea", label: "Cirugía tiroidea" },
  { value: "Hernias", label: "Hernias" },
  { value: "Cirugías abdominales", label: "Cirugías abdominales" },
  { value: "Cesáreas", label: "Cesáreas" },
  { value: "Cirugía facial", label: "Cirugía facial" },
  { value: "Cirugía ortognática", label: "Cirugía ortognática" },
  { value: "Otros", label: "Otros" },
];

// Opciones para Anestesia
export const ANESTHESIA_TYPE_OPTIONS: SelectOption[] = [
  { value: "", label: "Seleccione" },
  { value: "General", label: "General" },
  { value: "Raquidea", label: "Raquidea" },
  { value: "Local", label: "Local" },
  { value: "Otros", label: "Otros" },
];

// Opciones para Cirugía
export const ADVERSE_EFFECT_OPTIONS = [
  { value: '', label: 'Seleccione' },
  { value: 'Cefaleas', label: 'Cefaleas' },
  { value: 'Retención urinaria', label: 'Retención urinaria' },
  { value: 'Vómitos', label: 'Vómitos' },
  { value: 'Shock anafiláctico', label: 'Shock anafiláctico' },
  { value: 'Otros', label: 'Otros' }, 
];

// Opciones para ¿Cómo llegaste?
export const HOW_DID_YOU_HEAR = [
  { value: '', label: 'Seleccione' },
  { value: 'Redes Sociales', label: 'Redes Sociales' },
  { value: 'Búsqueda en Google', label: 'Búsqueda en Google' },
  { value: 'Recomendación', label: 'Recomendación' },
  { value: 'Otros', label: 'Otros' }, 
];

export const allFeedbacks = [
  "AÚN SIN RESPUESTAS",
  "NO SE MATRICULARÁ",
  "INCONTACTABLE",
  "PERSONA INTERESADA QUE ENVIARÁ DOCUMENTACIÓN",
  "PERSONA QUE ENVIÓ DOCUMENTACIÓN PERO LE FALTA FIRMAR SU MATRÍCULA",
  "PERSONA QUE IRÁ A MATRICULARSE DIRECTAMENTE A LA ESCUELA",
  "PERSONA CON DOCUMENTACIÓN Y MATRÍCULA FIRMADA EN ESCUELA",
  "INTERESADA PARA PRÓXIMO AÑO",
  "PERSONA QUE ENVÍA DOCUMENTACIÓN Y SE DEBE TRASLADAR A OTRA PLANILLA",
];

export const GENDER_OPTIONS = ["", "MASCULINO", "FEMENINO", "OTROS"];
export const SOURCE_OPTIONS = ["", "REDES SOCIALES", "CAPTADOR"];
export const SCHOOL_OPTIONS = [
  "",
  "QUINTA NORMAL",
  "BUÍN",
  "LA GRANJA",
  "ÑUÑOA",
  "PUDAHUEL",
  "SAN MIGUEL",
];
export const COURSE_OPTIONS = [
  "",
  "1° NIVEL BÁSICO",
  "2° NIVEL BÁSICO",
  "3° NIVEL BÁSICO",
  "1° NIVEL MEDIO",
  "2° NIVEL MEDIO",
];
export const CONTACT_PERSON_OPTIONS = [
  "",
  "LORENA",
  "ARLETTE",
  "MARÍA",
  "ROWINA",
];
export const COMMUNICATION_PREFERENCE_OPTIONS = ["", "WHATSAPP", "TELÉFONO"];
export const CALL_STATUS_OPTIONS = ["", "SÍ", "NO"];

export const DROPDOWN_ITEM_HEIGHT_PX = 60;

export const CAPTATOR_NAMES = [
  "Lorena",
  "Arlette",
  "María",
  "Rowina",
  "No Ingresa Captador",
];

const Constants = {
  allFeedbacks,
  GENDER_OPTIONS,
  SOURCE_OPTIONS,
  SCHOOL_OPTIONS,
  COURSE_OPTIONS,
  CONTACT_PERSON_OPTIONS,
  COMMUNICATION_PREFERENCE_OPTIONS,
  CALL_STATUS_OPTIONS,
  DROPDOWN_ITEM_HEIGHT_PX,
  CAPTATOR_NAMES,
};

export default Constants;
