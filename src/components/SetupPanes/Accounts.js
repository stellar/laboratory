import React from "react";

import PubKeyPicker from "../FormComponents/PubKeyPicker.js";
import OptionsTablePair from "../OptionsTable/Pair";
import TextPicker from "../FormComponents/TextPicker.js";
import PositiveIntPicker from "../FormComponents/PositiveIntPicker.js";
import OrderPicker from "../FormComponents/OrderPicker.js";
import AssetPicker from "../FormComponents/AssetPicker.js";

export default function SingleAccount({ onUpdate, values }) {
  return (
    <>
      <OptionsTablePair label="Signer" optional={true}>
        <PubKeyPicker
          value={values.signer}
          onUpdate={(value) => {
            onUpdate("signer", value);
          }}
        />
      </OptionsTablePair>
      <OptionsTablePair label="Asset" optional={true}>
        <AssetPicker
          stringForm
          optional={true}
          value={values.asset}
          onUpdate={(value) => {
            onUpdate("asset", value);
          }}
        />
      </OptionsTablePair>

      <OptionsTablePair label="Cursor" optional={true}>
        <TextPicker
          value={values.cursor}
          onUpdate={(value) => {
            onUpdate("cursor", value);
          }}
        />
      </OptionsTablePair>

      <OptionsTablePair label="Limit" optional={true}>
        <PositiveIntPicker
          value={values.limit}
          onUpdate={(value) => {
            onUpdate("limit", value);
          }}
        />
      </OptionsTablePair>

      <OptionsTablePair label="Order" optional={true}>
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
