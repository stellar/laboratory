import { EmptyObj, Network } from "@/types/types";

export const getNetworkHeaders = (
  network: Network | EmptyObj,
  method: "horizon" | "rpc",
) => {
  if (method === "rpc" && network.rpcHeaderName) {
    return { [network.rpcHeaderName]: network.rpcHeaderValue || "" };
  } else if (method === "horizon" && network.horizonHeaderName) {
    return {
      [network.horizonHeaderName]: network.horizonHeaderValue || "",
    };
  }

  return {};
};
