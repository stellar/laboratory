import { Address, rpc as StellarRpc, xdr } from "@stellar/stellar-sdk";
import { useQuery } from "@tanstack/react-query";
import { isEmptyObject } from "@/helpers/isEmptyObject";
import { NetworkHeaders } from "@/types/types";

/**
 * Fetch Wasm hash from RPC (returns wasm hash in hex format).
 */
export const useWasmHashFromRpc = ({
  contractId,
  rpcUrl,
  isActive,
  headers = {},
}: {
  contractId: string;
  rpcUrl: string;
  isActive: boolean;
  headers?: NetworkHeaders;
}) => {
  const query = useQuery<string | null>({
    queryKey: ["useWasmHashFromRpc", contractId, rpcUrl],
    queryFn: async () => {
      if (!contractId || !rpcUrl) {
        return null;
      }

      try {
        const rpcServer = new StellarRpc.Server(rpcUrl, {
          headers: isEmptyObject(headers) ? undefined : { ...headers },
          allowHttp: new URL(rpcUrl).hostname === "localhost",
        });

        // Get contract ledger key
        const ledgerKey = xdr.LedgerKey.contractData(
          new xdr.LedgerKeyContractData({
            contract: new Address(contractId).toScAddress(),
            key: xdr.ScVal.scvLedgerKeyContractInstance(),
            durability: xdr.ContractDataDurability.persistent(),
          }),
        );

        const response = await rpcServer.getLedgerEntries(ledgerKey);

        if (!response.entries?.length) {
          throw "Contract not found";
        }

        const executable = response.entries[0].val
          .contractData()
          .val()
          .instance()
          .executable();

        if (executable.switch().name !== "contractExecutableWasm") {
          throw "Contract is not a Wasm contract (likely a Stellar Asset Contract)";
        }

        return executable.wasmHash().toString("hex");
      } catch (e: any) {
        throw `Something went wrong fetching Wasm hash from RPC server. ${e.message || e}`;
      }
    },
    enabled: Boolean(isActive),
    // Keep data for 60 seconds
    staleTime: 1000 * 60,
  });

  return query;
};
