import React, { useState, useEffect } from "react";
import { fetchMaintenanceData } from "helpers/fetchMaintenanceData";
import { isMaintenanceRelevant } from "helpers/isMaintenanceRelevant";
import { sanitizeHtml } from "helpers/sanitizeHtml";
import { useRedux } from "hooks/useRedux";
import { Network, StatusPageScheduled } from "types/types";

const sortMaintenanceSchedule = (schedule: StatusPageScheduled[]) =>
  schedule.sort(
    (a, b) =>
      new Date(a.scheduled_for).getTime() - new Date(b.scheduled_for).getTime(),
  );

export const MaintenanceBanner = () => {
  const { network } = useRedux("network");
  const currentNetwork = network.current.name;
  const [maintenance, setMaintenance] = useState<
    StatusPageScheduled[] | null
  >();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchMaintenanceData();
        setMaintenance(sortMaintenanceSchedule(data));
        setError(null);
      } catch (e) {
        setMaintenance(null);
        setError("Failed to fetch testnet reset date.");
      }
    };

    fetchData();
  }, []);

  const renderBanner = (message: React.ReactNode) => (
    <div
      className="LaboratoryChrome__network_reset_alert s-alert"
      data-testid="maintenance-banner"
    >
      <div className="so-chunk">{message}</div>
    </div>
  );

  if (maintenance === undefined) {
    return renderBanner(error ?? "Loading testnet information…");
  }

  const relevantMaintenance = isMaintenanceRelevant(
    maintenance,
    currentNetwork,
  );

  if (!relevantMaintenance) {
    return currentNetwork === Network.TEST
      ? renderBanner(
          <>
            Failed to fetch testnet reset date. Check status{" "}
            <a
              href="https://9sl3dhr1twv1.statuspage.io/"
              target="_blank"
              rel="noreferrer noopener"
            >
              here
            </a>
            .
          </>,
        )
      : null;
  }

  if (relevantMaintenance.length === 0) {
    return currentNetwork === Network.TEST
      ? renderBanner("The next testnet reset has not yet been scheduled.")
      : null;
  }

  const nextMaintenance = relevantMaintenance[0];
  const date = new Date(nextMaintenance.scheduled_for);

  return renderBanner(
    <>
      <a href={`https://status.stellar.org/incidents/${nextMaintenance.id}`}>
        {nextMaintenance.name}
      </a>{" "}
      on {date.toDateString()} at {date.toTimeString()}
      {nextMaintenance.incident_updates.map((update) => (
        <div key={update.id}>{sanitizeHtml(update.body)}</div>
      ))}
    </>,
  );
};
