import React from "react";
import { Banner, Link } from "@stellar/design-system";

import { getRelevantMaintenanceMsg } from "@/helpers/getRelevantMaintenanceMsg";
import { sanitizeHtml } from "@/helpers/sanitizeHtml";
import { useMaintenanceData } from "@/query/useMaintenanceData";
import { useStore } from "@/store/useStore";

export const MaintenanceBanner = () => {
  const { network } = useStore();
  const { data, error, isFetching, isLoading } = useMaintenanceData();

  const relevantMaintenance = getRelevantMaintenanceMsg(network.id, data);

  const renderBanner = (message: React.ReactNode) => (
    <div className="MaintenanceBanner">
      <Banner variant="primary">{message}</Banner>
    </div>
  );

  if (isFetching || isLoading) {
    return null;
  }

  if (error) {
    return renderBanner(error.message);
  }

  if (!relevantMaintenance) {
    return network.id === "testnet"
      ? renderBanner(
          <>
            Failed to fetch testnet reset date. Check status{" "}
            <Link href="https://9sl3dhr1twv1.statuspage.io/">here</Link>.
          </>,
        )
      : null;
  }

  if (relevantMaintenance.length === 0) {
    return network.id === "testnet"
      ? renderBanner("The next testnet reset has not yet been scheduled.")
      : null;
  }

  const nextMaintenance = relevantMaintenance[0];
  const date = new Date(nextMaintenance.scheduled_for);

  return renderBanner(
    <>
      <Link href={`https://status.stellar.org/incidents/${nextMaintenance.id}`}>
        {nextMaintenance.name}
      </Link>{" "}
      on {date.toDateString()} at {date.toTimeString()}
      {nextMaintenance.incident_updates.map((update) => (
        <div key={update.id}>{sanitizeHtml(update.body)}</div>
      ))}
    </>,
  );
};
