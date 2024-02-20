"use client";

// TODO: update Network selector. This is a demo for state/store.

import { useCallback, useEffect } from "react";
import { Select } from "@stellar/design-system";
import { useStore } from "@/store/useStore";

export const NetworkSelector = () => {
  const { network, selectNetwork } = useStore();

  const setNetwork = useCallback(() => {
    if (!network?.id) {
      // TODO: get from local storage
      selectNetwork({
        id: "testnet",
        label: "testnet",
        url: "",
        passphrase: "",
      });
    }
  }, [network?.id, selectNetwork]);

  // Set default network on launch
  useEffect(() => {
    setNetwork();
  }, [setNetwork]);

  return (
    <div>
      {`Network: ${network?.id}`}
      <Select
        id="network"
        fieldSize="sm"
        onChange={(event) =>
          selectNetwork({
            id: event.target.value,
            label: event.target.value,
            url: `url-${event.target.value}`,
            passphrase: `passphrase-${event.target.value}`,
          })
        }
        value={network?.id || ""}
      >
        <option value=""></option>
        <option value="testnet">testnet</option>
        <option value="mainnet">mainnet</option>
        <option value="futurenet">futurenet</option>
      </Select>
    </div>
  );
};
