// src/hooks/use.patient.profile.ts

import { useState, useEffect, useCallback } from "react";
import {
  fetchPatient,
  updatePatient,
  deletePatient,
} from "../../utils/api/fetch.patient";
import { toast } from "react-toastify";
import { mapPatientToFormData } from "../../utils/form/patient.form.mapper";
import { initialPatientData } from "../../constants/patient/patient.initial.state";
import { normalizePatientData } from "../../utils/patients/normalize.patient";
import type { PatientData } from "../../interface/patient/patient.interface.props";

export const usePatientProfile = (
  id: string | undefined,
  token: string | null | undefined
) => {
  const [patient, setPatient] = useState<PatientData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState<PatientData | null>(null);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      setIsNotFound(false);
      if (!id) {
        setIsNotFound(true);
        setError("ID de paciente no proporcionado.");
        return;
      }
      if (!token) {
        setError("Token de autenticación no proporcionado.");
        return;
      }
      try {
        const fetchedData: PatientData = await fetchPatient(id, token);
        const normalizedData = normalizePatientData(fetchedData);
        setPatient(normalizedData);
        setUpdatedData(normalizedData);
      } catch (err: any) {
        if (
          err.message?.includes("no se encontraron datos") ||
          err.message?.includes("404") ||
          err.message?.includes("not found") ||
          err.message?.includes("ID de paciente no es válido")
        ) {
          setIsNotFound(true);
          setError(null);
        } else {
          setError(
            err.message || "Error desconocido al cargar la ficha clínica."
          );
          setIsNotFound(false);
        }
      }
    };

    fetchData();
  }, [id, token]);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
    setUpdatedData(patient || initialPatientData);
  }, [patient]);

  const handleChange = useCallback((e: any) => {
    setUpdatedData((prevData) => {
      if (!prevData) return { ...initialPatientData };

      const updateNested = (obj: any, path: string[], val: any) => {
        const newObj = JSON.parse(JSON.stringify(obj));
        let current = newObj;
        for (let i = 0; i < path.length - 1; i++) {
          if (!current[path[i]]) current[path[i]] = {};
          current[path[i]] = { ...current[path[i]] };
          current = current[path[i]];
        }
        current[path[path.length - 1]] = val;
        return newObj;
      };

      const target = "target" in e ? e.target : e;
      const name = target.name;
      const value = "value" in target ? target.value : undefined;
      const type = "type" in target ? target.type : undefined;
      const files =
        target instanceof HTMLInputElement && target.type === "file"
          ? target.files
          : null;

      const path = name.split(".");

      if (type === "file" && files && files.length > 0) {
        return updateNested(prevData, path, files[0]);
      }

      if (
        !("target" in e) &&
        e.value === null &&
        ["document1", "document2", "document3"].includes(name)
      ) {
        return updateNested(prevData, path, null);
      }

      if (type === "select") {
        const isOtherSelectedValue = value === "Otros";

        if (path.length > 1 && path[path.length - 1] === "selected") {
          const sectionPath = path.slice(0, path.length - 1);
          let current = sectionPath.reduce(
            (obj: any, key: string) => obj[key],
            prevData
          );
          current = { ...current, selected: value };
          if (!isOtherSelectedValue) current.specify = "";
          return updateNested(prevData, sectionPath, current);
        }

        if (
          path.length > 1 &&
          (path[path.length - 1] === "present" ||
            ["isSmoker", "usesDrugs", "consumesAlcohol"].includes(
              path[path.length - 1]
            ))
        ) {
          const sectionName = path[0];
          const fieldName = path[1];
          let section = { ...(prevData as any)[sectionName] };

          section[fieldName] = value;

          if (value === "NO" || value === "") {
            if (sectionName === "smoking") section.cigarettesPerDay = null;
            else if (sectionName === "drugs") section.type = "";
            else if (sectionName === "alcohol") section.quantity = "";
            else if (sectionName === "currentMedicationUse")
              section.specify = "";
            else
              section = { present: "NO", type: "", medications: "", dose: "" };
          }

          return updateNested(prevData, [sectionName], section);
        }

        return updateNested(prevData, [name], value);
      }

      const parsedValue =
        type === "number" ? (value === "" ? undefined : Number(value)) : value;
      return updateNested(prevData, path, parsedValue);
    });
  }, []);

  const handleDeleteFile = useCallback(
    (fieldName: keyof PatientData) => {
      handleChange({ name: fieldName, value: null });
    },
    [handleChange]
  );

  const handleSubmitEdit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!updatedData || !id || !token) {
        toast.error("Falta información para actualizar el paciente.", {
          position: "top-right",
        });
        return;
      }

      const formData = mapPatientToFormData(updatedData);

      try {
        const data = await updatePatient(id, token, formData);
        const normalized = normalizePatientData(data);
        setPatient(normalized);
        setUpdatedData(normalized);
        setIsEditing(false);
        toast.success("Ficha clínica actualizada con éxito", {
          position: "top-right",
        });
      } catch (error: any) {
        toast.error(
          error.message || "Error inesperado al actualizar la ficha clínica",
          {
            position: "top-right",
          }
        );
      }
    },
    [updatedData, id, token]
  );

  const handleDelete = useCallback(async () => {
    if (!id || !token) return;
    if (
      !window.confirm(
        "¿Estás seguro de eliminar esta ficha clínica? Esta acción es irreversible."
      )
    )
      return;
    try {
      await deletePatient(id, token);
      setIsDeleted(true);
      toast.success("Ficha clínica eliminada con éxito", {
        position: "top-right",
      });
    } catch (error: any) {
      toast.error(error.message || "Error al eliminar la ficha clínica", {
        position: "top-right",
      });
    }
  }, [id, token]);

  return {
    patient,
    error,
    isEditing,
    updatedData,
    handleEdit,
    handleChange,
    handleSubmitEdit,
    handleDelete,
    isDeleted,
    isNotFound,
    handleDeleteFile,
  };
};
