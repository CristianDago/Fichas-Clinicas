import { useCallback } from "react";
import type { Student } from "../interface/student/student";
import type { ChangeEvent } from "react";
import {
  UseDocumentHandlingHookProps,
  UseDocumentHandlingHookResult,
} from "../interface/hooks/document.handling";

export const useDocumentHandling = ({
  onChange,
}: UseDocumentHandlingHookProps): UseDocumentHandlingHookResult => {
  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      if (e.target instanceof HTMLInputElement && e.target.type === "file") {
        const { name, files } = e.target;
        if (files && files.length > 0) {
          onChange({ name: name as keyof Student, value: files[0] });
        }
      } else {
        console.warn(
          "handleFileChange recibió un evento de tipo inesperado para un input de archivo:",
          e.target.tagName,
          e.target.type
        );
      }
    },
    [onChange]
  );

  const handleDeleteFile = useCallback(
    (fieldName: keyof Student) => {
      if (
        window.confirm(
          `¿Estás seguro de eliminar ${getLabelForField(
            fieldName
          ).toLowerCase()}?`
        )
      ) {
        onChange({ name: fieldName, value: null });
      }
    },
    [onChange]
  );

  const getLabelForField = useCallback((fieldName: keyof Student): string => {
    switch (fieldName) {
      case "studentImage":
        return "Foto del Estudiante";
      case "birthCertificate":
        return "Certificado de nacimiento";
      case "studyCertificate":
        return "Certificado de estudio";
      case "linkDni":
        return "Cédula de identidad";
      default:
        return "";
    }
  }, []);

  return { handleFileChange, handleDeleteFile, getLabelForField };
};
