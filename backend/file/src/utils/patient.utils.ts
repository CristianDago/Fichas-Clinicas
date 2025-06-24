// backend/src/utils/patient.utils.ts

import { MulterRequest } from "../interfaces/express.interface";
import {
  uploadFileToDrive,
  setFilePublic,
  googleDriveService
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
      if (typeof value === "string" && value !== "undefined" && value !== "null") {
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
    if (typeof obj !== 'object' || obj === null) {
        // Para valores primitivos: si es string vacío, "null", "undefined", o null/undefined, devuelve null
        if (typeof obj === 'string' && (obj.trim() === '' || obj.toLowerCase() === 'null' || obj.toLowerCase() === 'undefined')) {
            return null;
        }
        // Para números: si es NaN o Infinity, devuelve null
        if (typeof obj === 'number' && (isNaN(obj) || !isFinite(obj))) {
            return null;
        }
        return obj; // Devolver el valor tal cual si no es un "vacío" conocido
    }

    // Si es un array, limpiar cada elemento
    if (Array.isArray(obj)) {
        return obj.map(item => cleanEmptyValuesRecursively(item));
    }

    // Si es un objeto, limpiar cada propiedad recursivamente
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
  let data = { ...rawData }; // Usamos 'let' porque vamos a reasignar 'data'

  // Primero, limpiar y parsear todos los campos JSONB
  const jsonbFields = [
    'howDidYouHear', 'cardiovascular', 'ophthalmological', 'psychologicalPsychiatric',
    'diabetes', 'hypertension', 'allergies', 'autoimmuneDiseases', 'hematologicalDiseases',
    'respiratoryDiseases', 'sleepApnea', 'eatingDisorder', 'currentMedicationUse',
    'otherDiseasesNotMentioned', 'smoking', 'drugs', 'alcohol', 'surgeryDetails'
  ];

  for (const field of jsonbFields) {
    if (data[field] && typeof data[field] === 'string') {
      try {
        // Intentar parsear el JSON
        data[field] = JSON.parse(data[field]);
      } catch (e) {
        console.error(`Error parsing JSON for field ${field}:`, data[field], e);
        data[field] = null; // Si el parseo falla, el campo es nulo para evitar errores de DB
      }
    }
    // Si el campo JSONB es nulo/vacío después del parseo o si originalmente era null/""
    // Asegurarse de que sea un objeto vacío si se espera un JSONB y viene vacío
    if (data[field] === null || data[field] === '' || data[field] === undefined) {
      // Re-verificar que realmente es un campo que debería ser un objeto JSONB
      // Esto previene que se inicialicen como {} campos que podrían ser opcionales y no JSONB
      if (jsonbFields.includes(field)) {
          data[field] = {}; // Inicializa con objeto vacío para campos JSONB esperados
      }
    }
  }

  // --- ¡AJUSTE CLAVE! Aplicar limpieza recursiva a TODOS los datos ---
  // Esto limpiará strings "null", "undefined", "" en campos numéricos y otros campos
  data = cleanEmptyValuesRecursively(data);


  // Transformar strings a mayúsculas (se mantiene, pero opera sobre 'null' ya limpios)
  const uppercased = transformStringsToUppercase(data);

  return uppercased;
};