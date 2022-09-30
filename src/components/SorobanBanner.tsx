import React from "react";
import { useRedux } from "hooks/useRedux";
import { useIsSoroban } from "hooks/useIsSoroban";

export const SorobanBanner = () => {
  const { routing } = useRedux("routing");

  let isSoroban = useIsSoroban();

  return (
    isSoroban && (
      <div className="LaboratoryChrome__soroban_alert s-alert">
        <div className="so-chunk">
          You are connected to the{" "}
          <a
            href="https://soroban.stellar.org/docs/"
            target="_blank"
            rel="noreferrer"
          >
            Soroban
          </a>{" "}
          test network
        </div>
      </div>
    )
  );
};
