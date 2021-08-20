import React from "react";

import PubKeyPicker from "../FormComponents/PubKeyPicker";

import OptionsTablePair from "../OptionsTable/Pair";
import TextPicker from "../FormComponents/TextPicker.js";
import PositiveIntPicker from "../FormComponents/PositiveIntPicker.js";
import OrderPicker from "../FormComponents/OrderPicker.js";
import AssetPicker from "../FormComponents/AssetPicker.js";

export default function AllOffers({ values, onUpdate }) {
  return (
    <>
      <OptionsTablePair label="Sponsor" optional>
        <PubKeyPicker
          value={values.sponsor}
          onUpdate={(value) => {
            onUpdate("sponsor", value);
          }}
        />
      </OptionsTablePair>

      <OptionsTablePair label="Seller" optional>
        <PubKeyPicker
          value={values.seller}
          onUpdate={(value) => {
            onUpdate("seller", value);
          }}
        />
      </OptionsTablePair>

      <OptionsTablePair label="Selling" optional>
        <AssetPicker
          stringForm
          optional
          value={values.selling}
          onUpdate={(value) => {
            onUpdate("selling", value);
          }}
        />
      </OptionsTablePair>

      <OptionsTablePair label="Buying" optional>
        <AssetPicker
          stringForm
          optional
          value={values.buying}
          onUpdate={(value) => {
            onUpdate("buying", value);
          }}
        />
      </OptionsTablePair>

      <OptionsTablePair label="Cursor" optional>
        <TextPicker
          value={values.cursor}
          onUpdate={(value) => {
            onUpdate("cursor", value);
          }}
        />
      </OptionsTablePair>

      <OptionsTablePair label="Limit" optional>
        <PositiveIntPicker
          value={values.limit}
          onUpdate={(value) => {
            onUpdate("limit", value);
          }}
        />
      </OptionsTablePair>

      <OptionsTablePair label="Order" optional>
        <OrderPicker
          value={values.order}
          onUpdate={(value) => {
            onUpdate("order", value);
          }}
        />
      </OptionsTablePair>
    </>
  );
}
