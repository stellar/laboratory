import { SdsLink } from "@/components/SdsLink";
import { buildEndpointHref } from "@/helpers/buildEndpointHref";
import { Routes } from "@/constants/routes";

export const TxHashLink = ({ txHash }: { txHash: string }) => (
  <SdsLink
    href={buildEndpointHref(Routes.TRANSACTION_DASHBOARD, {
      transactionHash: txHash,
    })}
    target="_blank"
    isUnderline
    variant="secondary"
  >
    {txHash}
  </SdsLink>
);
