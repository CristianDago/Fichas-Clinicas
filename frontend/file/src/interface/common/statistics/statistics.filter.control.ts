import { School, Source, Course } from "../enums/enums";

export interface StatisticsFilterControlsProps {
  selectedSource: Source | null;
  selectedSchool: School | null;
  selectedCourse: Course | null;
  onFilterChange: (filters: {
    source?: Source | null;
    school?: School | null;
    course?: Course | null;
  }) => void;
}
