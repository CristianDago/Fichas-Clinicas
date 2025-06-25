import { ChangeEvent } from "react";
import { PatientData } from "../../patient/patient.interface.props";

export interface AddPatientFormProps {
  patientData: PatientData;
  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  handleSubmit: (e: React.FormEvent) => void;
}
