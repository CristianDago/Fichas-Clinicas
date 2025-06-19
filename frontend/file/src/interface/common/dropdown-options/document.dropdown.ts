import type { CSSProperties } from "react";

export interface DropdownOption {
  label: string;
  path: string;
}

export interface DropdownOptionsProps {
  options: DropdownOption[];
  className?: string;
  style?: CSSProperties;
}
