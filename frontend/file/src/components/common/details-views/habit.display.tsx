import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import css from "../../../assets/styles/layout/patient.profile.module.scss";
import {
  HabitDisplayProps,
  SmokingData,
  DrugsData,
  AlcoholData,
} from "../../../interface/common/forms/form.renderers";

const HabitDisplay: React.FC<HabitDisplayProps> = ({
  icon,
  label,
  data,
  habitType,
}) => {
  const showYesNo = (val: string | undefined) => {
    if (!val || val.trim() === "") return "NO REGISTRADO";
    return val.toUpperCase(); 
  };

  const isYes = (val?: string) => {
    return val?.trim().toUpperCase() === "SÍ";
  };

  let mainAnswer = "";
  let detail: string | null = null;

  switch (habitType) {
    case "smoking":
      const smoking = data as SmokingData;
      mainAnswer = smoking.isSmoker ?? "";
      if (isYes(smoking.isSmoker)) {
        detail = `Cigarrillos por día: ${
          smoking.cigarettesPerDay ?? "No registrado"
        }`;
      }
      break;

    case "drugs":
      const drugs = data as DrugsData;
      mainAnswer = drugs.usesDrugs ?? "";
      if (isYes(drugs.usesDrugs)) {
        detail = `Tipos: ${drugs.type ?? "No registrado"}`;
      }
      break;

    case "alcohol":
      const alcohol = data as AlcoholData;
      mainAnswer = alcohol.consumesAlcohol ?? "";
      if (isYes(alcohol.consumesAlcohol)) {
        detail = `Frecuencia: ${alcohol.quantity ?? "No registrado"}`;
      }
      break;

    default:
      mainAnswer = "NO REGISTRADO";
  }

  return (
    <li className={css.twoLineItem}>
      <div className={css.firstLine}>
        {icon && <FontAwesomeIcon icon={icon} className={css.profileIcon} />}{" "}
        <strong>{label}:</strong> {showYesNo(mainAnswer)}
      </div>
      {detail && <div className={css.detailsLine}>{detail}</div>}
    </li>
  );
};

export default HabitDisplay;
