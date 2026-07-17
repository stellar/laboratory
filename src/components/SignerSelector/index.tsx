"use client";

import { JSX, useEffect, useRef } from "react";

import { useStore } from "@/store/useStore";

import { localStorageSavedKeypairs } from "@/helpers/localStorageSavedKeypairs";
import { localStorageSavedContracts } from "@/helpers/localStorageSavedContracts";
import { shortenStellarAddress } from "@/helpers/shortenStellarAddress";
import { truncateString } from "@/helpers/truncateString";

import { InputSideElement } from "@/components/InputSideElement";

import { SavedContract, SavedKeypair } from "@/types/types";

import "./styles.scss";

type SignerMode = "public" | "secret";

// "wallet" and "keypair" resolve to a public/secret key, while "contract"
// resolves to a contract address.
type SignerOptionKind = "wallet" | "keypair" | "contract";

type WalletItem = { publicKey: string };
type SignerOptionItem = WalletItem | SavedKeypair | SavedContract;

type SignerOptionGroup = {
  label: string;
  kind: SignerOptionKind;
  items: SignerOptionItem[];
};

type ButtonProps = {
  mode: SignerMode;
  onClick: () => void;
  // Smart contract addresses are only valid in some contexts (e.g. the
  // JsonSchema `address` field), so they are opt-in.
  includeContracts?: boolean;
};

type DropdownProps = {
  onChange: (val: string) => void;
  isOpen: boolean;
  onClose: () => void;
  mode: SignerMode;
  includeContracts?: boolean;
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

const SignerSelectorButton = ({
  mode,
  onClick,
  includeContracts = false,
}: ButtonProps): JSX.Element => {
  const { walletKit, network } = useStore();
  const { publicKey: walletKitPubKey } = walletKit || {};

  const savedLocalKeypairs = localStorageSavedKeypairs.get();

  const currentNetworkKeypairs = savedLocalKeypairs.filter(
    (keypair) => keypair.network.id === network.id,
  );

  // Contracts only apply in public mode (they have no secret key to sign with).
  const showContracts = includeContracts && mode === "public";
  const currentNetworkContracts = showContracts
    ? localStorageSavedContracts
        .get()
        .filter((contract) => contract.network.id === network.id)
    : [];

  const hasKeypairs = currentNetworkKeypairs.length > 0;
  const hasContracts = currentNetworkContracts.length > 0;
  const hasWallet = !!walletKitPubKey;

  const title = getTitle({ mode });

  // No sources available
  if (!hasKeypairs && !hasWallet && !hasContracts) {
    return <></>;
  }

  // Secret mode requires saved keypairs
  if (mode === "secret" && !hasKeypairs) {
    return <></>;
  }

  // Public Signer mode with only wallet - show direct button
  if (mode === "public" && !hasKeypairs && !hasContracts && hasWallet) {
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
  includeContracts = false,
}: DropdownProps): JSX.Element => {
  const { walletKit, network } = useStore();
  const { publicKey: walletKitPubKey } = walletKit || {};
  const savedLocalKeypairs = localStorageSavedKeypairs.get();

  const currentNetworkKeypairs = savedLocalKeypairs.filter(
    (keypair) => keypair.network.id === network.id,
  );

  // Contracts only apply in public mode (they have no secret key to sign with).
  const showContracts = includeContracts && mode === "public";
  const currentNetworkContracts = showContracts
    ? localStorageSavedContracts
        .get()
        .filter((contract) => contract.network.id === network.id)
    : [];
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close the dropdown on any click outside of it. The listener lives on
  // `document` (an external system), so it's attached imperatively in an effect
  // and torn down when the dropdown closes or unmounts.
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      // Ignore clicks inside the dropdown itself
      if (dropdownRef.current?.contains(event.target as Node)) {
        return;
      }

      onClose();
    };

    document.addEventListener("pointerup", handleClickOutside);
    return () => {
      document.removeEventListener("pointerup", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const getAvailableOptions = (): SignerOptionGroup[] => {
    const availableOptions: SignerOptionGroup[] = [];

    if (walletKitPubKey && mode === "public") {
      availableOptions.push({
        label: "Connected Wallet",
        kind: "wallet",
        items: [{ publicKey: walletKitPubKey }],
      });
    }

    if (currentNetworkKeypairs.length > 0) {
      availableOptions.push({
        label: "Saved keypairs",
        kind: "keypair",
        items: currentNetworkKeypairs,
      });
    }

    if (currentNetworkContracts.length > 0) {
      availableOptions.push({
        label: "Saved contracts",
        kind: "contract",
        items: currentNetworkContracts,
      });
    }

    return availableOptions;
  };

  const options = getAvailableOptions();

  if (!isOpen) {
    return <></>;
  }

  return (
    <div ref={dropdownRef} className="SignerSelector__dropdown">
      {options.map((option, index) => {
        return (
          <OptionItem
            label={option.label}
            kind={option.kind}
            items={option.items}
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

const getLabel = (label: string, columnLabel: string | null) => (
  <div className="SignerSelector__dropdown__item__label">
    <div>{label}</div>

    {columnLabel ? (
      <div className="SignerSelector__dropdown__item__label__savedKeypairs">
        {columnLabel}
      </div>
    ) : null}
  </div>
);

const OptionItem = ({
  label,
  kind,
  items,
  onChange,
  onClose,
  mode,
}: {
  label: string;
  kind: SignerOptionKind;
  items: SignerOptionItem[];
  onChange: (val: string) => void;
  onClose: () => void;
  mode: SignerMode;
}) => {
  // The address a given item resolves to in the input field.
  const getAddress = (item: SignerOptionItem) => {
    if (kind === "contract") {
      return (item as SavedContract).contractId;
    }

    if (kind === "keypair" && mode === "secret") {
      return (item as SavedKeypair).secretKey;
    }

    return (item as WalletItem).publicKey;
  };

  // Tag shown in the right column of the group label.
  const getColumnLabel = () => {
    switch (kind) {
      case "keypair":
        return "Public key";
      case "contract":
        return "Contract ID";
      default:
        return null;
    }
  };

  const renderNamedItem = (name: string, address: string) => {
    return (
      <div className="SignerSelector__dropdown__item__value__keypair">
        <div className="keypair_name">[{truncateString(name, 55)}]</div>
        <div className="keypair_publickey">
          {shortenStellarAddress(address)}
        </div>
      </div>
    );
  };

  const renderItem = (item: SignerOptionItem) => {
    if (kind === "keypair") {
      const keypair = item as SavedKeypair;
      return renderNamedItem(keypair.name, keypair.publicKey);
    }

    if (kind === "contract") {
      const contract = item as SavedContract;
      return renderNamedItem(contract.name, contract.contractId);
    }

    return shortenStellarAddress((item as WalletItem).publicKey);
  };

  return (
    <div
      className="SignerSelector__dropdown__item"
      data-testid="signer-selector-options"
    >
      {getLabel(label, getColumnLabel())}

      {items.map((item, index) => {
        const address = getAddress(item);

        return (
          <div
            className="SignerSelector__dropdown__item__value"
            key={`${address}-${index}`}
            onClick={() => {
              onChange(address);
              onClose();
            }}
          >
            {renderItem(item)}
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
