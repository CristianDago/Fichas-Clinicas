import {
  AllowNull,
  Column,
  DataType,
  Default,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
  BeforeCreate,
  BeforeUpdate,
} from "sequelize-typescript";
import { DateTime } from "luxon";
import {
  MedicalConditionDetailsBackend,
  SelectOptionWithSpecifyBackend,
} from "../interfaces/patient.backend.interface";

@Table({
  tableName: "Profiles",
  modelName: "Profile",
})
export class Profile extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  // --- Datos Personales ---
  @AllowNull(false)
  @Column(DataType.STRING)
  declare name: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare lastname: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  declare rut?: string;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare age?: number;

  @AllowNull(true)
  @Column(DataType.FLOAT)
  declare weight?: number;

  @AllowNull(true)
  @Column(DataType.FLOAT)
  declare height?: number;

  @AllowNull(true)
  @Column(DataType.FLOAT)
  declare imc?: number;

  @AllowNull(true)
  @Column(DataType.STRING)
  declare email?: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  declare phone?: string;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare children?: number;

  @AllowNull(true)
  @Column(DataType.STRING)
  declare occupation?: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare reasonForConsultation?: string;

  @AllowNull(false)
  @Column(DataType.JSON)
  declare howDidYouHear: SelectOptionWithSpecifyBackend;

  @AllowNull(true)
  @Column(DataType.STRING)
  declare gender: string;

  // --- Antecedentes Médicos ---
  @AllowNull(false)
  @Column(DataType.JSON)
  declare cardiovascular: MedicalConditionDetailsBackend;

  @AllowNull(false)
  @Column(DataType.JSON)
  declare ophthalmological: MedicalConditionDetailsBackend;

  @AllowNull(false)
  @Column(DataType.JSON)
  declare psychologicalPsychiatric: MedicalConditionDetailsBackend;

  @AllowNull(false)
  @Column(DataType.JSON)
  declare diabetes: MedicalConditionDetailsBackend;

  @AllowNull(false)
  @Column(DataType.JSON)
  declare hypertension: MedicalConditionDetailsBackend;

  @AllowNull(false)
  @Column(DataType.JSON)
  declare allergies: SelectOptionWithSpecifyBackend;

  @AllowNull(false)
  @Column(DataType.JSON)
  declare autoimmuneDiseases: MedicalConditionDetailsBackend;

  @AllowNull(false)
  @Column(DataType.JSON)
  declare hematologicalDiseases: MedicalConditionDetailsBackend;

  @AllowNull(false)
  @Column(DataType.JSON)
  declare respiratoryDiseases: MedicalConditionDetailsBackend;

  @AllowNull(false)
  @Column(DataType.JSON)
  declare sleepApnea: MedicalConditionDetailsBackend;

  @AllowNull(false)
  @Column(DataType.JSON)
  declare eatingDisorder: MedicalConditionDetailsBackend;

  @AllowNull(false)
  @Column(DataType.JSON)
  declare currentMedicationUse: { present: string; specify?: string };

  @AllowNull(false)
  @Column(DataType.JSON)
  declare otherDiseasesNotMentioned: MedicalConditionDetailsBackend;

  // --- Hábitos ---
  @AllowNull(true)
  @Column(DataType.STRING)
  declare physicalActivity: string;

  @AllowNull(false)
  @Column(DataType.JSON)
  declare smoking: { isSmoker: string; cigarettesPerDay?: number };

  @AllowNull(false)
  @Column(DataType.JSON)
  declare drugs: { usesDrugs: string; type?: string };

  @AllowNull(false)
  @Column(DataType.JSON)
  declare alcohol: { consumesAlcohol: string; quantity?: string };

  // --- Antecedentes Quirúrgicos ---
  @AllowNull(false)
  @Column(DataType.JSON)
  declare surgeryDetails: {
    type: SelectOptionWithSpecifyBackend;
    anesthesiaType: SelectOptionWithSpecifyBackend;
    adverseEffect: SelectOptionWithSpecifyBackend;
  };

  // --- Procedimientos ---
  @AllowNull(true)
  @Column(DataType.TEXT)
  declare suggestedTreatmentBySurgeon?: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare patientDecidedTreatment?: string;

  // --- Documentación (Links a Drive) ---
  @AllowNull(true)
  @Column(DataType.TEXT)
  declare document1?: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare document2?: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare document3?: string;

  // --- IDs de Google Drive ---
  @AllowNull(true)
  @Column(DataType.TEXT)
  declare document1DriveId?: string | null;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare document2DriveId?: string | null;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare document3DriveId?: string | null;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  declare createdAt?: Date;

  @BeforeCreate
  @BeforeUpdate
  static adjustDates(instance: Profile) {
    const adjustDateToChileTimezone = (
      date: Date | undefined
    ): Date | undefined => {
      if (!date) return date;
      return DateTime.fromJSDate(date)
        .setZone("America/Santiago")
        .toJSDate();
    };

    if (instance.createdAt !== undefined) {
      instance.createdAt = adjustDateToChileTimezone(instance.createdAt);
    }
  }
}
