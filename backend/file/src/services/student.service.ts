import { Student } from "../models/student.model";
import { HttpError } from "../utils/http.error.util";
import { CreationAttributes } from "sequelize";
import { googleDriveService } from "./google.drive.service";

const createStudent = async (
  studentData: Partial<CreationAttributes<Student>>
): Promise<Omit<Student, "id">> => {
  const { phone, name, lastname } = studentData;

  const validateField = (field: any, fieldName: string): void => {
    if (!field) {
      throw new HttpError(`${fieldName} es obligatorio`, 400);
    }
  };

  validateField(name, "El nombre");
  validateField(lastname, "El apellido");
  validateField(phone, "El número de teléfono");

  const existingStudent = await Student.findOne({ where: { phone } });
  if (existingStudent) {
    throw new HttpError("El número de teléfono ya está registrado", 409);
  }

  const newStudent = await Student.create(studentData);
  const { id, ...studentWithoutId } = newStudent.toJSON();

  return studentWithoutId;
};

const getStudentById = async (id: string): Promise<Student> => {
  const student = await Student.findByPk(id);
  if (!student) throw new HttpError("El ID de estudiante no es válido", 404);
  return student;
};

const getStudentByEmail = async (email: string): Promise<Student> => {
  const student = await Student.findOne({ where: { email } });
  if (!student) throw new HttpError("El email no se encuentra registrado", 404);
  return student;
};

const deleteStudentById = async (id: string): Promise<Student> => {
  const student = await Student.findByPk(id);
  if (!student) {
    throw new HttpError("No se encontró el estudiante para eliminar", 404);
  }

  if (student.studentImageDriveId) {
    await googleDriveService.deleteFile(student.studentImageDriveId);
  }
  if (student.birthCertificateDriveId) {
    await googleDriveService.deleteFile(student.birthCertificateDriveId);
  }
  if (student.studyCertificateDriveId) {
    await googleDriveService.deleteFile(student.studyCertificateDriveId);
  }
  if (student.linkDniDriveId) {
    await googleDriveService.deleteFile(student.linkDniDriveId);
  }

  await student.destroy();
  return student;
};

const updateStudentById = async (
  id: string,
  studentData: Partial<Student>
): Promise<Omit<Student, "id">> => {
  const studentToUpdate = await Student.findByPk(id);
  if (!studentToUpdate) {
    throw new HttpError(
      "No se pudo actualizar el estudiante: ID inválido",
      400
    );
  }

  if (
    studentData.studentImage === null &&
    studentToUpdate.studentImageDriveId
  ) {
    await googleDriveService.deleteFile(studentToUpdate.studentImageDriveId);
    studentData.studentImageDriveId = null;
  }
  if (
    studentData.birthCertificate === null &&
    studentToUpdate.birthCertificateDriveId
  ) {
    await googleDriveService.deleteFile(
      studentToUpdate.birthCertificateDriveId
    );
    studentData.birthCertificateDriveId = null;
  }
  if (
    studentData.studyCertificate === null &&
    studentToUpdate.studyCertificateDriveId
  ) {
    await googleDriveService.deleteFile(
      studentToUpdate.studyCertificateDriveId
    );
    studentData.studyCertificateDriveId = null;
  }
  if (studentData.linkDni === null && studentToUpdate.linkDniDriveId) {
    await googleDriveService.deleteFile(studentToUpdate.linkDniDriveId);
    studentData.linkDniDriveId = null;
  }

  await studentToUpdate.update(studentData);

  const { id: studentId, ...studentWithoutId } = studentToUpdate.toJSON();

  return studentWithoutId;
};

const getAllStudents = async (): Promise<Student[]> => {
  const students = await Student.findAll();
  if (!students.length) {
    throw new HttpError("No se encontraron estudiantes registrados", 404);
  }

  return students.map((student) => student.toJSON());
};

export const studentService = {
  createStudent,
  getStudentById,
  getStudentByEmail,
  deleteStudentById,
  updateStudentById,
  getAllStudents,
};
