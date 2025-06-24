import { getGoogleDriveService } from "../config/google.drive";
import { drive_v3 } from "googleapis"; // Importa el tipo drive_v3.Drive
import fs from "fs";
import { Readable } from "stream"; // Aunque no se usa directamente en este fragmento, se mantiene si es parte de tu setup.

let _driveInstance: drive_v3.Drive | null = null;

// Helper para obtener la instancia de Google Drive (se mantiene)
const getDriveInstance = async (): Promise<drive_v3.Drive> => {
  if (!_driveInstance) {
    _driveInstance = await getGoogleDriveService();
  }
  return _driveInstance;
};

// Función para subir archivos a Drive (se mantiene)
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
      mimeType: "image/jpeg", // Asegúrate de que este MIME type sea genérico o adaptado al tipo de archivo
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

// Función para hacer público un archivo (se mantiene)
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

// --- ¡AJUSTE CLAVE! Eliminada la función 'deleteFile' duplicada y errónea.
// La única función de borrado de archivos es la que está dentro de googleDriveService.
// Este objeto es el que debe exportar las funciones que se usarán en otros servicios.
export const googleDriveService = {
  // Función para eliminar archivos de Drive (¡esta es la que usaremos en el servicio!)
  async deleteFile(fileId: string): Promise<void> {
    try {
      const drive = await getDriveInstance(); // <-- Obtiene la instancia de drive aquí
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