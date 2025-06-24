import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import css from "../../../assets/styles/layout/patient.profile.module.scss";
import { Props } from "../../../interface/common/forms/form.renderers";

const isValueEmpty = (val: any): boolean => {
  return (
    val === null ||
    val === undefined ||
    (typeof val === "string" && val.trim() === "") ||
    (typeof val === "number" && isNaN(val))
  );
};

const SelectWithSpecifyDisplay: React.FC<Props> = ({ icon, label, data }) => {
  const selected = data?.selected ?? "";
  const specify = data?.specify ?? "";

  let displayMain = "NO REGISTRADO";
  const details: string[] = [];

  if (!isValueEmpty(selected)) {
    displayMain = selected;
  } else if (!isValueEmpty(specify)) {
    displayMain = "Otros (sin selección principal)";
  }

  if (!isValueEmpty(specify)) {
    details.push(specify);
  }

  return (
    <li className={css.twoLineItem}>
      <div className={css.firstLine}>
        <FontAwesomeIcon icon={icon} className={css.profileIcon} />
        <strong>{label}:</strong> <span>{displayMain}</span>
      </div>
      {details.length > 0 && (
        <div className={css.detailsLine}>{details.join(" | ")}</div>
      )}
    </li>
  );
};

export default SelectWithSpecifyDisplay;
