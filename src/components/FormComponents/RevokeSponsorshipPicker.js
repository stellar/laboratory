import React from "react";
import PropTypes from "prop-types";
import assign from "lodash/assign";

import AssetPicker from './AssetPicker.js';
import OptionsTablePair from "../OptionsTable/Pair";
import PubKeyPicker from "./PubKeyPicker";
import SelectPicker from './SelectPicker';
import SignerPicker from './SignerPicker';
import TextPicker from './TextPicker.js';

// Value is a string containing the currently selected id (or undefined)
export default function RevokeSponsorshipPicker({ value, onUpdate, ...props }) {
  const localValue = assign({ type: "", fields: {} }, value);
  const selectedType = localValue.type;

  const revokeTypes = {
    account: "Account",
    trustline: "Trustline",
    offer: "Offer",
    data: "Data",
    claimableBalance: "Claimable Balance",
    signer: "Signer",
  };

  const fields = {
    account: {
      account: "",
    },
    trustline: {
      account: "",
      asset: "",
    },
    offer: {
      seller: "",
      offerId: "",
    },
    data: {
      account: "",
      name: "",
    },
    claimableBalance: {
      balanceId: "",
    },
    signer: {
      account: "",
      signer: "",
    },
  };

  function renderTypeFields() {
    if (!selectedType) {
      return null;
    }

    function handleUpdate(value, field) {
      onUpdate(
        assign({}, localValue, {
          fields: {
            ...localValue.fields,
            [field]: value,
          },
        }),
      );
    }

    switch(selectedType) {
      case "account":
        return <OptionsTablePair label="Account" key="account">
          <PubKeyPicker
            value={localValue.fields["account"]}
            onUpdate={(value) => handleUpdate(value, "account")}
          />
        </OptionsTablePair>;
      case "trustline":
        return <>
          <OptionsTablePair label="Account" key="account">
            <PubKeyPicker
              value={localValue.fields["account"]}
              onUpdate={(value) => handleUpdate(value, "account")}
            />
          </OptionsTablePair>
          <OptionsTablePair label="Asset" key="asset">
            <AssetPicker
              value={localValue.fields["asset"]}
              onUpdate={(value) => handleUpdate(value, "asset")}
            />
          </OptionsTablePair>
        </>;
      case "offer":
        return <>
          <OptionsTablePair label="Seller" key="seller">
            <PubKeyPicker
              value={localValue.fields["seller"]}
              onUpdate={(value) => handleUpdate(value, "seller")}
            />
          </OptionsTablePair>
          <OptionsTablePair label="Offer ID" key="offerId">
            <TextPicker
              value={localValue.fields["offerId"]}
              onUpdate={(value) => handleUpdate(value, "offerId")}
            />
            <p className="optionsTable__pair__content__note">Offer ID is a number</p>
          </OptionsTablePair>
        </>;
      case "data":
        return <>
          <OptionsTablePair label="Account" key="account">
            <PubKeyPicker
              value={localValue.fields["account"]}
              onUpdate={(value) => handleUpdate(value, "account")}
            />
          </OptionsTablePair>
          <OptionsTablePair label="Name" key="name" optional>
            <TextPicker
              value={localValue.fields["name"]}
              onUpdate={(value) => handleUpdate(value, "name")}
            />
          </OptionsTablePair>
        </>;
      case "claimableBalance":
        return <OptionsTablePair label="Balance ID" key="balanceId">
          <TextPicker
            value={localValue.fields["balanceId"]}
            onUpdate={(value) => handleUpdate(value, "balanceId")}
          />
        </OptionsTablePair>;
      case "signer":
        return <>
          <OptionsTablePair label="Account" key="account">
            <PubKeyPicker
              value={localValue.fields["account"]}
              onUpdate={(value) => handleUpdate(value, "account")}
            />
          </OptionsTablePair>
          <OptionsTablePair label="Signer" key="signer">
            <SignerPicker
              value={localValue.fields["signer"]}
              onUpdate={(value) => handleUpdate(value, "signer")}
              hideWeight
            />
          </OptionsTablePair>
        </>;
      default:
        return null;
    }
  }

  return (
    <div {...props}>
      <OptionsTablePair label="Revoke Sponsorship Type" key="revokeSponsorshipType">
        <SelectPicker
          placeholder="Select sponsorship type"
          value={localValue.type}
          onUpdate={(typeValue) => {
            const newTypeValue = localValue.type === typeValue ? "" : typeValue;
            onUpdate(
              assign({}, localValue, {
                type: newTypeValue,
                fields: newTypeValue ? fields[newTypeValue] : {},
              }),
            );
          }}
          items={revokeTypes}
        />
      </OptionsTablePair>
      {renderTypeFields()}
    </div>
  );
}

RevokeSponsorshipPicker.propTypes = {
  onUpdate: PropTypes.func.isRequired,
  value: PropTypes.shape({
    type: PropTypes.string,
    fields: PropTypes.shape({}),
  }),
};
