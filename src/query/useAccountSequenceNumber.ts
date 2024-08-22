import { MuxedAccount, StrKey } from "@stellar/stellar-sdk";
import { useQuery } from "@tanstack/react-query";

export const useAccountSequenceNumber = ({
  publicKey,
  horizonUrl,
}: {
  publicKey: string;
  horizonUrl: string;
}) => {
  const query = useQuery({
    queryKey: ["useAccountSequenceNumber", { publicKey }],
    queryFn: async () => {
      let sourceAccount = publicKey;

      if (StrKey.isValidMed25519PublicKey(publicKey)) {
        const muxedAccount = MuxedAccount.fromAddress(publicKey, "0");
        sourceAccount = muxedAccount.baseAccount().accountId();
      }

      const response = await fetch(`${horizonUrl}/accounts/${sourceAccount}`);
      const responseJson = await response.json();

      if (responseJson?.status === 0) {
        throw `Unable to reach server at ${horizonUrl}.`;
      }

      if (responseJson?.status?.toString()?.startsWith("4")) {
        if (responseJson?.title === "Resource Missing") {
          throw "Account not found. Make sure the correct network is selected and the account is funded/created.";
        }

        throw (
          responseJson?.extras?.reason ||
          responseJson?.detail ||
          "Something went wrong when fetching the transaction sequence number. Please try again."
        );
      }

      return (BigInt(responseJson.sequence) + BigInt(1)).toString();
    },
    enabled: false,
  });

  return query;
};
