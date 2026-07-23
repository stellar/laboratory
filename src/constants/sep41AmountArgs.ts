/**
 * Map of SEP-41 token function name → argument names that represent a token
 * amount (i128/u128 in base units). These are the only args that get the
 * "token units" entry mode; every other i128/u128 field gets the passive
 * conversion note only.
 *
 * Deliberately excludes non-amount integer args such as `approve`'s
 * `expiration_ledger` (a u32).
 *
 * @see https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0041.md
 */
export const SEP41_AMOUNT_ARGS: Record<string, string[]> = {
  transfer: ["amount"],
  transfer_from: ["amount"],
  approve: ["amount"],
  mint: ["amount"],
  burn: ["amount"],
  burn_from: ["amount"],
  clawback: ["amount"],
};

/**
 * Whether the given `functionName` + `argName` pair is a SEP-41 amount argument
 * eligible for token-units entry mode.
 */
export const isSep41AmountArg = (
  functionName: string,
  argName: string,
): boolean => Boolean(SEP41_AMOUNT_ARGS[functionName]?.includes(argName));
