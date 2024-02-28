import { useQuery } from "@tanstack/react-query";
import { StatusPageScheduled } from "@/types/types";

export const useMaintenanceData = () => {
  const query = useQuery<StatusPageScheduled[]>({
    queryKey: ["maintenanceData"],
    queryFn: async () => {
      try {
        const scheduleResponse = await fetch(
          "https://9sl3dhr1twv1.statuspage.io/api/v2/summary.json",
        );
        const scheduleResponseJson = await scheduleResponse.json();

        return scheduleResponseJson.scheduled_maintenances;
      } catch (e) {
        throw Error("Failed to fetch testnet reset date.");
      }
    },
  });

  return query;
};
