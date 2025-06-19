import Constants from "../../utils/constants";
import { School, Course } from "../common/enums/enums";

type PositiveFeedbackOptions = (typeof Constants.allFeedbacks)[number];

export interface StudentList {
  id: string;
  name: string;
  lastname: string;
  rut?: string;
  positiveFeedback: PositiveFeedbackOptions;
  school?: School;
  course?: Course;
  createdAt?: Date;
}
