import { SdsLink } from "@/components/SdsLink";

export const renderViewXdrInfoMessage = () => {
  return (
    <>
      Decode and encode Stellar{" "}
      <SdsLink href="https://developers.stellar.org/docs/learn/fundamentals/data-format/xdr">
        XDR (External Data Representation)
      </SdsLink>
      , the binary format Stellar uses to encode network data, into
      human-readable JSON, and vice versa. Libraries available for JavaScript
      (npm), Go, and Rust.
    </>
  );
};
