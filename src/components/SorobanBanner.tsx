import React from "react";
import { useRedux } from "hooks/useRedux";
import { useIsSoroban } from "hooks/useIsSoroban";

export const SorobanBanner = () => {
  const { routing } = useRedux("routing");

  let isSoroban = useIsSoroban();

  return isSoroban && routing.location === "xdr-viewer" ? (
    <div className="LaboratoryChrome__soroban_alert s-alert">
      <div className="so-chunk">
        You are on Soroban network and can view Soroban XDR
      </div>
    </div>
  ) : null;
};
