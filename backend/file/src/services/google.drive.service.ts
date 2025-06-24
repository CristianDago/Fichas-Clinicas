import { getGoogleDriveService } from "../config/google.drive";
import { drive_v3 } from "googleapis";
import fs from "fs";
import { Readable } from "stream"; 

let _driveInstance: drive_v3.Drive | null = null;

const getDriveInstance = async (): Promise<drive_v3.Drive> => {
  if (!_driveInstance) {
    _driveInstance = await getGoogleDriveService();
  }
  return _driveInstance;
};

export const uploadFileToDrive = async (
  filePath: string,
  fileName: string
): Promise<any> => {
  try {
    const drive = await getDriveInstance();
    const fileMetadata: any = {
      name: fileName,
    };
    const parents = process.env.GOOGLE_DRIVE_FOLDER_ID
      ? [process.env.GOOGLE_DRIVE_FOLDER_ID]
      : [];
    if (parents.length > 0) {
      fileMetadata.parents = parents;
    }

    const media = {
      mimeType: "image/jpeg",
      body: fs.createReadStream(filePath),
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id, webViewLink, webContentLink",
    });
    return response.data;
  } catch (error: any) {
    console.error("Error al subir el archivo a Google Drive:", error);
    throw error;
  }
};

export const setFilePublic = async (fileId: string): Promise<void> => {
  try {
    const drive = await getDriveInstance();
    await drive.permissions.create({
      fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });
  } catch (error: any) {
    console.error(`Error al hacer el archivo ${fileId} público:`, error);
    throw error;
  }
};

export const googleDriveService = {
  async deleteFile(fileId: string): Promise<void> {
    try {
      const drive = await getDriveInstance();
      await drive.files.delete({
        fileId: fileId,
      });
      console.log(`Archivo con ID ${fileId} eliminado de Google Drive.`);
    } catch (error: any) {
      console.error(
        `Error al eliminar el archivo ${fileId} de Google Drive:`,
        error
      );
      throw error;
    }
  },
};