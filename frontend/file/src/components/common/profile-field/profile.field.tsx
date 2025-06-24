import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import css from "../../../assets/styles/layout/patient.profile.module.scss";

// Interfaz de props
interface ProfileFieldProps {
  icon?: IconDefinition; // <-- ¡AHORA ES OPCIONAL!
  label: string;
  value: string | number | null | undefined;
}

const ProfileField: React.FC<ProfileFieldProps> = ({ icon, label, value }) => (
  <li>
    {icon && <FontAwesomeIcon icon={icon} className={css.profileIcon} />}
    <strong>{label}:</strong> {value !== null && value !== undefined && value !== '' ? String(value) : "NO REGISTRADO"}
  </li>
);

export default ProfileField;