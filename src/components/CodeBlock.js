import React from 'react';

export let CodeBlock = React.createClass({
  propTypes: {
    code: React.PropTypes.string.isRequired,
    language: React.PropTypes.string,
  },
  getHighlightedCode: function() {
    return this.props.code;
  },
  // // Uncomment for performance improvements after verifying it works
  // shouldComponentUpdate: function(nextProps, nextState) {
  //   return nextProps.code !== this.props.code || nextProps.language !== this.props.language;
  // }
  render: function() {
    return <pre className="CodeBlock"><code className="CodeBlock__code">{this.getHighlightedCode()}</code></pre>;
  }
})
