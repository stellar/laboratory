import { useQuery } from "@tanstack/react-query";
import {
  Operation,
  TransactionBuilder,
  Horizon,
  Asset,
  BASE_FEE,
} from "@stellar/stellar-sdk";
import { isEmptyObject } from "@/helpers/isEmptyObject";
import { EmptyObj, Network, NetworkHeaders } from "@/types/types";

export const useAddTrustline = ({
  asset,
  publicKey,
  network,
  headers,
}: {
  asset: {
    assetCode?: string;
    assetIssuer?: string;
  };
  publicKey: string;
  network: Network | EmptyObj;
  headers: NetworkHeaders;
}) => {
  const query = useQuery({
    queryKey: ["addTrustline", publicKey],
    queryFn: async () => {
      if (!asset.assetCode || !asset.assetIssuer) {
        throw new Error("Asset code and issuer are required");
      }

      const horizonServer = new Horizon.Server(network.horizonUrl, {
        headers: isEmptyObject(headers) ? undefined : { ...headers },
        allowHttp: new URL(network.horizonUrl).hostname === "localhost",
      });

      // Need this to get the account sequence number
      const account = await horizonServer.loadAccount(publicKey);

      const transaction = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: network.passphrase,
      })
        .addOperation(
          Operation.changeTrust({
            asset: new Asset(asset.assetCode, asset.assetIssuer),
          }),
        )
        .setTimeout(60)
        .build();

      return transaction.toEnvelope().toXDR("base64");
    },
    enabled: false,
  });

  return query;
};
