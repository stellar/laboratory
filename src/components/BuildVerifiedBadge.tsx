"use client";

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
    verified_build: {
      badge: (
        <Badge variant="primary" icon={<Icon.CheckCircle />}>
          Verified Build
        </Badge>
      ),
      message: (
        <>
          In{" "}
          <Link
            variant="primary"
            href="https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0055.md"
          >
            SEP-55
          </Link>{" "}
          contract build verification proves a deployed smart contract’s binary
          (Wasm) was produced by a specific, verifiable build process (e.g.,
          GitHub + CI). It confirms build provenance, not source code
          correctness or safety.
        </>
      ),
    },
    unverified_build: {
      badge: (
        <Badge variant="error" icon={<Icon.XCircle />}>
          Unverified Build
        </Badge>
      ),
      message: (
        <>
          This contract has no build verification. The origin of deployed Wasm
          is not verified.
        </>
      ),
    },
    source_code_unverified: {
      badge: (
        <Badge variant="warning" icon={<Icon.XCircle />}>
          Unverified Source Code
        </Badge>
      ),
      message: (
        <>
          The source code is not verified and may not reflect the contract’s
          on-chain behavior.
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
          className={`ContractInfo__badgeButton ${disableMessage ? "ContractInfo__badgeButton--disabled" : ""}`}
          onClick={() => {
            if (disableMessage) {
              return;
            }
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
