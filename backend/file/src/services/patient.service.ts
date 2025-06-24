// backend/src/services/patient.service.ts

import { Profile } from "../models/profile.model";
import { HttpError } from "../utils/http.error.util";
import { googleDriveService } from "./google.drive.service";
import { validateField } from "../utils/validation.utils"; // <-- Nueva importación de la utilidad
import {
  PatientCreationAttributes,
  PatientUpdateAttributes,
} from "../interfaces/patient.backend.interface";

class PatientService {
  // --- 1. Método para crear un paciente ---
  // Ahora retorna una instancia completa de Profile.
  async createPatient(
    patientData: PatientCreationAttributes
  ): Promise<Profile> {
    const { name, lastname } = patientData;

    validateField(name, "El nombre"); // Uso de la utilidad
    validateField(lastname, "El apellido"); // Uso de la utilidad

    const newPatient = await Profile.create(patientData);
    return newPatient; // Retorna la instancia de Sequelize directamente
  }

  // --- 2. Método para obtener un paciente por ID ---
  // Retorna una instancia de Profile o null. Esto ya estaba correcto.
  async getPatientById(id: string): Promise<Profile | null> {
    const patient = await Profile.findByPk(id);
    // No lanzamos HttpError aquí, el controlador lo manejará si retorna null.
    return patient;
  }

  // --- 3. Método para eliminar un paciente ---
  // Retorna una instancia de Profile. Esto ya estaba correcto.
  async deletePatientById(id: string): Promise<Profile> {
    const patient = await Profile.findByPk(id);
    if (!patient) {
      throw new HttpError("No se encontró el paciente para eliminar", 404);
    }

    // Lógica para eliminar archivos de Drive
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
    return patient; // Retorna la instancia eliminada
  }

  // --- 4. Método para actualizar un paciente ---
  // Ahora retorna una instancia completa de Profile.
  async updatePatientById(
    id: string,
    patientData: PatientUpdateAttributes
  ): Promise<Profile> {
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

    const updatedInstance = await patientToUpdate.update(patientData);
    return updatedInstance; // Retorna la instancia de Sequelize actualizada
  }

  // --- 5. Método para obtener todos los pacientes ---
  // Retorna un array de instancias de Profile. Esto ya estaba correcto.
  async getAllPatients(): Promise<Profile[]> {
    const patients = await Profile.findAll();
    // No lanzamos HttpError si la lista está vacía, el controlador decidirá qué hacer.
    return patients; // Retorna el array de instancias de Sequelize
  }
}

export const patientService = new PatientService();