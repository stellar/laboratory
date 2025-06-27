import { Asset, Badge } from "@stellar/design-system";

import { Box } from "@/components/layout/Box";
import { STELLAR_LOGO_DATA_URI } from "@/constants/assets";

function formatNumber(input: number) {
  const str = input
    .toLocaleString("en-US", {
      minimumFractionDigits: 10,
      maximumFractionDigits: 10,
    })
    .replace(/0+$/, "");

  if (str.endsWith(".")) {
    return str.slice(0, -1);
  }

  return str;
}

export function Stroop({
  amount: rawAmount,
}: {
  amount: bigint | string | number;
}) {
  const amount = BigInt(rawAmount);
  const lumens = formatNumber(Number(amount.toString()) / 10_000_000);

  return (
    <Box align="center" direction="row" gap="xs">
      {`${lumens} XLM`}
      <Asset
        variant="single"
        size="sm"
        sourceOne={{ image: STELLAR_LOGO_DATA_URI, altText: "" }}
      />

      <Badge variant="tertiary">{`${amount.toLocaleString()} stroops`}</Badge>
    </Box>
  );
}
