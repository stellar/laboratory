/** @format */
import React from "react";

export const ImportMark = ({ width = 32, height = width, ...props }) => (
  <svg
    {...props}
    width={width}
    height={height}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 50 52"
    aria-labelledby="importMarkTitle"
    role="img"
  >
    ><title id="importMarkTitle">Import Public Key via Freighter Button</title>
    <path
      fillRule="nonzero"
      d="M1.8 1A1 1 0 001 2v48c0 .6.4 1 1 1h30c.6 0 1-.4 1-1V40h-2v9H3V3h28v9h2V2c0-.6-.4-1-1-1H2h-.2zm23 15a1 1 0 00-.6.4l-9 8.9-.6.7.7.7 8.9 8.9a1 1 0 001.7-.4c.1-.4 0-.8-.3-1L18.4 27H48c.4 0 .7-.2.9-.5a1 1 0 000-1 1 1 0 00-.9-.5H18.4l7.2-7.2a1 1 0 00-.8-1.7z"
    />
  </svg>
);
