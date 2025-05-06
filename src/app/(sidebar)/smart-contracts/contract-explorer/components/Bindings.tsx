import { Alert } from "@stellar/design-system";
import { SdsLink } from "@/components/SdsLink";

export const Bindings = () => {
  return (
    <Alert variant="primary" placement="inline">
      Bindings are a feature of the Stellar CLI that generate fully typed client
      libraries for your smart contracts, tailored to your chosen programming
      language, including TypeScript, JSON, Rust, Python, and Java. This makes
      it easy to integrate Stellar contracts into your application as if they
      were native modules. Each binding provides type-safe functions
      corresponding to your contract’s methods. To learn more about generating
      bindings, please see the{" "}
      <SdsLink href="https://developers.stellar.org/docs/tools/cli/stellar-cli#stellar-contract-bindings">
        Stellar CLI’s bindings command
      </SdsLink>
      .
    </Alert>
  );
};
