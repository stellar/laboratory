"use client";

import { JSX, useEffect, useRef } from "react";

import { useStore } from "@/store/useStore";

import { localStorageSavedContracts } from "@/helpers/localStorageSavedContracts";
import { shortenStellarAddress } from "@/helpers/shortenStellarAddress";
import { truncateString } from "@/helpers/truncateString";

import { InputSideElement } from "@/components/InputSideElement";

import "./styles.scss";

type ButtonProps = {
  onClick: () => void;
};

type DropdownProps = {
  onChange: (val: string) => void;
  isOpen: boolean;
  onClose: () => void;
};

interface ContractSelectorComponent {
  Button: (props: ButtonProps) => JSX.Element;
  Dropdown: (props: DropdownProps) => JSX.Element;
}

/**
 * Returns the saved contracts from localStorage filtered to the current
 * network.
 */
const useSavedContractsForNetwork = () => {
  const { network } = useStore();

  return localStorageSavedContracts
    .get()
    .filter((contract) => contract.network.id === network.id);
};

const ContractSelectorButton = ({ onClick }: ButtonProps): JSX.Element => {
  const savedContracts = useSavedContractsForNetwork();

  // No saved contracts for the current network — nothing to select from.
  if (savedContracts.length === 0) {
    return <></>;
  }

  return (
    <InputSideElement variant="button" onClick={onClick} placement="right">
      Saved contracts
    </InputSideElement>
  );
};

const ContractSelectorDropdown = ({
  onChange,
  isOpen,
  onClose,
}: DropdownProps): JSX.Element => {
  const savedContracts = useSavedContractsForNetwork();
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

  if (!isOpen || savedContracts.length === 0) {
    return <></>;
  }

  return (
    <div ref={dropdownRef} className="ContractSelector__dropdown">
      <div
        className="ContractSelector__dropdown__item"
        data-testid="contract-selector-options"
      >
        <div className="ContractSelector__dropdown__item__label">
          <div>Saved contracts</div>
          <div className="ContractSelector__dropdown__item__label__note">
            Contract ID
          </div>
        </div>

        {savedContracts.map((contract, index) => (
          <div
            className="ContractSelector__dropdown__item__value"
            key={`${contract.contractId}-${index}`}
            onClick={() => {
              onChange(contract.contractId);
              onClose();
            }}
          >
            <div className="ContractSelector__dropdown__item__value__contract">
              <div className="contract_name">
                [{truncateString(contract.name, 55)}]
              </div>
              <div className="contract_id">
                {shortenStellarAddress(contract.contractId)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ContractSelector = {
  Button: ContractSelectorButton,
  Dropdown: ContractSelectorDropdown,
} as ContractSelectorComponent;
