import { useState } from "react";
import { useStudentsList } from "../hooks/use.students.list";
import { calculateStatistics } from "../components/statistics/statistics.filters";
import { Source, School, Course } from "../interface/common/enums/enums";
import { Grid } from "../components/common/grid/grid";
import { StatisticsFilterControls } from "../components/statistics/filters/statistics.filter.controls";
import { GeneralStudentStatsSection } from "../components/statistics/sections/general.student.stats.section";
import { CommunicationPreferenceSection } from "../components/statistics/sections/communication.preference.section";
import { EnrollmentSourceSection } from "../components/statistics/sections/enrollment.source.section";
import { GenderDistributionSection } from "../components/statistics/sections/gender.distribution.section";
import { CaptatorsTableSection } from "../components/statistics/sections/captators.table.section";
import { StudentsByLevelSection } from "../components/statistics/sections/students.by.level.section";
import { FeedbackBySchoolCourseSection } from "../components/statistics/sections/feedback.by.school.course.section";

import Constants from "../utils/constants";

const Statistics = () => {
  const { students, error, loading } = useStudentsList();
  const [source, setSource] = useState<Source | null>(null);
  const [school, setSchool] = useState<School | null>(null);
  const [course, setCourse] = useState<Course | null>(null);

  const handleFilterChange = (filters: {
    source?: Source | null;
    school?: School | null;
    course?: Course | null;
  }) => {
    if (filters.source !== undefined) setSource(filters.source);
    if (filters.school !== undefined) setSchool(filters.school);
    if (filters.course !== undefined) setCourse(filters.course);
  };

  if (loading) return <p>Cargando estadísticas...</p>;
  if (error) return <p>Error: {error}</p>;

  if (!students || students.length === 0) {
    return <p>No hay datos disponibles.</p>;
  }

  const filteredStatistics = calculateStatistics({
    students,
    source,
    school,
    course,
  });

  return (
    <div>
      <h1>Estadísticas</h1>

      <StatisticsFilterControls
        selectedSource={source}
        selectedSchool={school}
        selectedCourse={course}
        onFilterChange={handleFilterChange}
      />

      <Grid className="modulos">
        <GeneralStudentStatsSection
          filteredStatistics={filteredStatistics}
          allFeedbacks={Constants.allFeedbacks}
        />
        <CommunicationPreferenceSection
          filteredStatistics={filteredStatistics}
        />
        <EnrollmentSourceSection filteredStatistics={filteredStatistics} />
        <GenderDistributionSection filteredStatistics={filteredStatistics} />
        <CaptatorsTableSection filteredStatistics={filteredStatistics} />
        <StudentsByLevelSection filteredStatistics={filteredStatistics} />
        <FeedbackBySchoolCourseSection
          filteredStatistics={filteredStatistics}
        />
      </Grid>
    </div>
  );
};

export default Statistics;
