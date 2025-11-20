"use client";

import { Badge, Card } from "@stellar/design-system";
import ReactDiffViewer, { DiffMethod } from "react-diff-viewer";
import { stringify } from "lossless-json";

import { TransactionTabEmptyMessage } from "@/components/TransactionTabEmptyMessage";
import { Box } from "@/components/layout/Box";
import { formatTxChangeStateItems } from "@/helpers/formatTxChangeStateItems";
import { useWindowSize } from "@/hooks/useWindowSize";

import { RpcTxJsonResponse } from "@/types/types";

export const StateChange = ({
  txDetails,
}: {
  txDetails: RpcTxJsonResponse | null | undefined;
}) => {
  const { windowWidth } = useWindowSize();

  const formattedData = txDetails && formatTxChangeStateItems(txDetails);

  if (!formattedData?.length) {
    return (
      <TransactionTabEmptyMessage>
        There are no state changes in this transaction
      </TransactionTabEmptyMessage>
    );
  }

  const isSplitView = Boolean(windowWidth && windowWidth >= 1100);

  const renderDiffViewer = ({
    dataBefore,
    dataAfter,
  }: {
    dataBefore: string;
    dataAfter: string;
  }) => {
    const isAfterDiffOnly = Boolean(!dataBefore);

    const titleProps = isAfterDiffOnly
      ? { leftTitle: "After" }
      : {
          leftTitle: isSplitView ? "Before" : "Before and After",
          rightTitle: "After",
        };

    return (
      <div className="StateChange__diff__content">
        <div className="StateChange__diffTitle">
          <div>{titleProps.leftTitle}</div>
          {titleProps.rightTitle && isSplitView ? (
            <div>{titleProps.rightTitle}</div>
          ) : null}
        </div>

        <ReactDiffViewer
          oldValue={dataBefore}
          newValue={dataAfter}
          compareMethod={DiffMethod.WORDS}
          splitView={isAfterDiffOnly ? false : isSplitView}
          showDiffOnly={!isAfterDiffOnly}
          hideLineNumbers={true}
          // The theme will adjust automatically from the color variables.
          // We don’t need to switch themes, using light theme is enough.
          useDarkTheme={false}
          styles={{
            variables: {
              light: {
                diffViewerBackground: "var(--sds-clr-gray-02)",
                diffViewerColor: "var(--sds-clr-gray-12)",
                addedBackground: "var(--sds-clr-green-05)",
                addedColor: "var(--sds-clr-gray-12)",
                removedBackground: "var(--sds-clr-red-05)",
                removedColor: "var(--sds-clr-gray-12)",
                wordAddedBackground: "var(--sds-clr-green-07)",
                wordRemovedBackground: "var(--sds-clr-red-07)",
                addedGutterBackground: "var(--sds-clr-teal-08)",
                removedGutterBackground: "var(--sds-clr-teal-08)",
                gutterBackground: "var(--sds-clr-teal-08)",
                gutterBackgroundDark: "var(--sds-clr-teal-08)",
                highlightBackground: "var(--sds-clr-teal-08)",
                highlightGutterBackground: "var(--sds-clr-teal-08)",
                codeFoldGutterBackground: "var(--sds-clr-teal-08)",
                codeFoldBackground: "var(--sds-clr-teal-08)",
                emptyLineBackground: "var(--sds-clr-gray-02)",
                gutterColor: "var(--sds-clr-gray-12)",
                addedGutterColor: "var(--sds-clr-gray-12)",
                removedGutterColor: "var(--sds-clr-gray-12)",
                codeFoldContentColor: "var(--sds-clr-gray-12)",
                diffViewerTitleBackground: "var(--sds-clr-gray-01)",
                diffViewerTitleColor: "var(--sds-clr-gray-12)",
                diffViewerTitleBorderColor: "var(--sds-clr-gray-06)",
              },
            },
          }}
          extraLinesSurroundingDiff={4}
        />
      </div>
    );
  };

  const renderDiffContent = ({
    dataBefore,
    dataAfter,
  }: {
    dataBefore: string | undefined;
    dataAfter: string | undefined;
  }) => {
    if (dataBefore && dataAfter) {
      return (
        <div className="StateChange__diff">
          {dataBefore === dataAfter ? (
            <div className="StateChange__noDiff">No-op update</div>
          ) : (
            renderDiffViewer({ dataBefore, dataAfter })
          )}
        </div>
      );
    }

    if (dataBefore) {
      return (
        <div className="StateChange__diff">
          {renderDiffViewer({ dataBefore: "", dataAfter: dataBefore })}
        </div>
      );
    }

    return null;
  };

  return (
    <Box gap="lg">
      {formattedData.map((item, index) => {
        const dataBefore = stringify(item.before.data, null, 2);
        const dataAfter = stringify(item.after?.data, null, 2);

        return (
          <Card key={`${item.title.toLocaleLowerCase()}-${index}`}>
            <Box gap="lg" justify="left" addlClassName="StateChange__item">
              <Badge variant="secondary" size="md">
                {item.title}
              </Badge>

              {renderDiffContent({ dataBefore, dataAfter })}
            </Box>
          </Card>
        );
      })}
    </Box>
  );
};
