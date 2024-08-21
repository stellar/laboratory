import "./styles.scss";

export const NetworkIndicator = ({
  networkId,
  networkLabel,
}: {
  networkId: string;
  networkLabel: string;
}) => {
  return (
    <div className="NetworkIndicator">
      <span
        className="NetworkIndicator__dot"
        aria-hidden="true"
        data-network={networkId}
      ></span>
      {networkLabel}
    </div>
  );
};
