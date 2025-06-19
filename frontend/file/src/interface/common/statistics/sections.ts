import { FilteredStatistics } from "./statistics";

export interface CommunicationPreferenceSectionProps {
  filteredStatistics: FilteredStatistics;
}

export interface EnrollmentSourceSectionProps {
  filteredStatistics: FilteredStatistics;
}

export interface FeedbackBySchoolCourseSectionProps {
  filteredStatistics: FilteredStatistics;
}

export interface GenderDistributionSectionProps {
  filteredStatistics: FilteredStatistics;
}

export interface GeneralStudentStatsSectionProps {
  filteredStatistics: FilteredStatistics;
  allFeedbacks: string[];
}

export interface StudentsByLevelSectionProps {
  filteredStatistics: FilteredStatistics;
}

export interface CaptatorsTableSectionProps {
  filteredStatistics: FilteredStatistics;
}
