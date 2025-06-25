// ✅ use.document.handling.ts
import { useCallback } from "react";
import {
  UseDocumentHandlingHookProps,
  UseDocumentHandlingHookResult,
} from "../../interface/hooks/document.handling.props";

export const useDocumentHandling = <T = any>({
  onChange,
}: UseDocumentHandlingHookProps<T>): UseDocumentHandlingHookResult<T> => {
  const handleFileChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  > = useCallback(
    (e) => {
      if (e.target instanceof HTMLInputElement && e.target.type === "file") {
        const { name, files } = e.target;
        if (files && files.length > 0) {
          onChange({ name: name as keyof T, value: files[0] });
        }
      } else {
        console.warn(
          "handleFileChange recibió un evento de tipo inesperado:",
          e.target.tagName,
          e.target.type
        );
      }
    },
    [onChange]
  );

  const handleDeleteFile = useCallback(
    (fieldName: keyof T) => {
      if (
        window.confirm(
          `¿Estás seguro de eliminar ${getLabelForField(
            fieldName
          ).toLowerCase()}?`
        )
      ) {
        // Enviar string "null" para que el backend lo interprete como null
        onChange({ name: fieldName, value: "null" as unknown as File });
      }
    },
    [onChange]
  );

  const getLabelForField = useCallback((fieldName: keyof T): string => {
    const labels: Record<string, string> = {
      document1: "Documento 1",
      document2: "Documento 2",
      document3: "Documento 3",
    };
    return labels[String(fieldName)] || String(fieldName);
  }, []);

  return { handleFileChange, handleDeleteFile, getLabelForField };
};
