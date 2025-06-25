import { NextFunction, Request, Response } from "express";
import { patientService } from "../services/patient.service";
import { MulterRequest } from "../interfaces/express.interface";
import {
  processPatientFiles,
  normalizePatientData, // Asumo que esto es para normalizar req.body (ej. parsear JSON strings de FormData)
} from "../utils/patient.utils"; // Mantener este import si es relevante para req.body
import { Profile } from "../models/profile.model";

// --- NUEVAS IMPORTACIONES DE LAS FUNCIONES NORMALIZADORAS ---
import {
  parseJsonStringIfValid, // Aunque no se usa directamente en handlers, está en normalizePatientDataForFrontend
  normalizePatientDataForFrontend,
} from "../utils/patient.data.normalizer"; // <-- NUEVA RUTA DEL ARCHIVO


const createPatientHandler = async (
  req: MulterRequest,
  res: Response,
  next: NextFunction
) => {
  try {

    let patientData = normalizePatientData(req.body); // Asumo que esto ya maneja el parseo de JSON strings de req.body

    const uploadedFileDetails = await processPatientFiles(req);

    const newPatientDataToSave = {
      ...patientData,
      document1: uploadedFileDetails.document1?.link,
      document1DriveId: uploadedFileDetails.document1?.id,
      document2: uploadedFileDetails.document2?.link,
      document2DriveId: uploadedFileDetails.document2?.id,
      document3: uploadedFileDetails.document3?.link,
      document3DriveId: uploadedFileDetails.document3?.id,
    };

    const newPatient = await patientService.createPatient(newPatientDataToSave); 
    const responsePatient = normalizePatientDataForFrontend(newPatient);
    res.json(responsePatient);
  } catch (error: any) {
    next(error);
  }
};

const getPatientByIdHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const patient = await patientService.getPatientById(id);
    if (!patient) {
      return res.status(404).json({ message: "Paciente no encontrado" });
    }
    
    const patientPlainObject = patient.toJSON();

    const responsePatient = normalizePatientDataForFrontend(patientPlainObject); // Usa la función importada

    res.json(responsePatient);
  } catch (error: any) {
    next(error);
  }
};

const updatePatientHandler = async (
  req: MulterRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const existingPatient = (await patientService.getPatientById(
      id
    )) as Profile;
    if (!existingPatient) {
      return res.status(404).json({ message: "Paciente no encontrado" });
    }

    let patientData = normalizePatientData(req.body);

    const uploadedFileDetails = await processPatientFiles(req);

    const updatedDataToSave: any = { ...patientData };

    const fileFields = [
      { field: "document1", driveIdField: "document1DriveId" },
      { field: "document2", driveIdField: "document2DriveId" },
      { field: "document3", driveIdField: "document3DriveId" },
    ];

    for (const { field, driveIdField } of fileFields) {
      const fileDetails =
        uploadedFileDetails[field as keyof typeof uploadedFileDetails];

      if (fileDetails?.link) {
        updatedDataToSave[field] = fileDetails.link;
        updatedDataToSave[driveIdField] = fileDetails.id;
      } else if (req.body[field] === "null") {
        updatedDataToSave[field] = null;
        updatedDataToSave[driveIdField] = null;
      } else {
        updatedDataToSave[field] = existingPatient.get(field as keyof Profile);
        updatedDataToSave[driveIdField] = existingPatient.get(driveIdField as keyof Profile);
      }
    }
    
    const updatedPatientResult = await patientService.updatePatientById(
      id,
      updatedDataToSave
    );

    const updatedPatientPlainObject = updatedPatientResult.toJSON();

    const responsePatient = normalizePatientDataForFrontend(updatedPatientPlainObject); // Usa la función importada

    res.json(responsePatient);
  } catch (error: any) {
    next(error);
  }
};

const deletePatientHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const deletedPatient = await patientService.deletePatientById(id);
    res.json(deletedPatient.toJSON ? deletedPatient.toJSON() : deletedPatient);
  } catch (error: any) {
    next(error);
  }
};

const getAllPatientsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const patients = await patientService.getAllPatients();
    const normalizedPatientsList = patients.map(patient => normalizePatientDataForFrontend(patient.toJSON())); // Usa la función importada
    res.json(normalizedPatientsList);
  } catch (error: any) {
    next(error);
  }
};

export const patientController = {
  createPatientHandler,
  getPatientByIdHandler,
  updatePatientHandler,
  deletePatientHandler,
  getAllPatientsHandler,
};