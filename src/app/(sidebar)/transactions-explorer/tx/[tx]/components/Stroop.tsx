import { Asset, Badge } from "@stellar/design-system";

import { Box } from "@/components/layout/Box";

const stellarLogo =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MDAiIGhlaWdodD0iNTAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjI1MCIgY3k9IjI1MCIgcj0iMjUwIiBmaWxsPSIjRkZGIi8+PHBhdGggZmlsbD0iIzBGMEYwRiIgZmlsbC1ydWxlPSJub256ZXJvIiBkPSJNNDI1IDE3OS4xNXYyNy43NDdsLTEyLjE4OCA2LjE3NGMtMTAuMTgzIDUuMjEzLTE2LjI3NyAxNS45NTktMTUuMzk1IDI3LjQyNi4zMiAzLjc3LjQgNy42MTguNCAxMS4zODggMCAxOS45NjctMy45MjggMzkuMzc0LTExLjYyNiA1Ny42NTgtNy40NTcgMTcuNjQyLTE4LjEyMSAzMy40NC0zMS42NzIgNDcuMDczcy0yOS40MjcgMjQuMjk4LTQ2Ljk4NyAzMS43NTZDMjg5LjMzIDM5Ni4wNzEgMjY5LjkyNiA0MDAgMjQ5Ljk2IDQwMHMtMzkuMjktMy45My01Ny41NzItMTEuNjI4YTE1MS40IDE1MS40IDAgMCAxLTI3Ljc0My0xNS40NzdsMjQuNTM2LTEyLjUxLjk2Mi0uNDgxYzE4LjEyMiAxMC4xMDQgMzguODA5IDE1LjQ3NyA1OS44MTcgMTUuNDc3aC44ODJjMTYuMTE3LS4wOCAzMS44MzMtMy4yODggNDYuNjY3LTkuNTQzIDE0LjgzMy02LjI1NSAyOC4xNDQtMTUuMTU2IDM5LjUzLTI2LjU0NCAyMy4yNTMtMjMuMjU2IDM2LjA4Mi01NC4yOSAzNi4wODItODcuMTY5IDAtNS4zNzMtLjMyLTEwLjgyNi0xLjA0Mi0xNi4xOTlsLS4yNC0xLjY4NC0xLjUyNC44MDItMjA1LjAyOSAxMDQuMzMtNDIuNDE3IDIxLjY1Mkw3NSAzODUuNDA1di0yNy43NDdsNDkuMzEzLTI1LjE4IDI0LjI5NS0xMi4zNXpNMjUwLjA0IDEwMGMxOS45NjYgMCAzOS4yOSAzLjkzIDU3LjU3MiAxMS42MjggOS43MDIgNC4wOSAxOS4wMDMgOS4zMDIgMjcuNjYzIDE1LjM5N2wtMS44NDQuOTYyLTIzLjczNSAxMi4xMWMtMTguMTIxLTEwLjEwNS0zOC43MjgtMTUuMzk4LTU5LjY1Ni0xNS4zOThoLS45NjJjLTE2LjExNy4xNi0zMS44MzMgMy4zNjgtNDYuNjY3IDkuNTQzLTE0LjgzNCA2LjI1NS0yOC4xNDQgMTUuMTU3LTM5LjUzIDI2LjU0NC0yMy4yNTMgMjMuMzM2LTM2LjA4MyA1NC4yOS0zNi4wODMgODcuMTcgMCA1LjM3Mi4zMjEgMTAuNzQ1IDEuMDQzIDE2LjExOGwuMjQgMS42ODQgMS41MjQtLjgwMiAyMDQuODY4LTEwNC40OSA0Mi40MTctMjEuNjUzIDQ4LjAzLTI0LjUzOXYyNy43NDdsLTQ5LjQ3MyAyNS4yNi0yNC4yOTYgMTIuMzUtMjE1LjkzMyAxMTAuMjY1LS45NjMuNTYxLTExLjA2NSA1LjYxNC0xMS4yMjYgNS42OTN2LS4wOGwtMS4wNDIuNDgxTDc1IDMyMC41M3YtMjcuNzQ2bDEyLjE4OC02LjE3NWMxMC4xODMtNS4yMTMgMTYuMjc3LTE1Ljk1OCAxNS4zOTUtMjcuNDI2LS4yNC0zLjc2OS0uNC03LjUzOC0uNC0xMS4zMDcgMC0xOS45NjggMy45MjgtMzkuMzc1IDExLjYyNi01Ny42NTggNy40NTctMTcuNjQzIDE4LjEyMS0zMy40NCAzMS42NzItNDcuMDczIDEzLjU1MS0xMy41NTMgMjkuMzQ3LTI0LjI5OSA0Ni45ODctMzEuNzU3QzIxMC42NyAxMDMuOTMgMjMwLjA3NCAxMDAgMjUwLjA0IDEwMCIvPjwvZz48L3N2Zz4=";

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
        sourceOne={{ image: stellarLogo, altText: "" }}
      />

      <Badge variant="tertiary">{`${amount.toLocaleString()} stroops`}</Badge>
    </Box>
  );
}
