import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { Badge, Icon, Link, Tooltip } from "@stellar/design-system";

import { BuildVerificationStatus } from "@/types/types";

export const BuildVerifiedBadge = ({
  status,
  disableMessage = false,
}: {
  status: BuildVerificationStatus;
  disableMessage?: boolean;
}) => {
  const [isBadgeTooltipVisible, setIsBadgeTooltipVisible] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (buttonRef?.current?.contains(event.target as Node)) {
      return;
    }

    setIsBadgeTooltipVisible(false);
  }, []);

  // Close tooltip when clicked outside
  useLayoutEffect(() => {
    if (isBadgeTooltipVisible) {
      document.addEventListener("pointerup", handleClickOutside);
    } else {
      document.removeEventListener("pointerup", handleClickOutside);
    }

    return () => {
      document.removeEventListener("pointerup", handleClickOutside);
    };
  }, [handleClickOutside, isBadgeTooltipVisible]);

  const item = {
    verified: {
      badge: (
        <Badge variant="success" icon={<Icon.CheckCircle />}>
          Build Verified
        </Badge>
      ),
      message: (
        <>
          <code>Build Verified</code> means that a GitHub Action run has
          attested to have built the Wasm, but does not verify the source code.
        </>
      ),
    },
    unverified: {
      badge: (
        <Badge variant="error" icon={<Icon.XCircle />}>
          Build Unverified
        </Badge>
      ),
      message: (
        <>
          This contract has no build verification configured. Please see{" "}
          <Link href="https://stellar.expert/explorer/public/contract/validation">
            verification setup instructions
          </Link>{" "}
          for more info.
        </>
      ),
    },
    built_in: {
      badge: (
        <Badge variant="success" icon={<Icon.CheckCircle />}>
          Built-in Contract
        </Badge>
      ),
      message: (
        <>
          The Stellar Asset Contract (SAC) is a built-in smart contract that
          provides a standardized, programmatic interface to Stellar assets on
          the network. It implements the{" "}
          <Link href="https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0041.md">
            SEP‑41 Token Interface
          </Link>{" "}
          via{" "}
          <Link href="https://github.com/stellar/stellar-protocol/blob/master/core/cap-0046-06.md">
            CAP-46-06
          </Link>
          .
        </>
      ),
    },
  };

  const badge = item[status];

  return (
    <Tooltip
      triggerEl={
        <button
          ref={buttonRef}
          className="ContractInfo__badgeButton"
          onClick={() => {
            if (disableMessage) return;
            setIsBadgeTooltipVisible(!isBadgeTooltipVisible);
          }}
          type="button"
        >
          {badge.badge}
        </button>
      }
      isVisible={isBadgeTooltipVisible}
    >
      {badge.message}
    </Tooltip>
  );
};
