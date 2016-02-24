import React from 'react';

// @param {string} props.href - Url that the help mark links to. Currently required
function HelpMark(props) {
  return <a href={props.href} className="HelpMark" target="_blank"></a>
};
HelpMark.propTypes = {
  href: React.PropTypes.string.isRequired,
};

export default HelpMark;
