import React from "react";
import { Icon, Tooltip } from "@stellar/design-system";
import { NextLink } from "@/components/NextLink";
import "./styles.scss";

type WithInfoTextProps = (
  | {
      infoText: React.ReactNode | string;
      href?: undefined;
    }
  | {
      infoText?: undefined;
      href: string;
    }
) & {
  children: React.ReactNode;
  infoHoverText?: string;
};

export const WithInfoText = ({
  children,
  infoText,
  infoHoverText,
  href,
}: WithInfoTextProps) => {
  const buttonBaseProps = {
    className: "WithInfoText__button",
    title: infoHoverText || "Learn more",
  };

  if (href) {
    return (
      <div className="WithInfoText">
        {children}

        <NextLink {...buttonBaseProps} href={href}>
          <Icon.InfoCircle />
        </NextLink>
      </div>
    );
  }

  return (
    <div className="WithInfoText">
      {children}

      <Tooltip
        triggerEl={
          <button {...buttonBaseProps}>
            <Icon.InfoCircle />
          </button>
        }
      >
        {infoText}
      </Tooltip>
    </div>
  );
};
