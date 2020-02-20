import React from "react";
import PropTypes from "prop-types";
import Prism from "../utilities/prism.js";
import jsonLinkHighlighter from "../utilities/prism-jsonLinkHighlighter";
import scrollOnAnchorOpen from "../utilities/scrollOnAnchorOpen";

// @param {string} language - key for the code language. available languages can
//   be discovered by doing a console log on `Prism.languages`. More can be added
//   in the prism.js

export class CodeBlock extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.code !== this.props.code ||
      nextProps.language !== this.props.language
    );
  }
  getHighlightedCode() {
    let highlightedCode = Prism.highlight(
      this.props.code,
      Prism.languages[this.props.language],
    );
    if (this.props.language === "json") {
      return jsonLinkHighlighter(highlightedCode);
    }
    return highlightedCode;
  }
  render() {
    let className = "CodeBlock__code language-" + this.props.language;
    let innerHtml = { __html: this.getHighlightedCode() };
    return (
      <pre
        className={"CodeBlock " + this.props.className}
        onClick={scrollOnAnchorOpen}
      >
        <code className={className} dangerouslySetInnerHTML={innerHtml}></code>
      </pre>
    );
  }
}

CodeBlock.propTypes = {
  code: PropTypes.string.isRequired,
  language: PropTypes.string,
};
