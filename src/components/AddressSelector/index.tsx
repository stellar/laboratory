"use client";

import { JSX, useEffect, useRef } from "react";
import { Icon } from "@stellar/design-system";

import { useStore } from "@/store/useStore";

import { localStorageSavedKeypairs } from "@/helpers/localStorageSavedKeypairs";
import { localStorageSavedContracts } from "@/helpers/localStorageSavedContracts";
import { shortenStellarAddress } from "@/helpers/shortenStellarAddress";
import { truncateString } from "@/helpers/truncateString";

import { InputSideElement } from "@/components/InputSideElement";

import { SavedContract, SavedKeypair } from "@/types/types";

import "./styles.scss";

// "ScAddress" - built in type 'address' in Soroban which can
// include both a 'classic' Stellar account, custom account, or contract
type AddressMode = "public" | "secret" | "ScAddress" | "contract";
type AddressOptionKind = "wallet" | "keypair" | "contract";

type WalletItem = { publicKey: string };
type AddressOptionItem = WalletItem | SavedKeypair | SavedContract;

type AddressOptionGroup = {
  label: string;
  kind: AddressOptionKind;
  items: AddressOptionItem[];
};

type ButtonProps = {
  mode: AddressMode;
  onClick: () => void;
};

type DropdownProps = {
  // Called with the selected address (public key, secret key, or contract id).
  onChange: (val: string) => void;
  isOpen: boolean;
  onClose: () => void;
  mode: AddressMode;
};

interface AddressSelectorComponent {
  Button: (props: ButtonProps) => JSX.Element;
  Dropdown: (props: DropdownProps) => JSX.Element;
}

const getTitle = ({ mode }: { mode: AddressMode }) => {
  switch (mode) {
    case "public":
    case "ScAddress":
      return "Get address";
    case "secret":
      return "Use secret key";
    case "contract":
      return "Get contract ID";
    default:
      return "";
  }
};

const AddressSelectorButton = ({ mode, onClick }: ButtonProps): JSX.Element => {
  const { walletKit, network } = useStore();
  const { publicKey: walletKitPubKey } = walletKit || {};

  const savedLocalKeypairs = localStorageSavedKeypairs.get();

  const currentNetworkKeypairs = savedLocalKeypairs.filter(
    (keypair) => keypair.network.id === network.id,
  );

  const currentNetworkContracts =
    mode === "ScAddress" || mode === "contract"
      ? localStorageSavedContracts
          .get()
          .filter((contract) => contract.network.id === network.id)
      : [];

  const hasKeypairs = currentNetworkKeypairs.length > 0;
  const hasContracts = currentNetworkContracts.length > 0;
  const hasWallet = !!walletKitPubKey;

  const title = getTitle({ mode });

  // No sources available
  if (!hasKeypairs && !hasWallet && !hasContracts) return <></>;

  // Secret mode requires saved keypairs
  if (mode === "secret" && !hasKeypairs) return <></>;

  if (mode === "contract" && !hasContracts) return <></>;

  // Public Address mode with only wallet - show direct button
  if (mode === "public" && !hasKeypairs && !hasContracts && hasWallet) {
    return (
      <InputSideElement variant="button" onClick={onClick} placement="right">
        Get connected wallet address
      </InputSideElement>
    );
  }

  return (
    <InputSideElement
      variant="button"
      onClick={onClick}
      placement="right"
      icon={<Icon.ChevronDown />}
    >
      {title}
    </InputSideElement>
  );
};

const AddressSelectorDropdown = ({
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

  const currentNetworkContracts =
    mode === "ScAddress" || mode === "contract"
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

  const getAvailableOptions = (): AddressOptionGroup[] => {
    const availableOptions: AddressOptionGroup[] = [];

    if (mode === "contract") {
      availableOptions.push({
        label: "Saved contracts",
        kind: "contract",
        items: currentNetworkContracts,
      });
      return availableOptions;
    }

    if (walletKitPubKey && (mode === "public" || mode === "ScAddress")) {
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
    <div ref={dropdownRef} className="AddressSelector__dropdown">
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
  <div className="AddressSelector__dropdown__item__label">
    <div>{label}</div>

    {columnLabel ? (
      <div className="AddressSelector__dropdown__item__label__savedKeypairs">
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
  kind: AddressOptionKind;
  items: AddressOptionItem[];
  onChange: (val: string) => void;
  onClose: () => void;
  mode: AddressMode;
}) => {
  // The address a given item resolves to in the input field.
  const getAddress = (item: AddressOptionItem) => {
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
      <div className="AddressSelector__dropdown__item__value__keypair">
        <div className="keypair_name">[{truncateString(name, 55)}]</div>
        <div className="keypair_publickey">
          {shortenStellarAddress(address)}
        </div>
      </div>
    );
  };

  const renderItem = (item: AddressOptionItem) => {
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
      className="AddressSelector__dropdown__item"
      data-testid="address-selector-options"
    >
      {getLabel(label, getColumnLabel())}

      {items.map((item, index) => {
        const address = getAddress(item);

        return (
          <button
            type="button"
            className="AddressSelector__dropdown__item__value"
            key={`${address}-${index}`}
            onClick={() => {
              onChange(address);
              onClose();
            }}
          >
            {renderItem(item)}
          </button>
        );
      })}
    </div>
  );
};

export const AddressSelector = {
  Button: AddressSelectorButton,
  Dropdown: AddressSelectorDropdown,
} as AddressSelectorComponent;
