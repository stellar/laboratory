import React from "react";

import For from "./For";
import PubKeyPicker from "../FormComponents/PubKeyPicker";

export default function ForAccount(props) {
  return (
    <For
      label="Account ID"
      content={
        <PubKeyPicker
          value={props.values["account_id"]}
          onUpdate={(value) => {
            props.onUpdate("account_id", value);
          }}
        />
      }
      {...props}
    />
  );
}
