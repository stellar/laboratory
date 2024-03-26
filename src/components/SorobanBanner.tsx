import { useIsSoroban } from "hooks/useIsSoroban";
import { useRedux } from "hooks/useRedux";

export const SorobanBanner = () => {
  let isSoroban = useIsSoroban();
  const { network } = useRedux("network");

  return isSoroban ? (
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
        {network.current.name} network
      </div>
    </div>
  ) : null;
};
