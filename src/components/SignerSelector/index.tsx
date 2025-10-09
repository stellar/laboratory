import React from "react";
import { Button, Icon } from "@stellar/design-system";

import { useStore } from "@/store/useStore";

import { localStorageSavedKeypairs } from "@/helpers/localStorageSavedKeypairs";
import { shortenStellarAddress } from "@/helpers/shortenStellarAddress";

import { FloaterDropdown } from "@/components/FloaterDropdown";

import { SavedKeypair } from "@/types/types";

import "./styles.scss";

type SignerMode = "public" | "secret";

export type SignerSelectorProps = {
  mode: "public" | "secret";
  onChange: (val: string) => void;
};

const getTitle = ({ mode }: { mode: SignerMode }) => {
  switch (mode) {
    case "public":
      return "Get address";
    case "secret":
      return "Use secret key";
  }
};

export const SignerSelector = ({ mode, onChange }: SignerSelectorProps) => {
  const { walletKit } = useStore();
  const { publicKey: walletKitPubKey } = walletKit || {};
  const title = getTitle({ mode });

  const savedLocalKeypairs = localStorageSavedKeypairs.get();

  const getAvailableKeypairs = () => {
    const availableAddress = [];

    if (walletKitPubKey && mode === "public") {
      const saved = {
        label: "Connected Wallet",
        items: walletKitPubKey,
      };
      availableAddress.push(saved);
    }

    if (savedLocalKeypairs) {
      const saved = {
        label: "Saved Keypairs",
        items: localStorageSavedKeypairs.get(),
      };
      availableAddress.push(saved);
    }
    return availableAddress;
  };

  const signers = getAvailableKeypairs();

  if (!signers.length) {
    return null;
  }

  return (
    <div className="SignerSelector">
      <FloaterDropdown
        addlClassName="SignerSelector__dropdown"
        hasActiveInsideClick
        triggerEl={
          <Button size="md" variant="tertiary" icon={<Icon.ChevronDown />}>
            {title}
          </Button>
        }
      >
        <>
          {signers.map((address, index) => {
            return (
              <OptionItems
                label={address.label}
                items={address.items}
                onChange={onChange}
                mode={mode}
                key={index}
              />
            );
          })}
        </>
      </FloaterDropdown>
    </div>
  );
};

const OptionItems = ({
  label,
  items,
  onChange,
  mode,
}: {
  label: string;
  items: string | SavedKeypair[];
  onChange: (val: string) => void;
  mode: SignerMode;
}) => {
  const itemsArray: Array<SavedKeypair | { publicKey: string }> = Array.isArray(
    items,
  )
    ? items
    : [{ publicKey: items }];

  const renderKey = (item: SavedKeypair): { label: string; value: string } => ({
    label: shortenStellarAddress(item.publicKey),
    value: mode === "secret" ? item.secretKey : item.publicKey,
  });

  return (
    <div className="SignerSelector__options">
      <div className="SignerSelector__options__item__label">{label}</div>
      {itemsArray.map((item, index) => {
        const isSavedKeypair = "secretKey" in item;

        return (
          <div
            className="SignerSelector__options__item__value"
            key={item.publicKey}
            onClick={() => {
              const value = isSavedKeypair
                ? renderKey(item as SavedKeypair).value
                : item.publicKey;
              onChange(value);
            }}
          >
            {isSavedKeypair
              ? `[Test Keypair ${index + 1}] ${renderKey(item as SavedKeypair).label}`
              : shortenStellarAddress(item.publicKey)}
          </div>
        );
      })}
    </div>
  );
};
