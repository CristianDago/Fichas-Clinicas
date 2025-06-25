export interface UseDocumentHandlingHookProps<T> {
    onChange: (e: { name: keyof T; value: File | null }) => void;
  }
  
  export interface UseDocumentHandlingHookResult<T> {
    handleFileChange: (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => void;
    handleDeleteFile: (fieldName: keyof T) => void;
    getLabelForField: (fieldName: keyof T) => string;
  }
  