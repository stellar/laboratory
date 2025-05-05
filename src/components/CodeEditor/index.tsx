import { useEffect, useRef, useState } from "react";
import { Button, CopyText, Icon, Select } from "@stellar/design-system";
import MonacoEditor, { useMonaco } from "@monaco-editor/react";

import { useStore } from "@/store/useStore";
import { Box } from "@/components/layout/Box";
import { WithInfoText } from "@/components/WithInfoText";
import { downloadFile } from "@/helpers/downloadFile";

import "./styles.scss";

export type SupportedLanguage = "json" | "xdr" | "text";

type CodeEditorProps = {
  title: string;
  value: string;
  selectedLanguage: SupportedLanguage;
  fileName?: string;
  languages?: SupportedLanguage[];
  infoText?: React.ReactNode;
  infoLink?: string;
  onLanguageChange?: (newLanguage: SupportedLanguage) => void;
  heightInRem?: string;
  customEl?: React.ReactNode;
};

export const CodeEditor = ({
  title,
  value,
  selectedLanguage,
  fileName,
  languages,
  infoText,
  infoLink,
  onLanguageChange,
  heightInRem,
  customEl,
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

  const getFileExtension = () => {
    switch (selectedLanguage) {
      case "xdr":
        return "txt";
      case "json":
      default:
        return selectedLanguage;
    }
  };

  const renderTitle = () => {
    if (infoText) {
      return <WithInfoText infoText={infoText}>{title}</WithInfoText>;
    }

    if (infoLink) {
      return <WithInfoText href={infoLink}>{title}</WithInfoText>;
    }

    return title;
  };

  const customStyle = {
    ...(heightInRem ? { "--CodeEditor-height": `${heightInRem}rem` } : {}),
  } as React.CSSProperties;

  return (
    <div
      className={`CodeEditor ${isExpanded ? "CodeEditor--expanded" : ""}`}
      style={customStyle}
    >
      <div className="CodeEditor__header" ref={headerEl}>
        {/* Title */}
        <div className="CodeEditor__header__title">{renderTitle()}</div>

        {/* Actions */}
        <Box
          gap="xs"
          direction="row"
          align="center"
          justify="end"
          addlClassName="CodeEditor__actions"
        >
          {customEl ?? null}
          {languages && onLanguageChange ? (
            <Select
              id="code-editor-languages"
              fieldSize="sm"
              onChange={(e) =>
                onLanguageChange(e.target.value as SupportedLanguage)
              }
              value={selectedLanguage}
            >
              {languages.map((l) => (
                <option value={l} key={`ce-lang-${l}`}>
                  {l.toUpperCase()}
                </option>
              ))}
            </Select>
          ) : null}

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
                  fileExtension: getFileExtension(),
                });
              }}
            ></Button>
          ) : null}

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
          language={selectedLanguage}
          value={value}
          options={{
            minimap: { enabled: false },
            readOnly: true,
            scrollBeyondLastLine: false,
            padding: { top: 8, bottom: 8 },
            wordWrap: "on",
          }}
          theme={theme === "sds-theme-light" ? "light" : "vs-dark"}
        />
      </div>
    </div>
  );
};
