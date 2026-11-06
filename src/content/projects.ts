import type { Project } from "./types";
import { cleanMessyCustomersProject } from "./projects/clean-messy-customers";
import { exploreSurveyProject } from "./projects/explore-survey";
import { studentPerformanceProject } from "./projects/student-performance";
import { salesTrendsProject } from "./projects/sales-trends";
import { patientHealthProject } from "./projects/patient-health";
import { housingEdaCapstoneProject } from "./projects/housing-eda-capstone";

/**
 * Module 10 guided projects, in the order they appear on the site.
 * Each project lives in its own file under ./projects/.
 */
export const projects: Project[] = [
  cleanMessyCustomersProject,
  exploreSurveyProject,
  studentPerformanceProject,
  salesTrendsProject,
  patientHealthProject,
  housingEdaCapstoneProject,
];
