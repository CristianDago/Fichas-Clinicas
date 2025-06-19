import type { Student } from "../student/student";
import type { ChangeEvent } from "react";

export interface UseDocumentHandlingHookResult {
  handleFileChange: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleDeleteFile: (fieldName: keyof Student) => void;
  getLabelForField: (fieldName: keyof Student) => string;
}

export interface UseDocumentHandlingHookProps {
  onChange: (
    e:
      | ChangeEvent<HTMLInputElement>
      | { name: keyof Student; value: File | null }
  ) => void;
  onDeleteFile: (fieldName: keyof Student) => void;
}
