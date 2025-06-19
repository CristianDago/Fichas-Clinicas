// src/interface/common/forms/form.input.props.ts

import { ChangeEvent } from 'react';

// Interfaz para las opciones de select
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

// Interfaz principal de propiedades para el componente FormInput
export interface FormInputProps {
  label: string;
  name: string;
  id?: string;
  type: 'text' | 'number' | 'email' | 'tel' | 'date' | 'select' | 'textarea' | 'checkbox' | 'file' | 'radio' | 'password';

  value?: string | number | boolean | File | null | string[];

  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;

  required?: boolean;
  placeholder?: string;
  options?: SelectOption[]; // <-- ¡Asegúrate de que 'options' es opcional!
  multiple?: boolean;

  checked?: boolean;
  accept?: string;
  gridColumn?: string;
  autocomplete?: string;
}