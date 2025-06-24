import { NextFunction, Request, Response } from "express";
import { patientService } from "../services/patient.service"; // Importa el servicio renombrado
import { MulterRequest } from "../interfaces/express.interface"; // Asegúrate de que esta ruta sea correcta
import {
  processPatientFiles, // Importa la utilidad renombrada
  normalizePatientData, // Importa la utilidad renombrada
} from "../utils/patient.utils"; // Asegúrate de que esta ruta sea correcta
import { Profile } from "../models/profile.model"; // Importa el modelo Profile

const createPatientHandler = async ( // Renombrado
  req: MulterRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let patientData = normalizePatientData(req.body); // Normaliza los datos
    const uploadedFileDetails = await processPatientFiles(req); // Procesa los nuevos archivos

    const newPatientData = {
      ...patientData,
      // Asignar links e IDs de Google Drive a los nuevos campos de documento
      document1: uploadedFileDetails.document1?.link,
      document1DriveId: uploadedFileDetails.document1?.id,
      document2: uploadedFileDetails.document2?.link,
      document2DriveId: uploadedFileDetails.document2?.id,
      document3: uploadedFileDetails.document3?.link,
      document3DriveId: uploadedFileDetails.document3?.id,
    };

    const newPatient = await patientService.createPatient(newPatientData); // Llama al servicio de paciente
    res.json(newPatient);
  } catch (error) {
    next(error);
  }
};

const getPatientByIdHandler = async ( // Renombrado
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const patient = await patientService.getPatientById(id); // Llama al servicio de paciente
    res.json(patient);
  } catch (error) {
    next(error);
  }
};

const updatePatientHandler = async ( // Renombrado
  req: MulterRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const existingPatient = (await patientService.getPatientById( // Busca en servicio de paciente
      id
    )) as Profile; // Tipo Profile
    if (!existingPatient) {
      return res.status(404).json({ message: "Paciente no encontrado" });
    }

    const patientData = normalizePatientData(req.body); // Normaliza los datos

    // --- Lógica de Manejo de Archivos en Update ---
    // Los campos de archivo que el frontend envía con `null` o `undefined`
    // Si el frontend envía un archivo nuevo, multer ya lo adjunta a `req.files`.
    const uploadedFileDetails = await processPatientFiles(req);

    const updatedData: any = { ...patientData };
    const fileFields = [
      { field: "document1", driveIdField: "document1DriveId" },
      { field: "document2", driveIdField: "document2DriveId" },
      { field: "document3", driveIdField: "document3DriveId" },
    ];

    for (const { field, driveIdField } of fileFields) {
      const fileDetails =
        uploadedFileDetails[field as keyof typeof uploadedFileDetails];

      // Caso 1: Se subió un archivo nuevo para este campo
      if (fileDetails?.link) {
        updatedData[field] = fileDetails.link;
        updatedData[driveIdField] = fileDetails.id;
      }
      // Caso 2: El frontend indicó que se elimine el archivo existente (valor === null)
      // Si el frontend envía `null`, el servicio se encargará de borrar de Drive
      // y poner null en la DB.
      // Aquí, solo aseguramos que el `patientData` para el servicio tenga la instrucción `null`.
      else if (req.body[field] === 'null') { // Multer convierte 'null' string a 'null'
          updatedData[field] = null;
          updatedData[driveIdField] = null;
      }
      // Caso 3: No se subió archivo nuevo, y no se pidió borrar. Mantenemos el valor existente de la DB.
      else {
          updatedData[field] = existingPatient[field as keyof Profile];
          updatedData[driveIdField] = existingPatient[driveIdField as keyof Profile];
      }
    }

    const updatedPatient = await patientService.updatePatientById( // Llama al servicio de paciente
      id,
      updatedData
    );
    res.json(updatedPatient);
  } catch (error) {
    next(error);
  }
};

const deletePatientHandler = async ( // Renombrado
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const deletedPatient = await patientService.deletePatientById(id); // Llama al servicio de paciente
    res.json(deletedPatient);
  } catch (error) {
    next(error);
  }
};

const getAllPatientsHandler = async ( // Renombrado
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const patients = await patientService.getAllPatients(); // Llama al servicio de paciente
    res.json(patients);
  } catch (error) {
    next(error);
  }
};

export const patientController = { // Objeto de controlador renombrado
  createPatientHandler,
  getPatientByIdHandler,
  updatePatientHandler,
  deletePatientHandler,
  getAllPatientsHandler,
};