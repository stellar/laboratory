import { Network, StatusPageScheduled } from "types/types.d";

// If we’re on the test network, we care about all scheduled maintenance. If
// we’re on the public network, we only care about public network maintenance.
export const isMaintenanceRelevant = (
  allMaintenance: StatusPageScheduled[] | null | undefined,
  currentNetwork: string,
) => {
  if (!allMaintenance) {
    return false;
  }

  return allMaintenance.filter((maintenance) =>
    maintenance.components.some((component) =>
      currentNetwork === Network.TEST
        ? true
        : component.name === "Stellar Public Network",
    ),
  );
};
