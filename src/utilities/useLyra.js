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
  try {
    const lyraResponse = await getPublicKey();

    if (lyraResponse.error) {
      return lyraResponse.error;
    }
    return onUpdate(lyraResponse.publicKey);
  } catch (e) {
    console.log("error while getting a public key: ", e);
  }
};
