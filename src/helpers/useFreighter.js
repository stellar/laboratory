/** @format */
import React from "react";
import { isConnected, getPublicKey } from "@stellar/freighter-api";

export const useFreighter = () => {
  const [hasFreighter, setHasFreighter] = React.useState(false);

  React.useEffect(async () => {
    setHasFreighter(await isConnected());
  });
  return hasFreighter;
};

export const freighterGetPublicKey = async (onUpdate) => {
  let freighterPublicKey = "";
  let error = "";

  try {
    const freighterResponse = await getPublicKey();
    freighterPublicKey = freighterResponse;
  } catch (e) {
    error = e;
  }

  return onUpdate(freighterPublicKey || error);
};
