export enum Sex {
  Male = "MASCULINO",
  Female = "FEMENINO",
  Other = "OTROS",
}

export enum Source {
  SocialMedia = "REDES SOCIALES",
  InPerson = "CAPTADOR",
}

export enum CommunicationPreference {
  Whatsapp = "WHATSAPP",
  Phone = "TELÉFONO",
}

export enum School {
  Quinta = "QUINTA NORMAL",
  Buin = "BUÍN",
  Granja = "LA GRANJA",
  Nunoa = "ÑUÑOA",
  Pudahuel = "PUDAHUEL",
  Miguel = "SAN MIGUEL",
}

export enum Course {
  NB1 = "1° NIVEL BÁSICO",
  NB2 = "2° NIVEL BÁSICO",
  NB3 = "3° NIVEL BÁSICO",
  NM1 = "1° NIVEL MEDIO",
  NM2 = "2° NIVEL MEDIO",
}

export interface CallStatus {
  completed: boolean;
  comment: string | null;
}

type PositiveFeedbackOptions =
  | ""
  | "AÚN SIN RESPUESTAS"
  | "NO SE MATRICULARÁ"
  | "INCONTACTABLE"
  | "PERSONA INTERESADA QUE ENVIARÁ DOCUMENTACIÓN"
  | "PERSONA QUE ENVIÓ DOCUMENTACIÓN PERO LE FALTA FIRMAR SU MATRÍCULA"
  | "PERSONA QUE IRÁ A MATRICULARSE DIRECTAMENTE A LA ESCUELA"
  | "PERSONA CON DOCUMENTACIÓN Y MATRÍCULA FIRMADA EN ESCUELA"
  | "INTERESADA PARA PRÓXIMO AÑO"
  | "PERSONA QUE ENVÍA DOCUMENTACIÓN Y SE DEBE TRASLADAR A OTRA PLANILLA";

export interface Student {
  id: string;
  name: string;
  lastname: string;
  rut?: string;
  sex?: Sex;
  birthdate?: Date;
  nationality?: string;
  address?: string;
  phone?: string;
  email?: string;
  source?: Source;
  contact?: string;
  contactDate?: Date;
  call1?: string;
  call2?: string;
  call3?: string;
  comments1?: string;
  comments2?: string;
  comments3?: string;
  positiveFeedback: PositiveFeedbackOptions;
  studentImage?: string;
  studentImageDriveId?: string | null;
  birthCertificate?: string;
  birthCertificateDriveId?: string | null;
  studyCertificate?: string;
  studyCertificateDriveId?: string | null;
  linkDni?: string;
  linkDniDriveId?: string | null;
  school?: School;
  course?: Course;
  communicationPreference?: CommunicationPreference;
  createdAt?: Date;
}
