import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import css from "../../../assets/styles/layout/patient.profile.module.scss";
import { MedicalConditionDisplayProps } from "../../../interface/common/forms/form.renderers";

const isValueEmpty = (val: any): boolean => {
  return (
    val === null ||
    val === undefined ||
    (typeof val === "string" && val.trim() === "") ||
    (typeof val === "number" && isNaN(val))
  );
};

const MedicalConditionDisplay: React.FC<MedicalConditionDisplayProps> = ({
  icon,
  label,
  data,
}) => {
  const present = data?.present?.toUpperCase?.() || "";
  const type = data?.type;
  const medications = data?.medications;
  const dose = data?.dose;

  const hasPresent = present === "SÍ" || present === "NO";
  const displayPresent = hasPresent ? present : "NO REGISTRADO";

  const details = [];
  if (!isValueEmpty(type)) details.push(`Tipo: ${type}`);
  if (!isValueEmpty(medications)) details.push(`Medicamentos: ${medications}`);
  if (!isValueEmpty(dose)) details.push(`Dosis: ${dose}`);

  const hasDetails = details.length > 0;

  return (
    <li className={css.twoLineItem}>
      <div className={css.firstLine}>
        <FontAwesomeIcon icon={icon} className={css.profileIcon} />{" "}
        <strong>{label}:</strong> {displayPresent}
      </div>
      {hasDetails && (
        <div className={css.detailsLine}>{details.join(" | ")}</div>
      )}
    </li>
  );
};

export default MedicalConditionDisplay;
