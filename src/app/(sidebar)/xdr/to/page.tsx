"use client";

import {
  Text,
  Card,
  Alert,
  Button,
  Icon,
  Textarea,
} from "@stellar/design-system";
import * as StellarXdr from "@/helpers/StellarXdr";

import { Box } from "@/components/layout/Box";
import { SdsLink } from "@/components/SdsLink";
import { XdrPicker } from "@/components/FormElements/XdrPicker";
import { XdrTypeSelect } from "@/components/XdrTypeSelect";

import { useIsXdrInit } from "@/hooks/useIsXdrInit";
import { useStore } from "@/store/useStore";

export default function ToXdr() {
  const { xdr } = useStore();
  const { updateJsonString, resetJsonString } = xdr;

  const isXdrInit = useIsXdrInit();

  const jsonEncodeXdr = () => {
    if (!(isXdrInit && xdr.jsonString && xdr.type)) {
      return null;
    }

    try {
      JSON.parse(xdr.jsonString);
    } catch (e) {
      return {
        xdrString: "",
        error: "Invalid JSON",
      };
    }

    try {
      const xdrString = StellarXdr.encode(xdr.type, xdr.jsonString);

      return {
        xdrString: xdrString,
        error: "",
      };
    } catch (e) {
      return {
        xdrString: "",
        error: `Unable to decode JSON as ${xdr.type}: ${e}`,
      };
    }
  };

  const jsonXdrEncoded = jsonEncodeXdr();

  return (
    <Box gap="md">
      <div className="PageHeader">
        <Text size="md" as="h1" weight="medium">
          To XDR
        </Text>
      </div>

      <Card>
        <Box gap="lg">
          <Textarea
            id="to-xdr-json"
            fieldSize="md"
            label="Transaction JSON"
            rows={10}
            hasCopyButton
            value={xdr.jsonString}
            onChange={(e) => {
              updateJsonString(e.target.value);
            }}
            spellCheck="false"
          >
            {xdr.jsonString}
          </Textarea>

          <XdrTypeSelect error={jsonXdrEncoded?.error} />

          <>
            {!xdr.jsonString || !xdr.type ? (
              <Text as="div" size="sm">
                {!xdr.blob
                  ? "Enter a JSON string to encode."
                  : "Please select a XDR type"}
              </Text>
            ) : null}
          </>

          <Box gap="lg" direction="row" align="center" justify="end">
            <Button
              size="md"
              variant="error"
              icon={<Icon.RefreshCw01 />}
              onClick={() => {
                resetJsonString();
              }}
              disabled={!xdr.jsonString}
            >
              Clear JSON
            </Button>
          </Box>

          <>
            {jsonXdrEncoded?.xdrString ? (
              <XdrPicker
                id="to-xdr-encoded"
                label="Transaction XDR"
                value={jsonXdrEncoded.xdrString}
                hasCopyButton
                readOnly
              />
            ) : null}
          </>
        </Box>
      </Card>

      <Alert variant="primary" placement="inline">
        You can use use this tool to encode JSON into XDR.{" "}
        <SdsLink href="https://developers.stellar.org/docs/encyclopedia/xdr">
          External Data Representation
        </SdsLink>{" "}
        (XDR) is a standardized protocol that the Stellar network uses to encode
        data. The XDR Viewer is a tool that displays contents of a Stellar XDR
        blob in a human-readable format.
      </Alert>
    </Box>
  );
}
