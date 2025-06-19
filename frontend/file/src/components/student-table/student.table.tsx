import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import css from "../../assets/styles/components/student.table.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleRight, faCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { StudentTableProps } from "../../interface/common/statistics/statistics";
import Constants from "../../utils/constants";

export const StudentTable: React.FC<StudentTableProps> = ({
  students,
  title,
  viewProfilePath,
}) => {
  const navigate = useNavigate();
  const [searchRut, setSearchRut] = useState("");
  const [filterFeedback, setFilterFeedback] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 20;

  const memoizedFilteredStudents = useMemo(() => {
    return students.filter((student) => {
      return (
        (searchRut === "" || student.rut?.includes(searchRut)) &&
        (filterFeedback === "" || student.positiveFeedback === filterFeedback)
      );
    });
  }, [students, searchRut, filterFeedback]);

  const totalPages = Math.max(
    1,
    Math.ceil(memoizedFilteredStudents.length / studentsPerPage)
  );
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = memoizedFilteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  const handleViewProfile = (id: string) => {
    navigate(`${viewProfilePath}/${id}`);
  };

  return (
    <>
      <h1>{title}</h1>
      <p className={css.counter}>
        Total de estudiantes: {memoizedFilteredStudents.length}
      </p>

      <div className={css.filters}>
        <input
          type="text"
          placeholder="Buscar por RUT"
          value={searchRut}
          onChange={(e) => {
            setSearchRut(e.target.value);
            setCurrentPage(1);
          }}
        />
        <select
          value={filterFeedback}
          onChange={(e) => {
            setFilterFeedback(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">Todos los estados</option>
          {Constants.allFeedbacks
            .filter((feedbackOption) => feedbackOption !== "")
            .map((feedbackOption) => (
              <option key={feedbackOption} value={feedbackOption}>
                {feedbackOption}
              </option>
            ))}
        </select>
      </div>

      <div className={css.studentTableContainer}>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>RUT</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentStudents.length > 0 ? (
              currentStudents.map((student) => (
                <tr key={student.id || JSON.stringify(student)}>
                  <td>{student.name}</td>
                  <td>{student.lastname}</td>
                  <td>{student.rut}</td>
                  <td>
                    {student.positiveFeedback}
                  </td>
                  <td>
                    <button
                      onClick={() => handleViewProfile(student.id!)}
                      className={css.viewProfileButton}
                    >
                      Ver Perfil
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  style={{ textAlign: "center", padding: "10px" }}
                >
                  No hay estudiantes que coincidan con los filtros aplicados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className={css.pagination}>
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          aria-label="Página anterior"
        >
          <FontAwesomeIcon icon={faCircleLeft} className={css.icons} />
        </button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          aria-label="Página siguiente"
        >
          <FontAwesomeIcon icon={faCircleRight} className={css.icons} />
        </button>
      </div>
    </>
  );
};