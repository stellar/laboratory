import React from 'react';

// Clicking an EasySelect element will select the contents
export let EasySelect = React.createClass({
  selectContents: function(event) {
    var range = document.createRange();
    range.selectNodeContents(event.target);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
  },
  render: function() {
    let className = 'EasySelect';
    if (this.props.plain) {
      className += ' EasySelect__plain'
    }

    return <span className={className} onClick={this.selectContents}>{this.props.children}</span>;
  }
});
