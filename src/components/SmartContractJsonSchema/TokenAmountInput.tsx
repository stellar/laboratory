import React, { useState } from "react";
import { Input, RadioButton } from "@stellar/design-system";

import {
  baseUnitsToTokenAmount,
  tokenAmountToBaseUnits,
} from "@/helpers/tokenAmount";
import { validate } from "@/validate";

import { Box } from "@/components/layout/Box";

/**
 * Decimals-aware amount input for SEP-41 token amount args (i128/u128).
 *
 * Two modes, toggled per field:
 * - `tokens` — the user types a human-readable amount (e.g. `5.5`); the
 *   component scales it by the token's decimals and stores the raw base-unit
 *   integer. The exact value that will be submitted is always shown below.
 * - `raw` — identical to a plain integer field, with a live "= 5 JAAA" note.
 *
 * The canonical stored value (via `onRawChange`) is *always* the raw base-unit
 * integer string, so simulation/submission paths are untouched. The
 * human-units string is local component state only.
 */
export const TokenAmountInput = ({
  id,
  label,
  value,
  decimals,
  symbol,
  isSigned,
  error,
  onRawChange,
  onError,
}: {
  id: string;
  label: React.ReactNode;
  /** Canonical raw base-unit integer string held in the form store. */
  value: string;
  decimals: number;
  symbol?: string;
  /** `true` for i128 (negatives allowed), `false` for u128. */
  isSigned: boolean;
  error?: string;
  onRawChange: (raw: string) => void;
  onError: (error: string | false) => void;
}) => {
  const tokenLabel = symbol || "tokens";

  const safeBaseToToken = (raw: string) => {
    try {
      return raw ? baseUnitsToTokenAmount(raw, decimals) : "";
    } catch {
      return "";
    }
  };

  const [mode, setMode] = useState<"tokens" | "raw">("tokens");
  const [tokensDisplay, setTokensDisplay] = useState<string>(() =>
    safeBaseToToken(value),
  );

  const handleTokensChange = (next: string) => {
    setTokensDisplay(next);

    const err = validate.getTokenAmountError({
      value: next,
      decimals,
      isSigned,
    });
    onError(err);

    if (!err && next) {
      onRawChange(tokenAmountToBaseUnits(next, decimals));
    } else {
      // Clear the canonical value so simulate/submit stays disabled until the
      // token-units entry is valid again.
      onRawChange("");
    }
  };

  const handleRawChange = (next: string) => {
    const err = isSigned
      ? validate.getI128Error(next)
      : validate.getU128Error(next);
    onError(err);
    onRawChange(next);
  };

  const switchMode = (nextMode: "tokens" | "raw") => {
    if (nextMode === mode) {
      return;
    }

    if (nextMode === "tokens") {
      setTokensDisplay(safeBaseToToken(value));
    }

    // Clear stale errors from the previous mode; the counterpart value is a
    // valid representation of the same stored raw integer.
    onError(false);
    setMode(nextMode);
  };

  const tokensNote = value
    ? `Will submit: ${value} (${decimals} ${
        decimals === 1 ? "decimal" : "decimals"
      })`
    : `Enter the amount in ${tokenLabel}; it’s scaled by ${decimals} ${
        decimals === 1 ? "decimal" : "decimals"
      }.`;

  const rawTokenEquivalent = safeBaseToToken(value);
  const rawNote = rawTokenEquivalent
    ? `= ${rawTokenEquivalent} ${tokenLabel} (${decimals} ${
        decimals === 1 ? "decimal" : "decimals"
      })`
    : undefined;

  return (
    <Box gap="sm">
      <Box gap="md" direction="row" align="center" justify="end" wrap="wrap">
        <RadioButton
          id={`${id}-mode-tokens`}
          name={`${id}-amount-mode`}
          label={`Token units${symbol ? ` (${symbol})` : ""}`}
          fieldSize="sm"
          value="tokens"
          checked={mode === "tokens"}
          onChange={() => switchMode("tokens")}
        />
        <RadioButton
          id={`${id}-mode-raw`}
          name={`${id}-amount-mode`}
          label="Raw (base units)"
          fieldSize="sm"
          value="raw"
          checked={mode === "raw"}
          onChange={() => switchMode("raw")}
        />
      </Box>

      <Input
        id={id}
        label={label}
        fieldSize="md"
        value={mode === "tokens" ? tokensDisplay : value}
        error={error}
        onChange={(e) =>
          mode === "tokens"
            ? handleTokensChange(e.target.value)
            : handleRawChange(e.target.value)
        }
        rightElement={mode === "tokens" ? tokenLabel : undefined}
        note={mode === "tokens" ? tokensNote : rawNote}
      />
    </Box>
  );
};
