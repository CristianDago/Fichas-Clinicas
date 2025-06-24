import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
    return val.toUpperCase(); // Uniformamos para comparación
  };

  const isYes = (val?: string) => {
    return val?.trim().toUpperCase() === "SÍ";
  };

  const renderContent = () => {
    if (typeof data === "string") return showYesNo(data);

    switch (habitType) {
      case "smoking":
        const smoking = data as SmokingData;
        return (
          <>
            <div className="detailsLine">{showYesNo(smoking.isSmoker)}</div>
            {isYes(smoking.isSmoker) && (
              <div className="detailsLine">
                Cigarrillos por día:{" "}
                {smoking.cigarettesPerDay ?? "No registrado"}
              </div>
            )}
          </>
        );
      case "drugs":
        const drugs = data as DrugsData;
        return (
          <>
            <div className="detailsLine">{showYesNo(drugs.usesDrugs)}</div>
            {isYes(drugs.usesDrugs) && (
              <div className="detailsLine">
                Tipo: {drugs.type ?? "No registrado"}
              </div>
            )}
          </>
        );
      case "alcohol":
        const alcohol = data as AlcoholData;
        return (
          <>
            <div className="detailsLine">
              {showYesNo(alcohol.consumesAlcohol)}
            </div>
            {isYes(alcohol.consumesAlcohol) && (
              <div className="detailsLine">
                Cantidad: {alcohol.quantity ?? "No registrado"}
              </div>
            )}
          </>
        );
      default:
        return "NO REGISTRADO";
    }
  };

  return (
    <li className={`detailsContainer ${habitType}`}>
      {icon && <FontAwesomeIcon icon={icon} className="detailsIcon" />}
      <div className="detailsContent">
        <strong>{label}:</strong>
        {renderContent()}
      </div>
    </li>
  );
};

export default HabitDisplay;
