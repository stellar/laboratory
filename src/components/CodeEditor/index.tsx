import { useEffect, useRef, useState } from "react";
import { Button, CopyText, Icon } from "@stellar/design-system";
import MonacoEditor, { useMonaco } from "@monaco-editor/react";

import { useStore } from "@/store/useStore";
import { Box } from "@/components/layout/Box";
import { downloadFile } from "@/helpers/downloadFile";

import "./styles.scss";

type CodeEditorProps = {
  title: string;
  value: string;
  language: "json";
  fileName?: string;
};

export const CodeEditor = ({
  title,
  value,
  language,
  fileName,
}: CodeEditorProps) => {
  const { theme } = useStore();
  const monaco = useMonaco();
  const headerEl = useRef<HTMLDivElement | null>(null);

  const [isReady, setIsReady] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Default header height is 43px
  const headerHeight = headerEl?.current?.clientHeight || 43;

  useEffect(() => {
    if (typeof window !== "undefined" && monaco) {
      setIsReady(true);
    }
  }, [monaco]);

  if (!isReady) {
    return null;
  }

  return (
    <div className={`CodeEditor ${isExpanded ? "CodeEditor--expanded" : ""}`}>
      <div className="CodeEditor__header" ref={headerEl}>
        {/* Title */}
        <div className="CodeEditor__header__title">{title}</div>

        {/* Actions */}
        <Box gap="xs" direction="row" align="center" justify="end">
          <>
            {fileName ? (
              <Button
                variant="tertiary"
                size="sm"
                icon={<Icon.Download01 />}
                title="Download"
                onClick={(e) => {
                  e.preventDefault();

                  downloadFile({
                    value,
                    fileType: "application/json",
                    fileName,
                    fileExtension: language,
                  });
                }}
              ></Button>
            ) : null}
          </>

          <CopyText textToCopy={value}>
            <Button
              variant="tertiary"
              size="sm"
              icon={<Icon.Copy01 />}
              title="Copy"
              onClick={(e) => {
                e.preventDefault();
              }}
            ></Button>
          </CopyText>

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
        // Container must have set height
        style={{ height: `calc(100% - ${headerHeight}px)` }}
      >
        <MonacoEditor
          defaultLanguage="javascript"
          defaultValue=""
          language={language}
          value={value}
          options={{
            minimap: { enabled: false },
            readOnly: true,
            scrollBeyondLastLine: false,
            padding: { top: 8, bottom: 8 },
          }}
          theme={theme === "sds-theme-light" ? "light" : "vs-dark"}
        />
      </div>
    </div>
  );
};
