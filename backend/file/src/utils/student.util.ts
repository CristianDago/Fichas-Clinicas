import { MulterRequest } from "../interfaces/express.interface";
import {
  uploadFileToDrive,
  setFilePublic,
} from "../services/google.drive.service";
import fs from "fs";
import path from "path";
import { DateTime } from "luxon";

export function transformStringsToUppercase(obj: any): any {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  const transformedObj: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      if (typeof value === "string" && value !== "undefined") {
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
    return null;
  }
};

export const processStudentFiles = async (
  req: MulterRequest
): Promise<{
  studentImage?: { link: string | null; id: string | null };
  birthCertificate?: { link: string | null; id: string | null };
  studyCertificate?: { link: string | null; id: string | null };
  linkDni?: { link: string | null; id: string | null };
}> => {
  const files = req.files as
    | { [fieldname: string]: Express.Multer.File[] }
    | undefined;

  const uploadedFiles: {
    studentImage?: { link: string | null; id: string | null };
    birthCertificate?: { link: string | null; id: string | null };
    studyCertificate?: { link: string | null; id: string | null };
    linkDni?: { link: string | null; id: string | null };
  } = {};

  if (files?.["studentImage"]?.[0]) {
    const uploaded = await handleFileUpload(files["studentImage"][0]);
    uploadedFiles.studentImage = {
      link: uploaded?.link ?? null,
      id: uploaded?.id ?? null,
    };
  } else {
    uploadedFiles.studentImage = { link: null, id: null };
  }

  if (files?.["birthCertificate"]?.[0]) {
    const uploaded = await handleFileUpload(files["birthCertificate"][0]);
    uploadedFiles.birthCertificate = {
      link: uploaded?.link ?? null,
      id: uploaded?.id ?? null,
    };
  } else {
    uploadedFiles.birthCertificate = { link: null, id: null };
  }

  if (files?.["studyCertificate"]?.[0]) {
    const uploaded = await handleFileUpload(files["studyCertificate"][0]);
    uploadedFiles.studyCertificate = {
      link: uploaded?.link ?? null,
      id: uploaded?.id ?? null,
    };
  } else {
    uploadedFiles.studyCertificate = { link: null, id: null };
  }

  if (files?.["linkDni"]?.[0]) {
    const uploaded = await handleFileUpload(files["linkDni"][0]);
    uploadedFiles.linkDni = {
      link: uploaded?.link ?? null,
      id: uploaded?.id ?? null,
    };
  } else {
    uploadedFiles.linkDni = { link: null, id: null };
  }

  return uploadedFiles;
};

export const normalizeStudentData = (rawData: any): any => {
  const data = { ...rawData };

  for (const key in data) {
    if (data[key] === "undefined") {
      data[key] = null;
    }
  }

  const uppercased = transformStringsToUppercase(data);

  if (uppercased.birthdate) {
    uppercased.birthdate = DateTime.fromISO(uppercased.birthdate).toJSDate();
  }

  if (uppercased.contactDate) {
    uppercased.contactDate = DateTime.fromISO(
      uppercased.contactDate
    ).toJSDate();
  }

  return uppercased;
};
