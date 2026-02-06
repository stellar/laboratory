"use client";

import { JSX, useCallback, useLayoutEffect, useRef } from "react";

import { useStore } from "@/store/useStore";

import { localStorageSavedKeypairs } from "@/helpers/localStorageSavedKeypairs";
import { shortenStellarAddress } from "@/helpers/shortenStellarAddress";
import { truncateString } from "@/helpers/truncateString";

import { InputSideElement } from "@/components/InputSideElement";

import { SavedKeypair } from "@/types/types";

import "./styles.scss";

type SignerMode = "public" | "secret";

type ButtonProps = {
  mode: SignerMode;
  onClick: () => void;
};

type DropdownProps = {
  onChange: (val: string) => void;
  isOpen: boolean;
  onClose: () => void;
  mode: SignerMode;
};

interface SignerSelectorComponent {
  Button: (props: ButtonProps) => JSX.Element;
  Dropdown: (props: DropdownProps) => JSX.Element;
}

const getTitle = ({ mode }: { mode: SignerMode }) => {
  switch (mode) {
    case "public":
      return "Get address";
    case "secret":
      return "Use secret key";
    default:
      return "";
  }
};

const SignerSelectorButton = ({ mode, onClick }: ButtonProps): JSX.Element => {
  const { walletKit, network } = useStore();
  const { publicKey: walletKitPubKey } = walletKit || {};

  const savedLocalKeypairs = localStorageSavedKeypairs.get();

  const currentNetworkKeypairs = savedLocalKeypairs.filter(
    (keypair) => keypair.network.id === network.id,
  );

  const hasKeypairs = currentNetworkKeypairs.length > 0;
  const hasWallet = !!walletKitPubKey;

  const title = getTitle({ mode });

  // No sources available
  if (!hasKeypairs && !hasWallet) {
    return <></>;
  }

  // Secret mode requires saved keypairs
  if (mode === "secret" && !hasKeypairs) {
    return <></>;
  }

  // Public Signer mode with only wallet - show direct button
  if (mode === "public" && !hasKeypairs && hasWallet) {
    return (
      <InputSideElement variant="button" onClick={onClick} placement="right">
        Get connected wallet address
      </InputSideElement>
    );
  }

  return (
    <InputSideElement variant="button" onClick={onClick} placement="right">
      {title}
    </InputSideElement>
  );
};

const SignerSelectorDropdown = ({
  onChange,
  isOpen,
  onClose,
  mode,
}: DropdownProps): JSX.Element => {
  const { walletKit, network } = useStore();
  const { publicKey: walletKitPubKey } = walletKit || {};
  const savedLocalKeypairs = localStorageSavedKeypairs.get();

  const currentNetworkKeypairs = savedLocalKeypairs.filter(
    (keypair) => keypair.network.id === network.id,
  );
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      // Ignore the dropdown
      if (dropdownRef?.current?.contains(event.target as Node)) {
        return;
      }

      onClose();
    },
    [onClose],
  );

  useLayoutEffect(() => {
    if (isOpen) {
      document.addEventListener("pointerup", handleClickOutside);
    } else {
      document.removeEventListener("pointerup", handleClickOutside);
    }

    return () => {
      document.removeEventListener("pointerup", handleClickOutside);
    };
  }, [isOpen, handleClickOutside]);

  const getAvailableKeypairs = () => {
    const availableAddress = [];

    if (walletKitPubKey && mode === "public") {
      const saved = {
        label: "Connected Wallet",
        items: [{ publicKey: walletKitPubKey }],
      };
      availableAddress.push(saved);
    }

    if (currentNetworkKeypairs.length > 0) {
      const saved = {
        label: "Saved keypairs",
        items: currentNetworkKeypairs,
      };
      availableAddress.push(saved);
    }
    return availableAddress;
  };

  const signers = getAvailableKeypairs();

  if (!isOpen) {
    return <></>;
  }

  return (
    <div ref={dropdownRef} className="SignerSelector__dropdown">
      {signers.map((address, index) => {
        return (
          <OptionItem
            label={address.label}
            items={address.items}
            onChange={onChange}
            onClose={onClose}
            mode={mode}
            key={index}
          />
        );
      })}
    </div>
  );
};

const OptionItem = ({
  label,
  items,
  onChange,
  onClose,
  mode,
}: {
  label: string;
  items: Array<{ publicKey: string }> | SavedKeypair[];
  onChange: (val: string) => void;
  onClose: () => void;
  mode: SignerMode;
}) => {
  const renderKey = (item: SavedKeypair) => {
    return (
      <div className="SignerSelector__dropdown__item__value__keypair">
        <div className="keypair_name">[{truncateString(item.name, 55)}]</div>
        <div className="keypair_publickey">
          {shortenStellarAddress(item.publicKey)}
        </div>
      </div>
    );
  };

  return (
    <div
      className="SignerSelector__dropdown__item"
      data-testid="signer-selector-options"
    >
      <div className="SignerSelector__dropdown__item__label">{label}</div>
      {items.map((item) => {
        const isSavedKeypair = "secretKey" in item;

        return (
          <div
            className="SignerSelector__dropdown__item__value"
            key={item.publicKey}
            onClick={() => {
              const value = isSavedKeypair
                ? mode === "secret"
                  ? item.secretKey
                  : item.publicKey
                : item.publicKey;
              onChange(value);
              onClose();
            }}
          >
            {isSavedKeypair
              ? renderKey(item as SavedKeypair)
              : shortenStellarAddress(item.publicKey)}
          </div>
        );
      })}
    </div>
  );
};

export const SignerSelector = {
  Button: SignerSelectorButton,
  Dropdown: SignerSelectorDropdown,
} as SignerSelectorComponent;
