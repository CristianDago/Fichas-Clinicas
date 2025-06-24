import { Profile } from "../models/profile.model";
import { HttpError } from "../utils/http.error.util";
import { googleDriveService } from "./google.drive.service";
import {
  PatientCreationAttributes,
  PatientUpdateAttributes,
} from "../interfaces/patient.backend.interface";

const createPatient = async (
  patientData: PatientCreationAttributes
): Promise<Omit<Profile, "id" | "createdAt">> => {
  const { phone, name, lastname } = patientData;

  const validateField = (field: any, fieldName: string): void => {
    if (!field) {
      throw new HttpError(`${fieldName} es obligatorio`, 400);
    }
  };

  validateField(name, "El nombre");
  validateField(lastname, "El apellido");

  const newPatient = await Profile.create(patientData);
  const { id, createdAt, ...patientWithoutIdAndCreatedAt } =
    newPatient.toJSON();

  return patientWithoutIdAndCreatedAt;
};

const getPatientById = async (id: string): Promise<Profile> => {
  const patient = await Profile.findByPk(id);
  if (!patient) throw new HttpError("El ID de paciente no es válido", 404);
  return patient;
};

const deletePatientById = async (id: string): Promise<Profile> => {
  const patient = await Profile.findByPk(id);
  if (!patient) {
    throw new HttpError("No se encontró el paciente para eliminar", 404);
  }

  if (patient.document1DriveId) {
    await googleDriveService.deleteFile(patient.document1DriveId);
  }
  if (patient.document2DriveId) {
    await googleDriveService.deleteFile(patient.document2DriveId);
  }
  if (patient.document3DriveId) {
    await googleDriveService.deleteFile(patient.document3DriveId);
  }

  await patient.destroy();
  return patient;
};

const updatePatientById = async (
  id: string,
  patientData: PatientUpdateAttributes
): Promise<Omit<Profile, "id" | "createdAt">> => {
  const patientToUpdate = await Profile.findByPk(id);
  if (!patientToUpdate) {
    throw new HttpError("No se pudo actualizar el paciente: ID inválido", 400);
  }

  const fileFields = [
    { field: "document1", driveIdField: "document1DriveId" },
    { field: "document2", driveIdField: "document2DriveId" },
    { field: "document3", driveIdField: "document3DriveId" },
  ];

  for (const { field, driveIdField } of fileFields) {
    if (patientData[field as keyof PatientUpdateAttributes] === null) {
      if (patientToUpdate[driveIdField as keyof Profile]) {
        await googleDriveService.deleteFile(
          patientToUpdate[driveIdField as keyof Profile] as string
        );
      }
      (patientData as any)[driveIdField] = null;
    }
  }

  await patientToUpdate.update(patientData);

  const {
    id: patientId,
    createdAt,
    ...patientWithoutIdAndCreatedAt
  } = patientToUpdate.toJSON();

  return patientWithoutIdAndCreatedAt;
};

const getAllPatients = async (): Promise<Profile[]> => {
  const patients = await Profile.findAll();
  if (!patients.length) {
    throw new HttpError("No se encontraron pacientes registrados", 404);
  }

  return patients.map((patient) => patient.toJSON());
};

export const patientService = {
  createPatient,
  getPatientById,
  deletePatientById,
  updatePatientById,
  getAllPatients,
};
