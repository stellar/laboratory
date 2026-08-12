import { useQuery } from "@tanstack/react-query";
import { Contract, rpc as StellarRpc, xdr } from "@stellar/stellar-sdk";
import { isEmptyObject } from "@/helpers/isEmptyObject";
import { NetworkHeaders } from "@/types/types";

type ContractType = Extract<
  xdr.ContractExecutableVariantName,
  "contractExecutableWasm" | "contractExecutableStellarAsset"
>;

export const useGetContractDataFromRpcById = ({
  contractId,
  rpcUrl,
  headers = {},
}: {
  contractId: string;
  rpcUrl: string;
  headers?: NetworkHeaders;
}) => {
  const query = useQuery({
    queryKey: ["useGetContractDataFromRpcById", contractId, rpcUrl, headers],
    queryFn: async (): Promise<{
      contractType: ContractType | null;
      wasmHash: string;
    } | null> => {
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

        const ledgerEntryData = ledgerEntries?.entries?.[0]?.val;

        if (!ledgerEntryData || ledgerEntryData.type !== "contractData") {
          throw "Could not obtain contract data from server.";
        }

        const contractValue = ledgerEntryData.contractData.val;

        if (contractValue.type !== "scvContractInstance") {
          throw "Could not get executable from contract data.";
        }

        const executable = contractValue.instance.executable;

        if (!executable) {
          throw "Could not get executable from contract data.";
        }

        const contractType = executable.type;
        const wasmHash =
          contractType === "contractExecutableWasm"
            ? Buffer.from(executable.wasmHash.toBytes()).toString("hex")
            : "";

        if (
          contractType === "contractExecutableWasm" ||
          contractType === "contractExecutableStellarAsset"
        ) {
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
