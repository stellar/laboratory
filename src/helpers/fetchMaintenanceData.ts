import { StatusPageScheduled } from "types/types";

export const fetchMaintenanceData = async (): Promise<
  StatusPageScheduled[]
> => {
  const scheduleResponse = await fetch(
    "https://9sl3dhr1twv1.statuspage.io/api/v2/summary.json",
  );
  const scheduleResponseJson = await scheduleResponse.json();

  return scheduleResponseJson.scheduled_maintenances;
};
