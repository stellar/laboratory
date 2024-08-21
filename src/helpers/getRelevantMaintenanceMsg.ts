import { NetworkType, StatusPageScheduled } from "@/types/types";

export const getRelevantMaintenanceMsg = (
  currentNetwork: NetworkType,
  allMaintenance?: StatusPageScheduled[],
) => {
  if (!allMaintenance) {
    return false;
  }

  // If we’re on the test network, we care about all scheduled maintenance. If
  // we’re on the public network, we only care about public network maintenance.
  return allMaintenance.filter((maintenance) =>
    maintenance.components.some((component) =>
      currentNetwork === "testnet"
        ? true
        : component.name === "Stellar Public Network",
    ),
  );
};
