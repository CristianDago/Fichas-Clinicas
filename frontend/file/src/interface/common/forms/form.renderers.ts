import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { MedicalConditionDetails } from "../../../interface/patient/patient.interface";
import { PatientData } from "../../../interface/patient/patient.interface";
import { SelectOptionWithSpecify } from "../../../interface/patient/patient.interface";

export interface MedicalConditionDisplayProps {
  icon: IconDefinition;
  label: string;
  data: MedicalConditionDetails;
}

export interface PatientDetailsProps {
  patient: PatientData;
  onEdit: () => void;
  onDelete: () => void;
}

export interface Props {
  icon: IconDefinition;
  label: string;
  data: SelectOptionWithSpecify;
}

export interface SmokingData {
  isSmoker: string; // "Sí" | "No" | ""
  cigarettesPerDay?: number;
}

export interface DrugsData {
  usesDrugs: string; // "Sí" | "No" | ""
  type?: string;
}

export interface AlcoholData {
  consumesAlcohol: string; // "Sí" | "No" | ""
  quantity?: string;
}

type HabitType = "smoking" | "drugs" | "alcohol";

export interface HabitDisplayProps {
  icon?: IconDefinition;
  label: string;
  data: SmokingData | DrugsData | AlcoholData | string;
  habitType: HabitType;
}
