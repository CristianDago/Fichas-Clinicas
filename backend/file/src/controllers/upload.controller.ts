import { Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  uploadFileToDrive,
  setFilePublic,
} from "../services/google.drive.service";

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

export const uploadImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "No se ha subido ningún archivo." });
    }

    const filePath = path.join("uploads", req.file.filename);

    const uploadedFile = await uploadFileToDrive(filePath, req.file.filename);

    await setFilePublic(uploadedFile.id ?? "");

    fs.unlinkSync(filePath);

    res.json({
      message: "Archivo subido exitosamente",
      link: uploadedFile.webViewLink || uploadedFile.webContentLink,
      id: uploadedFile.id,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al subir la imagen", error });
  }
};
