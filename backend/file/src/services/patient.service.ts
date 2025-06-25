// backend/src/services/patient.service.ts

import { Profile } from "../models/profile.model";
import { HttpError } from "../utils/http.error.util";
import { googleDriveService } from "./google.drive.service";
import { validateField } from "../utils/validation.utils";
import {
  PatientCreationAttributes,
  PatientUpdateAttributes,
} from "../interfaces/patient.backend.interface";

// 🔍 Función para validar que un campo JSON tenga claves requeridas
function validateJsonField(
  field: any,
  requiredKeys: string[],
  fieldName: string
) {
  if (!field || typeof field !== "object") {
    throw new HttpError(`${fieldName} debe ser un objeto JSON`, 400);
  }

  for (const key of requiredKeys) {
    if (!(key in field)) {
      throw new HttpError(`${fieldName} debe contener la clave "${key}"`, 400);
    }
  }
}

class PatientService {
  // --- Crear paciente ---
  async createPatient(
    patientData: PatientCreationAttributes
  ): Promise<Profile> {
    const { name, lastname } = patientData;

    // ✅ Validaciones de campos obligatorios
    validateField(name, "El nombre");
    validateField(lastname, "El apellido");

    // ✅ Validar campos JSON si es necesario (puedes comentar los que no necesites)
    if (patientData.cardiovascular)
      validateJsonField(
        patientData.cardiovascular,
        ["present"],
        "Cardiovascular"
      );

    if (patientData.diabetes)
      validateJsonField(patientData.diabetes, ["present"], "Diabetes");

    if (patientData.hypertension)
      validateJsonField(patientData.hypertension, ["present"], "Hipertensión");

    if (patientData.surgeryDetails)
      validateJsonField(
        patientData.surgeryDetails,
        ["type", "anesthesiaType", "adverseEffect"],
        "Detalles quirúrgicos"
      );

    // ✅ Crear paciente
    const newPatient = await Profile.create(patientData);

    return newPatient;
  }

  // --- Obtener paciente por ID ---
  async getPatientById(id: string): Promise<Profile | null> {
    return await Profile.findByPk(id);
  }

  // --- Eliminar paciente ---
  async deletePatientById(id: string): Promise<Profile> {
    const patient = await Profile.findByPk(id);
    if (!patient) {
      throw new HttpError("No se encontró el paciente para eliminar", 404);
    }

    // 🗑️ Borrar archivos de Drive si existen
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
  }

  // --- Actualizar paciente ---
  async updatePatientById(
    id: string,
    patientData: PatientUpdateAttributes
  ): Promise<Profile> {
    const patientToUpdate = await Profile.findByPk(id);
    if (!patientToUpdate) {
      throw new HttpError(
        "No se pudo actualizar el paciente: ID inválido",
        400
      );
    }

    // ✅ Validar campos JSON si es necesario
    if (patientData.cardiovascular)
      validateJsonField(
        patientData.cardiovascular,
        ["present"],
        "Cardiovascular"
      );

    if (patientData.diabetes)
      validateJsonField(patientData.diabetes, ["present"], "Diabetes");

    if (patientData.hypertension)
      validateJsonField(patientData.hypertension, ["present"], "Hipertensión");

    if (patientData.surgeryDetails)
      validateJsonField(
        patientData.surgeryDetails,
        ["type", "anesthesiaType", "adverseEffect"],
        "Detalles quirúrgicos"
      );

    // ✅ Manejo de eliminación de archivos Drive si vienen como null
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

    const updatedInstance = await patientToUpdate.update(patientData);

    return updatedInstance;
  }

  // --- Obtener todos los pacientes ---
  async getAllPatients(): Promise<Profile[]> {
    return await Profile.findAll();
  }
}

export const patientService = new PatientService();
