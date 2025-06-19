import { NextFunction, Request, Response } from "express";
import { studentService } from "../services/student.service";
import { MulterRequest } from "../interfaces/express.interface";
import {
  processStudentFiles,
  normalizeStudentData,
} from "../utils/student.util";
import { Student as StudentInterface } from "../models/student.model";

const createStudentHandler = async (
  req: MulterRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let studentData = normalizeStudentData(req.body);
    const uploadedFileDetails = await processStudentFiles(req);
    const newStudentData = {
      ...studentData,
      studentImage: uploadedFileDetails.studentImage?.link,
      studentImageDriveId: uploadedFileDetails.studentImage?.id,
      birthCertificate: uploadedFileDetails.birthCertificate?.link,
      birthCertificateDriveId: uploadedFileDetails.birthCertificate?.id,
      studyCertificate: uploadedFileDetails.studyCertificate?.link,
      studyCertificateDriveId: uploadedFileDetails.studyCertificate?.id,
      linkDni: uploadedFileDetails.linkDni?.link,
      linkDniDriveId: uploadedFileDetails.linkDni?.id,
    };

    const newStudent = await studentService.createStudent(newStudentData);
    res.json(newStudent);
  } catch (error) {
    next(error);
  }
};

const getStudentByIdHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const student = await studentService.getStudentById(id);
    res.json(student);
  } catch (error) {
    next(error);
  }
};

const updateStudentHandler = async (
  req: MulterRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const existingStudent = (await studentService.getStudentById(
      id
    )) as StudentInterface;
    if (!existingStudent) {
      return res.status(404).json({ message: "Estudiante no encontrado" });
    }

    const studentData = normalizeStudentData(req.body);
    const uploadedFileDetails = await processStudentFiles(req);

    const updatedData: any = { ...studentData };
    const fileFields = [
      { field: "studentImage", driveIdField: "studentImageDriveId" },
      { field: "birthCertificate", driveIdField: "birthCertificateDriveId" },
      { field: "studyCertificate", driveIdField: "studyCertificateDriveId" },
      { field: "linkDni", driveIdField: "linkDniDriveId" },
    ];

    for (const { field, driveIdField } of fileFields) {
      const fileDetails =
        uploadedFileDetails[field as keyof typeof uploadedFileDetails];

      if (req.body[`${field}_delete`] === "true") {
        updatedData[field] = null;
        updatedData[driveIdField] = null;
      } else {
        updatedData[field] =
          fileDetails?.link ?? existingStudent[field as keyof StudentInterface];
        updatedData[driveIdField] =
          fileDetails?.id ??
          existingStudent[driveIdField as keyof StudentInterface];
      }
    }

    const updatedStudent = await studentService.updateStudentById(
      id,
      updatedData
    );
    res.json(updatedStudent);
  } catch (error) {
    next(error);
  }
};

const deleteStudentHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const deletedStudent = await studentService.deleteStudentById(id);
    res.json(deletedStudent);
  } catch (error) {
    next(error);
  }
};

const getAllStudentsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const students = await studentService.getAllStudents();
    res.json(students);
  } catch (error) {
    next(error);
  }
};

export const studentController = {
  createStudentHandler,
  getStudentByIdHandler,
  updateStudentHandler,
  deleteStudentHandler,
  getAllStudentsHandler,
};
