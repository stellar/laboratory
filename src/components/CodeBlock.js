import React from 'react';
import Prism from '../utilities/prism.js';

// @param {string} language - key for the code language. available languages can
//   be discovered by doing a console log on `Prism.languages`. More can be added
//   in the prism.js

export let CodeBlock = React.createClass({
  propTypes: {
    code: React.PropTypes.string.isRequired,
    language: React.PropTypes.string,
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    return nextProps.code !== this.props.code || nextProps.language !== this.props.language;
  },
  getHighlightedCode: function() {
    return Prism.highlight(this.props.code, Prism.languages[this.props.language]);
  },
  render: function() {
    let className = 'CodeBlock__code language-' + this.props.language;
    let innerHtml = { __html: this.getHighlightedCode() };
    return <pre className="CodeBlock">
      <code className={className} dangerouslySetInnerHTML={innerHtml}></code>
    </pre>;
  }
})
