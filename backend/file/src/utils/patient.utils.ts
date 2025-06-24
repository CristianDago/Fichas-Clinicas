import { MulterRequest } from "../interfaces/express.interface";
import {
  uploadFileToDrive,
  setFilePublic,
  googleDriveService,
} from "../services/google.drive.service";
import fs from "fs";
import path from "path";
import { DateTime } from "luxon";
import { PatientBackend } from "../interfaces/patient.backend.interface";

export function transformStringsToUppercase(obj: any): any {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

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

export const processPatientFiles = async (
  req: MulterRequest
): Promise<{
  document1?: { link: string | null; id: string | null };
  document2?: { link: string | null; id: string | null };
  document3?: { link: string | null; id: string | null };
}> => {
  const files = req.files as
    | { [fieldname: string]: Express.Multer.File[] }
    | undefined;

  const uploadedFiles: {
    document1?: { link: string | null; id: string | null };
    document2?: { link: string | null; id: string | null };
    document3?: { link: string | null; id: string | null };
  } = {};

  if (files?.["document1"]?.[0]) {
    const uploaded = await handleFileUpload(files["document1"][0]);
    uploadedFiles.document1 = {
      link: uploaded?.link ?? null,
      id: uploaded?.id ?? null,
    };
  } else {
    uploadedFiles.document1 = { link: null, id: null };
  }

  if (files?.["document2"]?.[0]) {
    const uploaded = await handleFileUpload(files["document2"][0]);
    uploadedFiles.document2 = {
      link: uploaded?.link ?? null,
      id: uploaded?.id ?? null,
    };
  } else {
    uploadedFiles.document2 = { link: null, id: null };
  }

  if (files?.["document3"]?.[0]) {
    const uploaded = await handleFileUpload(files["document3"][0]);
    uploadedFiles.document3 = {
      link: uploaded?.link ?? null,
      id: uploaded?.id ?? null,
    };
  } else {
    uploadedFiles.document3 = { link: null, id: null };
  }

  return uploadedFiles;
};

// --- FUNCIÓN AUXILIAR PARA LIMPIAR VALORES VACÍOS/NULOS DE FORMA RECURSIVA ---
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
// --- FIN FUNCIÓN AUXILIAR ---

export const normalizePatientData = (rawData: any): any => {
  let data = { ...rawData };

  const jsonbFields = [
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

  for (const field of jsonbFields) {
    if (data[field] && typeof data[field] === "string") {
      try {
        data[field] = JSON.parse(data[field]);
      } catch (e) {
        console.error(`Error parsing JSON for field ${field}:`, data[field], e);
        data[field] = null;
      }
    }

    if (
      data[field] === null ||
      data[field] === "" ||
      data[field] === undefined
    ) {
      if (jsonbFields.includes(field)) {
        data[field] = {};
      }
    }
  }

  data = cleanEmptyValuesRecursively(data);

  const uppercased = transformStringsToUppercase(data);

  return uppercased;
};
