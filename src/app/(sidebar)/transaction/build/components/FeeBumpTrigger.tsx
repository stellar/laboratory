import { Button, Icon, Text, Tooltip } from "@stellar/design-system";

import { useBuildFlowStore } from "@/store/createTransactionFlowStore";

import { Box } from "@/components/layout/Box";

/**
 * Inline prompt that lets the user opt into wrapping the transaction with a
 * fee bump. Renders a tooltip, label, and action button in a single row.
 *
 * Used in both `SignStepContent` (classic / Soroban without auth) and
 * `ValidateStepContent` (Soroban with auth entries) — whichever is the last
 * step before submit.
 *
 * @example
 * {isValidationSuccess && <FeeBumpTrigger />}
 */
export const FeeBumpTrigger = () => {
  const { setFeeBumpEnabled } = useBuildFlowStore();

  return (
    <Box gap="xs" direction="row" align="center" justify="end">
      <Box align="center" direction="row" gap="xs">
        <Tooltip
          triggerEl={
            <div className="Label__infoButton" role="button">
              <Icon.InfoCircle />
            </div>
          }
        >
          Fee bump lets another account pay the transaction fee without
          re-signing or managing sequence numbers.
        </Tooltip>
      </Box>

      <Text size="sm" weight="medium" as="div">
        Want another account to pay the fee?
      </Text>
      <Button
        size="sm"
        variant="tertiary"
        onClick={() => {
          setFeeBumpEnabled(true);
        }}
      >
        Wrap with fee bump
      </Button>
    </Box>
  );
};
