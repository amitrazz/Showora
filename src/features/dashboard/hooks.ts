import { useQuery } from "@tanstack/react-query";
import { getDashboardMetrics } from "./services";

export const useDashboardMetrics = () => {
  return useQuery({
    queryKey: ["dashboard-metrics"],
    queryFn: getDashboardMetrics,
  });
};
