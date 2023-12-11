import Prism from "helpers/prism.js";
import jsonLinkHighlighter from "helpers/prism-jsonLinkHighlighter.js";
import scrollOnAnchorOpen from "helpers/scrollOnAnchorOpen.js";
import { sanitizeHtml } from "helpers/sanitizeHtml";

interface CodeBlockProps {
  code: string;
  language: string;
  className?: string;
}

export const CodeBlock = ({
  code,
  language = "json",
  className,
}: CodeBlockProps) => {
  const getHighlightedCode = () => {
    const highlightedCode = Prism.highlight(code, Prism.languages[language]);

    if (language === "json") {
      return jsonLinkHighlighter(highlightedCode);
    }

    return highlightedCode;
  };

  return (
    <pre
      className={`CodeBlock ${className ?? ""}`}
      onClick={scrollOnAnchorOpen}
    >
      <code className={`CodeBlock__code language-${language}`}>
        {sanitizeHtml(getHighlightedCode())}
      </code>
    </pre>
  );
};
