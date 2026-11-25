"use client";

import {
  Text,
  Notification,
  Button,
  Icon,
  Textarea,
} from "@stellar/design-system";

import * as StellarXdr from "@/helpers/StellarXdr";
import { openUrl } from "@/helpers/openUrl";

import { Box } from "@/components/layout/Box";
import { XdrPicker } from "@/components/FormElements/XdrPicker";
import { XdrTypeSelect } from "@/components/XdrTypeSelect";
import { PageCard } from "@/components/layout/PageCard";
import { PageHeader } from "@/components/layout/PageHeader";

import { useIsXdrInit } from "@/hooks/useIsXdrInit";
import { useDebouncedTrackEvent } from "@/hooks/useDebouncedTrackEvent";
import { useStore } from "@/store/useStore";
import { trackEvent, TrackingEvent } from "@/metrics/tracking";

import { renderViewXdrInfoMessage } from "../components/renderViewXdrInfoMessage";

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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return {
        xdrString: "",
        error: "Invalid JSON",
        outcome: "invalidJson" as const,
      };
    }

    try {
      return {
        xdrString: StellarXdr.encode(xdr.type, xdr.jsonString),
        error: "",
        outcome: "success" as const,
      };
    } catch (e) {
      return {
        xdrString: "",
        error: `Unable to decode JSON as ${xdr.type}: ${e}`,
        outcome: "error" as const,
      };
    }
  };

  const jsonXdrEncoded = jsonEncodeXdr();

  // Track the encode result once the input settles, not on every render.
  // Invalid JSON is not tracked, because encoding was not attempted.
  useDebouncedTrackEvent(
    {
      event: jsonXdrEncoded
        ? {
            success: TrackingEvent.XDR_FROM_JSON_SUCCESS,
            error: TrackingEvent.XDR_FROM_JSON_ERROR,
            invalidJson: null,
          }[jsonXdrEncoded.outcome]
        : null,
      properties: { xdrType: xdr.type },
    },
    [xdr.jsonString, xdr.type, isXdrInit],
  );

  return (
    <Box gap="md">
      <PageHeader heading="To XDR" />
      <PageCard>
        <Box gap="lg">
          <Textarea
            id="to-xdr-json"
            fieldSize="md"
            label="JSON"
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
                trackEvent(TrackingEvent.XDR_FROM_JSON_CLEAR);
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
                label="Base64 encoded XDR"
                value={jsonXdrEncoded.xdrString}
                hasCopyButton
                readOnly
              />
            ) : null}
          </>
        </Box>
      </PageCard>

      <Notification
        variant="primary"
        title={renderViewXdrInfoMessage()}
        onAction={() => {
          openUrl(
            "https://developers.stellar.org/docs/learn/fundamentals/data-format/xdr-json",
          );
        }}
        actionLabel="XDR ⇄ JSON guide"
      />
    </Box>
  );
}
