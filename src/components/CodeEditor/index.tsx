import { useEffect, useRef, useState } from "react";
import { Button, CopyText, Icon, Select } from "@stellar/design-system";
import MonacoEditor, { useMonaco, type OnMount } from "@monaco-editor/react";

import { useStore } from "@/store/useStore";
import { Box } from "@/components/layout/Box";
import { WithInfoText } from "@/components/WithInfoText";
import { downloadFile } from "@/helpers/downloadFile";

import "./styles.scss";

export type SupportedLanguage = "json" | "xdr" | "text" | "interface";

const LINE_HEIGHT_AND_PADDING_IN_PX = 20;

type CodeEditorProps = {
  title?: string;
  value: string;
  selectedLanguage: SupportedLanguage;
  fileName?: string;
  languages?: SupportedLanguage[];
  infoText?: React.ReactNode;
  infoLink?: string;
  onLanguageChange?: (newLanguage: SupportedLanguage) => void;
  heightInRem?: string;
  customEl?: React.ReactNode;
  customCss?: string;
  isAutoHeight?: boolean;
  maxHeightInRem?: string;
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
  customCss,
  isAutoHeight = false,
  maxHeightInRem,
}: CodeEditorProps) => {
  const { theme } = useStore();
  const monaco = useMonaco();
  const headerEl = useRef<HTMLDivElement | null>(null);

  const [isReady, setIsReady] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Default header height is 43px
  const headerHeight = headerEl?.current?.clientHeight || 43;

  const [autoHeight, setAutoHeight] = useState<string | null>(null);

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
      case "interface":
        return "txt";
      case "json":
      default:
        return selectedLanguage;
    }
  };

  const handleEditorDidMount: OnMount = (editor) => {
    const model = editor.getModel();
    const lineCount = model?.getLineCount() || 0;
    const titleHeight = title ? headerHeight : 0;

    if (isAutoHeight) {
      const calculatedHeight =
        lineCount * LINE_HEIGHT_AND_PADDING_IN_PX + titleHeight;

      setAutoHeight(`${calculatedHeight}`);
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

  const getCustomStyle = () => {
    if (autoHeight) {
      return {
        "--CodeEditor-height": `${autoHeight}px`,
        maxHeight: maxHeightInRem ? `${maxHeightInRem}rem` : "none",
      } as React.CSSProperties;
    }

    if (heightInRem) {
      return { "--CodeEditor-height": `${heightInRem}rem` } as React.CSSProperties;
    }

    return {};
  };

  const customStyle = getCustomStyle();

  return (
    <div
      className={`CodeEditor ${isExpanded ? "CodeEditor--expanded" : ""} ${customCss ? customCss : ""}`}
      style={customStyle}
    >
      {title ? (
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
      ) : null}

      {/* Content / editor */}
      <div
        className="CodeEditor__content"
        // Container must have set height
        style={{ height: title ? `calc(100% - ${headerHeight}px)` : "100%" }}
      >
        <MonacoEditor
          defaultLanguage="javascript"
          defaultValue=""
          language={
            selectedLanguage === "interface" ? "rust" : selectedLanguage
          }
          value={value}
          onMount={handleEditorDidMount}
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
