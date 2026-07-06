import { useQuery } from "@tanstack/react-query";
import { StatusPageScheduled } from "@/types/types";

export const useMaintenanceData = () => {
  const query = useQuery({
    queryKey: ["maintenanceData"],
    queryFn: async (): Promise<StatusPageScheduled[]> => {
      try {
        const scheduleResponse = await fetch(
          "https://9sl3dhr1twv1.statuspage.io/api/v2/summary.json",
        );
        const scheduleResponseJson = await scheduleResponse.json();

        if (!Array.isArray(scheduleResponseJson.scheduled_maintenances)) {
          throw new Error("Failed to fetch testnet reset date.");
        }

        return scheduleResponseJson.scheduled_maintenances;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        throw Error("Failed to fetch testnet reset date.");
      }
    },
  });

  return query;
};
