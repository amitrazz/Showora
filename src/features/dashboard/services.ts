import { DashboardMetrics } from "./types";
import { api } from "@/lib/api";

export const getDashboardMetrics = async (): Promise<DashboardMetrics> => {
  const response = await api.get<DashboardMetrics>('/dashboard/metrics');
  return response.data;
};
