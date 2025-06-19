import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import css from "../../../assets/styles/layout/student.profile.module.scss";
import { ProfileFieldProps } from "../../../interface/common/profile-field/profile.field";

const ProfileField: React.FC<ProfileFieldProps> = ({ icon, label, value }) => (
  <li>
    <FontAwesomeIcon icon={icon} className={css.profileIcon} />{" "}
    <strong>{label}:</strong> {value || "NO REGISTRADO"}
  </li>
);

export default ProfileField;
