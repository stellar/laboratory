/** @format */
import React from "react";
import { isConnected, getPublicKey } from "@stellar/lyra-api";

export const useLyra = () => {
  const [hasLyra, setHasLyra] = React.useState(false);

  React.useEffect(() => {
    setHasLyra(isConnected());
  });
  return hasLyra;
};

export const lyraGetPublicKey = async (onUpdate) => {
  let lyraPublicKey = "";
  let error = "";

  try {
    const lyraResponse = await getPublicKey();
    lyraPublicKey = lyraResponse.publicKey;
  } catch (e) {
    error = e;
  }

  return onUpdate(lyraPublicKey || error);
};
