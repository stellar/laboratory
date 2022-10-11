import React from "react";
import { useRedux } from "hooks/useRedux";
import { useIsSoroban } from "hooks/useIsSoroban";
import SLUG from "constants/slug";

export const SorobanBanner = () => {
  const { routing } = useRedux("routing");

  let isSoroban = useIsSoroban();

  return isSoroban &&
    (routing.location === SLUG.XDRVIEWER ||
      routing.location === SLUG.TXSIGNER) ? (
    <div className="LaboratoryChrome__soroban_alert s-alert">
      <div className="so-chunk">
        You are on Soroban network and can view Soroban XDR
      </div>
    </div>
  ) : null;
};
