import { useQuery } from "@tanstack/react-query";
import { Contract, rpc as StellarRpc, xdr } from "@stellar/stellar-sdk";
import { isEmptyObject } from "@/helpers/isEmptyObject";
import { NetworkHeaders } from "@/types/types";

export const useGetContractTypeFromRpcById = ({
  contractId,
  rpcUrl,
  headers = {},
}: {
  contractId: string;
  rpcUrl: string;
  headers?: NetworkHeaders;
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const execWasm = xdr.ContractExecutableType.contractExecutableWasm();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const execStellarAsset =
    xdr.ContractExecutableType.contractExecutableStellarAsset();

  type ExecWasmType = typeof execWasm.name;
  type ExecStellarAssetType = typeof execStellarAsset.name;

  const query = useQuery<ExecWasmType | ExecStellarAssetType | null>({
    queryKey: ["useGetContractTypeFromRpcById", contractId, rpcUrl],
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

        if (
          ["contractExecutableWasm", "contractExecutableStellarAsset"].includes(
            contractType,
          )
        ) {
          return contractType;
        }

        throw "Unknown contract type.";
      } catch (e: any) {
        throw `Something went wrong getting contract type by contract ID. ${e.message || e}`;
      }
    },
    enabled: false,
  });

  return query;
};
