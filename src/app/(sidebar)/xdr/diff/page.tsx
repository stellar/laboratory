"use client";

import { useEffect, useState } from "react";
import { Text, Button, Icon } from "@stellar/design-system";
import { DiffEditor } from "@monaco-editor/react";

import { Box } from "@/components/layout/Box";
import { XdrPicker } from "@/components/FormElements/XdrPicker";
import { XdrTypeSelect } from "@/components/XdrTypeSelect";
import { PageCard } from "@/components/layout/PageCard";
import { ErrorText } from "@/components/ErrorText";

import { prettifyJsonString } from "@/helpers/prettifyJsonString";
import { decodeXdr } from "@/helpers/decodeXdr";

import { useIsXdrInit } from "@/hooks/useIsXdrInit";
import { useStore } from "@/store/useStore";
import { trackEvent, TrackingEvent } from "@/metrics/tracking";
import { XDR_TYPE_TRANSACTION_ENVELOPE } from "@/constants/settings";

import "@/components/CodeEditor/styles.scss";

export default function DiffXdr() {
  const { theme } = useStore();
  const isXdrInit = useIsXdrInit();

  const [isExpanded, setIsExpanded] = useState(false);

  const [xdrOne, setXdrOne] = useState("");
  const [jsonOne, setJsonOne] = useState("");
  const [jsonOneError, setJsonOneError] = useState("");

  const [xdrTwo, setXdrTwo] = useState("");
  const [jsonTwo, setJsonTwo] = useState("");
  const [jsonTwoError, setJsonTwoError] = useState("");

  const [xdrType, setXdrType] = useState(XDR_TYPE_TRANSACTION_ENVELOPE);

  const ERROR_MESSAGE_NOTE = "Make sure the XDR value and type are valid.";

  useEffect(() => {
    if (isXdrInit && xdrOne && xdrType) {
      const xdrJsonDecodedOne = decodeXdr({
        xdrType,
        xdrBlob: xdrOne,
        isReady: isXdrInit,
        customErrorMessage: ERROR_MESSAGE_NOTE,
      });

      if (xdrJsonDecodedOne?.jsonString) {
        setJsonOne(xdrJsonDecodedOne.jsonString);
        setJsonOneError("");
      }

      if (xdrJsonDecodedOne?.error) {
        setJsonOneError(xdrJsonDecodedOne.error);
        setJsonOne("");

        trackEvent(TrackingEvent.XDR_DIFF_ERROR, {
          xdrType,
          errorType: "json",
          xdr: "one",
        });
      }
    } else {
      setJsonOneError("");
      setJsonOne("");
    }
  }, [xdrOne, xdrType, isXdrInit]);

  useEffect(() => {
    if (jsonOne && xdrTwo) {
      const xdrJsonDecodedTwo = decodeXdr({
        xdrType,
        xdrBlob: xdrTwo,
        isReady: isXdrInit,
        customErrorMessage: ERROR_MESSAGE_NOTE,
      });

      if (xdrJsonDecodedTwo?.jsonString) {
        setJsonTwo(xdrJsonDecodedTwo.jsonString);
        setJsonTwoError("");
      }

      if (xdrJsonDecodedTwo?.error) {
        setJsonTwoError(xdrJsonDecodedTwo.error);
        setJsonTwo("");

        trackEvent(TrackingEvent.XDR_DIFF_ERROR, {
          xdrType,
          errorType: "json",
          xdr: "two",
        });
      }
    } else {
      setJsonTwoError("");
      setJsonTwo("");
    }
  }, [isXdrInit, jsonOne, xdrTwo, xdrType]);

  useEffect(() => {
    if (jsonOne && jsonTwo) {
      trackEvent(TrackingEvent.XDR_DIFF_SUCCESS, {
        xdrType,
      });
    }
  }, [jsonOne, jsonTwo, xdrType]);

  return (
    <Box gap="md">
      <PageCard heading="Diff XDRs">
        <Text as="div" size="sm">
          Enter two Base-64 encoded XDRs to compare their JSON.
        </Text>

        <Box gap="lg" direction="row">
          <XdrPicker
            id="diff-xdr-one"
            label="XDR One"
            value={xdrOne}
            hasCopyButton
            onChange={(e) => {
              setXdrOne(e.target.value);
            }}
          />

          <XdrPicker
            id="diff-xdr-two"
            label="XDR Two"
            value={xdrTwo}
            hasCopyButton
            onChange={(e) => {
              setXdrTwo(e.target.value);
            }}
            disabled={!jsonOne}
          />
        </Box>

        <XdrTypeSelect
          xdrType={xdrType}
          xdrBlob={xdrOne}
          onUpdateXdrType={(type) => {
            setXdrType(type);
          }}
        />

        <Box gap="lg" direction="row" align="center" justify="end">
          <Button
            size="md"
            variant="error"
            icon={<Icon.RefreshCw01 />}
            onClick={() => {
              setXdrOne("");
              setXdrTwo("");

              trackEvent(TrackingEvent.XDR_DIFF_CLEAR);
            }}
            disabled={!(xdrOne || xdrTwo)}
          >
            Clear XDR
          </Button>
        </Box>

        {jsonOneError || jsonTwoError ? (
          <Box gap="xs">
            {jsonOneError ? (
              <ErrorText
                errorMessage={`XDR One error: ${jsonOneError}`}
                size="sm"
              />
            ) : null}

            {jsonTwoError ? (
              <ErrorText
                errorMessage={`XDR Two error: ${jsonTwoError}`}
                size="sm"
              />
            ) : null}
          </Box>
        ) : null}

        {jsonOne && jsonTwo ? (
          <div
            className={`CodeEditor ${isExpanded ? "CodeEditor--expanded" : ""}`}
            data-testid="diff-xdr-editor"
          >
            <div className="CodeEditor__header">
              {/* Title */}
              <div className="CodeEditor__header__title">Diff</div>

              {/* Actions */}
              <Box
                gap="xs"
                direction="row"
                align="center"
                justify="end"
                addlClassName="CodeEditor__actions"
              >
                <Button
                  variant="tertiary"
                  size="sm"
                  icon={isExpanded ? <Icon.X /> : <Icon.Expand06 />}
                  title={isExpanded ? "Close" : "Expand"}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsExpanded(!isExpanded);
                  }}
                ></Button>
              </Box>
            </div>

            {/* Content / editor */}
            <div
              className="CodeEditor__content"
              // Container must have set height (43 px header height)
              style={{ height: `calc(100% - 43px)` }}
            >
              <DiffEditor
                language="xdr"
                original={prettifyJsonString(jsonOne)}
                modified={prettifyJsonString(jsonTwo)}
                options={{
                  minimap: { enabled: false },
                  readOnly: true,
                  scrollBeyondLastLine: false,
                  padding: { top: 8, bottom: 8 },
                  wordWrap: "off",
                }}
                theme={theme === "sds-theme-light" ? "light" : "vs-dark"}
              />
            </div>
          </div>
        ) : null}
      </PageCard>
    </Box>
  );
}
