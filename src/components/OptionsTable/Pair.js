import React from 'react';

export default function Pair(props) {
  let optionalTextBreak, optionalText;
  if (props.optional) {
    optionalTextBreak = <br />
    optionalText = <span className="optionsTable__pair__title__optional"> (optional)</span>;
  }

  return <div className="optionsTable__pair">
    <div className="optionsTable__pair__title">
      {props.label} {optionalTextBreak}{optionalText}
    </div>
    <div className="optionsTable__pair__content">
      {props.children}
    </div>
  </div>
}
