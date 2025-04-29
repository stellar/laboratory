import { Icon, Tooltip } from "@stellar/design-system";

export const LabelHeading = ({
  children,
  size,
  labelSuffix,
  infoText,
  infoLink,
}: {
  children: React.ReactNode;
  size: "sm" | "md" | "lg";
  labelSuffix?: string | React.ReactNode;
  infoText?: string | React.ReactNode;
  infoLink?: string;
}) => (
  <div className="Label__wrapper">
    <div className={`Label Label--${size}`}>
      {children}
      {labelSuffix ? (
        <span className="Label__suffix">({labelSuffix})</span>
      ) : null}
    </div>

    {infoLink ? (
      <a
        href={infoLink}
        className="Label__infoButton"
        rel="noreferrer noopener"
        target="_blank"
      >
        <Icon.InfoCircle />
      </a>
    ) : null}

    {infoText ? (
      <Tooltip
        triggerEl={
          <div className="Label__infoButton" role="button">
            <Icon.InfoCircle />
          </div>
        }
      >
        {infoText}
      </Tooltip>
    ) : null}
  </div>
);
