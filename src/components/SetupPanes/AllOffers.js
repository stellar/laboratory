import React from "react";

import PubKeyPicker from "../FormComponents/PubKeyPicker.js";

import OptionsTablePair from "../OptionsTable/Pair";
import TextPicker from "../FormComponents/TextPicker.js";
import PositiveIntPicker from "../FormComponents/PositiveIntPicker.js";
import OrderPicker from "../FormComponents/OrderPicker.js";
import AssetPicker from "../FormComponents/AssetPicker.js";

export default function AllOffers(props) {
  return (
    <>
      <OptionsTablePair label="Seller" optional={true}>
        <PubKeyPicker
          value={props.values["seller"]}
          onUpdate={(value) => {
            props.onUpdate("seller", value);
          }}
        />
      </OptionsTablePair>

      <OptionsTablePair label="Selling" optional={true}>
        <AssetPicker
          stringForm
          optional
          value={props.values["selling"] || ""}
          onUpdate={(value) => {
            props.onUpdate("selling", value);
          }}
        />
      </OptionsTablePair>

      <OptionsTablePair label="Buying" optional={true}>
        <AssetPicker
          stringForm
          optional
          value={props.values["buying"] || ""}
          onUpdate={(value) => {
            props.onUpdate("buying", value);
          }}
        />
      </OptionsTablePair>

      <OptionsTablePair label="Cursor" optional={true}>
        <TextPicker
          value={props.values["cursor"]}
          onUpdate={(value) => {
            props.onUpdate("cursor", value);
          }}
        />
      </OptionsTablePair>

      <OptionsTablePair label="Limit">
        <PositiveIntPicker
          value={props.values["limit"]}
          onUpdate={(value) => {
            props.onUpdate("limit", value);
          }}
        />
      </OptionsTablePair>

      <OptionsTablePair label="Order">
        <OrderPicker
          value={props.values["order"]}
          onUpdate={(value) => {
            props.onUpdate("order", value);
          }}
        />
      </OptionsTablePair>
    </>
  );
}
