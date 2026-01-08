export const formatLedgersToDays = (ledgers: number) => {
  // Convert ledgers to human-readable time (1 ledger ≈ 5 seconds)
  const SECONDS_PER_LEDGER = 5;
  const SECONDS_PER_HOUR = 3600;
  const SECONDS_PER_DAY = 86400; // 24 * 60 * 60

  const totalSeconds = ledgers * SECONDS_PER_LEDGER;
  const days = Math.floor(totalSeconds / SECONDS_PER_DAY);

  if (days > 0) {
    return `${days} day${days === 1 ? "" : "s"}`;
  }

  // If less than a day, show hours
  const hours = Math.floor(totalSeconds / SECONDS_PER_HOUR);
  return `${hours} hour${hours === 1 ? "" : "s"}`;
};

export const formatLedgersToMonths = (ledgers: number) => {
  // Convert ledgers to months (1 ledger ≈ 5 seconds)
  const SECONDS_PER_LEDGER = 5;
  const SECONDS_PER_DAY = 86400;
  const DAYS_PER_MONTH = 30;
  const months = Math.floor(
    (ledgers * SECONDS_PER_LEDGER) / (SECONDS_PER_DAY * DAYS_PER_MONTH),
  );
  return `${months} months`;
};
