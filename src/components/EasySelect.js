import React from 'react';
import clickToSelect from '../utilities/clickToSelect';

// Clicking an EasySelect element will select the contents
export let EasySelect = React.createClass({
  render: function() {
    let className = 'EasySelect';
    if (this.props.plain) {
      className += ' EasySelect__plain'
    }

    return <span className={className} onClick={clickToSelect}>{this.props.children}</span>;
  }
});
