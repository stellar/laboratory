import { useQuery } from "@tanstack/react-query";
import { Contract, rpc as StellarRpc, xdr } from "@stellar/stellar-sdk";
import { isEmptyObject } from "@/helpers/isEmptyObject";
import { NetworkHeaders } from "@/types/types";

export const useGetContractDataFromRpcById = ({
  contractId,
  rpcUrl,
  headers = {},
}: {
  contractId: string;
  rpcUrl: string;
  headers?: NetworkHeaders;
}) => {
  const execWasmType = xdr.ContractExecutableType.contractExecutableWasm().name;
  const execStellarAssetType =
    xdr.ContractExecutableType.contractExecutableStellarAsset().name;

  const query = useQuery<
    | {
        contractType: typeof execWasmType | typeof execStellarAssetType | null;
        wasmHash: string;
      }
    | null
    | undefined
  >({
    queryKey: ["useGetContractDataFromRpcById", contractId, rpcUrl],
    queryFn: async () => {
      if (!contractId || !rpcUrl) {
        return null;
      }

      try {
        const rpcServer = new StellarRpc.Server(rpcUrl, {
          headers: isEmptyObject(headers) ? undefined : { ...headers },
          allowHttp: new URL(rpcUrl).hostname === "localhost",
        });

        const contractLedgerKey = new Contract(contractId).getFootprint();
        const ledgerEntries =
          await rpcServer.getLedgerEntries(contractLedgerKey);

        if (!ledgerEntries?.entries?.[0]?.val) {
          throw "Could not obtain contract data from server.";
        }

        const executable = ledgerEntries.entries[0].val
          .contractData()
          ?.val()
          ?.instance()
          ?.executable();

        if (!executable) {
          throw "Could not get executable from contract data.";
        }

        const contractType = executable?.switch()?.name;
        const wasmHash = executable.wasmHash()?.toString("hex");

        if ([execWasmType, execStellarAssetType].includes(contractType)) {
          return { contractType, wasmHash };
        }

        throw "Unknown contract type.";
      } catch (e: any) {
        throw `Something went wrong getting contract data by contract ID. ${e.message || e}`;
      }
    },
    enabled: false,
  });

  return query;
};
