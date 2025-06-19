import type { Student } from "../interface/student/student";

export const mapStudentToFormData = (
  studentData: Partial<Student>
): FormData => {
  const formData = new FormData();

  Object.entries(studentData).forEach(([key, value]) => {
    if (value === null) {
      if (
        [
          "studentImage",
          "birthCertificate",
          "studyCertificate",
          "linkDni",
        ].includes(key)
      ) {
        formData.append(`${key}_delete`, "true");
      }
    } else if (value instanceof File) {
      formData.append(key, value);
    } else if (
      typeof value === "string" &&
      [
        "studentImage",
        "birthCertificate",
        "studyCertificate",
        "linkDni",
      ].includes(key) &&
      value.startsWith("http")
    ) {
      formData.append(`${key}_url`, value);
    } else if (typeof value !== "object" && value !== undefined) {
      formData.append(key, String(value));
    }
  });

  return formData;
};
