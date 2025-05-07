import { buildEndpointHref } from "@/helpers/buildEndpointHref";
import { SdsLink } from "./SdsLink";
import { Routes } from "@/constants/routes";

export const XdrLink = ({ xdr, type }: { xdr: string; type: string }) => (
  <SdsLink
    href={buildEndpointHref(Routes.VIEW_XDR, {
      blob: xdr,
      type: type,
    })}
    target="_blank"
    isUnderline
    variant="secondary"
  >
    {xdr}
  </SdsLink>
);
