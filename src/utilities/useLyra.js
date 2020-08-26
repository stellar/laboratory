/** @format */
import React from "react";
import { isConnected } from "@stellar/lyra-api";

export const useLyra = () => {
  const [hasLyra, setHasLyra] = React.useState(false);

  React.useEffect(() => {
    setHasLyra(isConnected());
  });
  return hasLyra;
};
