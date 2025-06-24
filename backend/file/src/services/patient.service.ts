import { Profile } from "../models/profile.model"; // Importa el modelo Profile
import { HttpError } from "../utils/http.error.util"; // Asegúrate de que esta ruta sea correcta
import { CreationAttributes } from "sequelize";
import { googleDriveService } from "./google.drive.service"; // Asegúrate de que esta ruta sea correcta
import { PatientCreationAttributes, PatientUpdateAttributes } from '../interfaces/patient.backend.interface'; // Importa las interfaces del backend

const createPatient = async ( // Renombrado de createStudent
  patientData: PatientCreationAttributes // Usa la nueva interfaz de creación
): Promise<Omit<Profile, "id" | "createdAt">> => { // Promesa de Profile
  const { phone, name, lastname } = patientData;

  const validateField = (field: any, fieldName: string): void => {
    if (!field) {
      throw new HttpError(`${fieldName} es obligatorio`, 400);
    }
  };

  validateField(name, "El nombre");
  validateField(lastname, "El apellido");
  validateField(phone, "El número de teléfono"); // Asegúrate que 'phone' sigue siendo un campo obligatorio

  const existingPatient = await Profile.findOne({ where: { phone } }); // Busca en Profile
  if (existingPatient) {
    throw new HttpError("El número de teléfono ya está registrado", 409);
  }

  const newPatient = await Profile.create(patientData); // Crea en Profile
  const { id, createdAt, ...patientWithoutIdAndCreatedAt } = newPatient.toJSON(); // Excluye id y createdAt

  return patientWithoutIdAndCreatedAt;
};

const getPatientById = async (id: string): Promise<Profile> => { // Renombrado y tipo de retorno Profile
  const patient = await Profile.findByPk(id); // Busca en Profile
  if (!patient) throw new HttpError("El ID de paciente no es válido", 404);
  return patient;
};

// getPatientByEmail ya no es necesario si el email no es un campo de búsqueda clave
// const getPatientByEmail = async (email: string): Promise<Profile> => {
//   const patient = await Profile.findOne({ where: { email } });
//   if (!patient) throw new HttpError("El email no se encuentra registrado", 404);
//   return patient;
// };

const deletePatientById = async (id: string): Promise<Profile> => { // Renombrado y tipo de retorno Profile
  const patient = await Profile.findByPk(id); // Busca en Profile
  if (!patient) {
    throw new HttpError("No se encontró el paciente para eliminar", 404);
  }

  // Lógica de borrado de archivos en Google Drive para los NUEVOS documentos
  if (patient.document1DriveId) {
    await googleDriveService.deleteFile(patient.document1DriveId);
  }
  if (patient.document2DriveId) {
    await googleDriveService.deleteFile(patient.document2DriveId);
  }
  if (patient.document3DriveId) {
    await googleDriveService.deleteFile(patient.document3DriveId);
  }
  // Eliminar campos antiguos si aún existen aquí y quieres que se borre de Drive
  // if (patient.studentImageDriveId) { await googleDriveService.deleteFile(patient.studentImageDriveId); }
  // if (patient.birthCertificateDriveId) { await googleDriveService.deleteFile(patient.birthCertificateDriveId); }
  // if (patient.studyCertificateDriveId) { await googleDriveService.deleteFile(patient.studyCertificateDriveId); }
  // if (patient.linkDniDriveId) { await googleDriveService.deleteFile(patient.linkDniDriveId); }


  await patient.destroy(); // Elimina el registro del paciente
  return patient;
};

const updatePatientById = async ( // Renombrado
  id: string,
  patientData: PatientUpdateAttributes // Usa la nueva interfaz de actualización
): Promise<Omit<Profile, "id" | "createdAt">> => { // Promesa de Profile
  const patientToUpdate = await Profile.findByPk(id); // Busca en Profile
  if (!patientToUpdate) {
    throw new HttpError(
      "No se pudo actualizar el paciente: ID inválido",
      400
    );
  }

  // Lógica de borrado/actualización de archivos antiguos y nuevos
  const fileFields = [
    { field: "document1", driveIdField: "document1DriveId" },
    { field: "document2", driveIdField: "document2DriveId" },
    { field: "document3", driveIdField: "document3DriveId" },
    // Si todavía manejas los antiguos archivos de estudiante, añádelos aquí:
    // { field: "studentImage", driveIdField: "studentImageDriveId" },
    // { field: "birthCertificate", driveIdField: "birthCertificateDriveId" },
    // { field: "studyCertificate", driveIdField: "studyCertificateDriveId" },
    // { field: "linkDni", driveIdField: "linkDniDriveId" },
  ];

  for (const { field, driveIdField } of fileFields) {
    // Si el frontend envía `null` para un campo de archivo, significa que se quiere borrar
    if (patientData[field as keyof PatientUpdateAttributes] === null) {
      if (patientToUpdate[driveIdField as keyof Profile]) { // Si existe un ID de Drive
        await googleDriveService.deleteFile(patientToUpdate[driveIdField as keyof Profile] as string);
      }
      (patientData as any)[driveIdField] = null; // Establecer ID de Drive a null en los datos a actualizar
    }
    // Si no es null, el controller ya habrá puesto el nuevo link/id de Drive
  }

  await patientToUpdate.update(patientData); // Actualiza el registro del paciente

  const { id: patientId, createdAt, ...patientWithoutIdAndCreatedAt } = patientToUpdate.toJSON(); // Excluye id y createdAt

  return patientWithoutIdAndCreatedAt;
};

const getAllPatients = async (): Promise<Profile[]> => { // Renombrado y tipo de retorno Profile[]
  const patients = await Profile.findAll(); // Busca en Profile
  if (!patients.length) {
    throw new HttpError("No se encontraron pacientes registrados", 404);
  }

  return patients.map((patient) => patient.toJSON());
};

export const patientService = { // Objeto de servicio renombrado
  createPatient,
  getPatientById,
  // getPatientByEmail, // No se usa si no hay búsqueda por email
  deletePatientById,
  updatePatientById,
  getAllPatients,
};