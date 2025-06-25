import { MulterRequest } from "../interfaces/express.interface";
import {
  uploadFileToDrive,
  setFilePublic,
} from "../services/google.drive.service";
import fs from "fs";
import path from "path";

// --- Transforma a mayúsculas (de forma recursiva) ---
export function transformStringsToUppercase(obj: any): any {
  if (typeof obj !== "object" || obj === null) return obj;

  const transformedObj: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      if (
        typeof value === "string" &&
        value !== "undefined" &&
        value !== "null"
      ) {
        transformedObj[key] = value.toUpperCase();
      } else if (typeof value === "object" && value !== null) {
        transformedObj[key] = transformStringsToUppercase(value);
      } else {
        transformedObj[key] = value;
      }
    }
  }
  return transformedObj;
}

// --- Sube un archivo y retorna {link, id} ---
const handleFileUpload = async (file: Express.Multer.File) => {
  try {
    const filePath = path.join("uploads", file.filename);
    const uploadedFile = await uploadFileToDrive(filePath, file.filename);
    await setFilePublic(uploadedFile.id ?? "");
    fs.unlinkSync(filePath);
    return {
      link: uploadedFile.webViewLink || uploadedFile.webContentLink,
      id: uploadedFile.id,
    };
  } catch (error) {
    console.error("Error al subir archivo a Drive:", error);
    return null;
  }
};

// --- Procesa los archivos del formulario del paciente ---
export const processPatientFiles = async (
  req: MulterRequest
): Promise<{
  document1?: { link: string | null; id: string | null };
  document2?: { link: string | null; id: string | null };
  document3?: { link: string | null; id: string | null };
}> => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

  const uploadedFiles: any = {};

  for (const field of ["document1", "document2", "document3"]) {
    if (files?.[field]?.[0]) {
      const uploaded = await handleFileUpload(files[field][0]);
      uploadedFiles[field] = {
        link: uploaded?.link ?? null,
        id: uploaded?.id ?? null,
      };
    } else {
      uploadedFiles[field] = { link: null, id: null };
    }
  }

  return uploadedFiles;
};

// --- Limpia valores vacíos o nulos ---
function cleanEmptyValuesRecursively(obj: any): any {
  if (typeof obj !== "object" || obj === null) {
    if (
      typeof obj === "string" &&
      (obj.trim() === "" ||
        obj.toLowerCase() === "null" ||
        obj.toLowerCase() === "undefined")
    ) {
      return null;
    }
    if (typeof obj === "number" && (isNaN(obj) || !isFinite(obj))) {
      return null;
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => cleanEmptyValuesRecursively(item));
  }

  const cleanedObj: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cleanedObj[key] = cleanEmptyValuesRecursively(obj[key]);
    }
  }
  return cleanedObj;
}

// --- Normaliza los datos del paciente ---
export const normalizePatientData = (rawData: any): any => {
  const data = { ...rawData };
  const result: Record<string, any> = {};

  for (const key in data) {
    let value = data[key];

    try {
      value = JSON.parse(value);
    } catch {
      // Mantener como string si no es JSON válido
    }

    const keys = key.split(".");
    if (keys.length === 1) {
      result[keys[0]] = value;
    } else {
      if (!result[keys[0]] || typeof result[keys[0]] !== "object") {
        result[keys[0]] = {};
      }
      result[keys[0]][keys[1]] = value;
    }
  }

  const jsonFields = [
    "howDidYouHear",
    "cardiovascular",
    "ophthalmological",
    "psychologicalPsychiatric",
    "diabetes",
    "hypertension",
    "allergies",
    "autoimmuneDiseases",
    "hematologicalDiseases",
    "respiratoryDiseases",
    "sleepApnea",
    "eatingDisorder",
    "currentMedicationUse",
    "otherDiseasesNotMentioned",
    "smoking",
    "drugs",
    "alcohol",
    "surgeryDetails",
  ];

  for (const field of jsonFields) {
    if (data[field] && typeof data[field] === "string") {
      try {
        data[field] = JSON.parse(data[field]);
      } catch (e) {
        console.error(`Error parsing JSON for field ${field}:`, data[field], e);
        data[field] = {};
      }
    }
  
    if (
      data[field] === null ||
      data[field] === "" ||
      data[field] === undefined
    ) {
      data[field] = {};
    }
  }

  const cleaned = cleanEmptyValuesRecursively(result);
  const uppercased = transformStringsToUppercase(cleaned);

  return uppercased;
};
