import React from "react";

import OptionsTablePair from "../OptionsTable/Pair";
import AssetPicker from "../FormComponents/AssetPicker.js";
import AmountPicker from "../FormComponents/AmountPicker.js";
import PubKeyPicker from "../FormComponents/PubKeyPicker.js";
import ManualMultiPicker from "../FormComponents/ManualMultiPicker.js";

export default function PathPayment(props) {
  return [
    <OptionsTablePair label="Destination" key="destination">
      <PubKeyPicker
        value={props.values["destination"]}
        onUpdate={(value) => {
          props.onUpdate("destination", value);
        }}
      />
    </OptionsTablePair>,
    <OptionsTablePair label="Sending Asset" key="sendAsset">
      <AssetPicker
        value={props.values["sendAsset"]}
        onUpdate={(value) => {
          props.onUpdate("sendAsset", value);
        }}
      />
      <p className="optionsTable__pair__content__note">
        The asset to be deduced from the sender's account
      </p>
    </OptionsTablePair>,
    <OptionsTablePair label="Send amount" key="sendMax">
      <AmountPicker
        value={props.values["sendAmount"]}
        onUpdate={(value) => {
          props.onUpdate("sendAmount", value);
        }}
      />
    </OptionsTablePair>,
    <OptionsTablePair label="Intermediate Path" key="path" optional="true">
      <ManualMultiPicker
        component={AssetPicker}
        value={props.values["path"]}
        default={{}}
        addNewLabel="Add new intermediate asset"
        onUpdate={(value) => {
          props.onUpdate("path", value);
        }}
      />
    </OptionsTablePair>,
    <OptionsTablePair label="Destination Asset" key="destAsset">
      <AssetPicker
        value={props.values["destAsset"]}
        onUpdate={(value) => {
          props.onUpdate("destAsset", value);
        }}
      />
      <p className="optionsTable__pair__content__note">
        The minimum amount the destination can receive.
      </p>
    </OptionsTablePair>,
    <OptionsTablePair label="Minimum destination amount" key="destMin">
      <AmountPicker
        value={props.values["destMin"]}
        onUpdate={(value) => {
          props.onUpdate("destMin", value);
        }}
      />
    </OptionsTablePair>,
  ];
}
