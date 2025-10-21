import React, { useState } from "react";
import { Badge, Icon, IconButton, Link } from "@stellar/design-system";

import { getRelevantMaintenanceMsg } from "@/helpers/getRelevantMaintenanceMsg";
import { sanitizeHtml } from "@/helpers/sanitizeHtml";
import { useMaintenanceData } from "@/query/useMaintenanceData";
import { useStore } from "@/store/useStore";

import { Box } from "@/components/layout/Box";
import { ExpandBox } from "@/components/ExpandBox";

export const MaintenanceBanner = () => {
  const { network } = useStore();
  const { data, error, isFetching, isLoading } = useMaintenanceData();

  const [isMsgExpanded, setIsMsgExpanded] = useState(false);

  const relevantMaintenance = getRelevantMaintenanceMsg(network.id, data);

  const renderBanner = (message: React.ReactNode) => (
    <div className="MaintenanceBanner">{message}</div>
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
    return null;
  }

  const nextMaintenance = relevantMaintenance[0];
  const date = new Date(nextMaintenance.scheduled_for);

  const getDaysLeftText = (toDate: Date) => {
    const today = new Date();

    // Reset times to midnight to get accurate day difference
    const normalizedToDate = new Date(
      toDate.getFullYear(),
      toDate.getMonth(),
      toDate.getDate(),
    );
    const normalizedToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );

    const diffTime = normalizedToDate.getTime() - normalizedToday.getTime();
    const daysLeft = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (daysLeft === 0) {
      return "today";
    }

    if (daysLeft === 1) {
      return "tomorrow";
    }

    return `${daysLeft} days left`;
  };

  return renderBanner(
    <Box gap="md">
      <Box
        gap="sm"
        direction="row"
        align="center"
        justify="center"
        addlClassName="MaintenanceBanner__header"
      >
        <Icon.InfoCircle />

        <Link
          href={`https://status.stellar.org/incidents/${nextMaintenance.id}`}
        >
          {nextMaintenance.name}
        </Link>

        <Badge variant="tertiary" size="sm">
          {getDaysLeftText(date)}
        </Badge>

        <IconButton
          icon={<Icon.ChevronDown />}
          customSize="16px"
          customColor="var(--sds-clr-gray-09)"
          altText={isMsgExpanded ? "Show less" : "Show more"}
          onClick={() => setIsMsgExpanded(!isMsgExpanded)}
          data-is-expanded={isMsgExpanded}
        />
      </Box>
      <ExpandBox offsetTop="md" isExpanded={isMsgExpanded}>
        <div className="MaintenanceBanner__message">
          on {date.toDateString()} at {date.toTimeString()}
          {nextMaintenance.incident_updates.map((update) => (
            <div key={update.id}>{sanitizeHtml(update.body)}</div>
          ))}
        </div>
      </ExpandBox>
    </Box>,
  );
};
