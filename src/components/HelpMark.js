import React from 'react';

// @param {string} props.href - Url that the help mark links to. Currently required
function HelpMark(props) {
  return <a href={props.href} className="HelpMark" target="_blank">
    <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><g>
      <circle className="HelpMark__circle" fill="#E3E41E" cx="10" cy="10" r="10"/>
      <path className="HelpMark__questionMark" d="M9 12.73V10.2c.58-.25 1.08-.5 1.5-.73.42-.23.77-.46 1.05-.7.28-.24.48-.5.6-.75.15-.26.2-.55.2-.87 0-.5-.15-.9-.48-1.2-.33-.3-.83-.44-1.5-.44-.3 0-.55.04-.78.1A2.25 2.25 0 0 0 8.1 6.77l-1.7-1.04A3.8 3.8 0 0 1 7.9 4.26a5 5 0 0 1 2.45-.53c.57 0 1.1.06 1.62.2.5.1.94.3 1.3.58a2.9 2.9 0 0 1 1.22 2.47c0 .53-.1 1-.3 1.4-.2.4-.45.77-.78 1.1-.32.3-.7.6-1.13.86-.44.26-.88.5-1.34.74v1.66H9zm2.25 2.37c0 .45-.1.75-.3.92-.2.17-.52.25-.96.25-.25 0-.45-.02-.6-.07a.82.82 0 0 1-.6-.58 1.9 1.9 0 0 1-.06-.52c0-.4.1-.7.28-.9.2-.18.5-.27.97-.27.45 0 .78.1.96.28.2.2.3.5.3.9z" fill="#3B4151"/>
    </g></svg>
  </a>
};
HelpMark.propTypes = {
  href: React.PropTypes.string.isRequired,
};

export default HelpMark;
