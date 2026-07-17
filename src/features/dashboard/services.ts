import { DashboardMetrics } from "./types";
import { dashboardData } from "./data";

export const getDashboardMetrics = async (): Promise<DashboardMetrics> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 600));
  return dashboardData;
};
