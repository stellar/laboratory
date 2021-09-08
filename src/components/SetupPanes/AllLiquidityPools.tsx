import { useEffect } from "react";
import All from "./All";
import OptionsTablePair from "../OptionsTable/Pair";
import { AssetPickerWithoutNative } from "../FormComponents/AssetPicker";
import ManualMultiPicker from "../FormComponents/ManualMultiPicker";

export default function AllLiquidityPools(props: any) {
  const getReservesString = () => {
    if (!props.values.reserves_assets) {
      return "";
    }

    return props.values.reserves_assets
      .reduce((result: any[], current: any) => {
        if (current?.code && current?.issuer) {
          result.push(`${current.code}:${current.issuer}`);
        }

        return result;
      }, [])
      .join(",");
  };

  useEffect(() => {
    props.onUpdate("reserves", getReservesString());
  }, [props.values.reserves_assets]);

  return (
    <div>
      <OptionsTablePair label="Reserves" optional>
        <ManualMultiPicker
          component={AssetPickerWithoutNative}
          value={props.values["reserves_assets"]}
          default=""
          addNewLabel="Add reserve"
          onUpdate={(value: any) => {
            props.onUpdate("reserves_assets", value);
          }}
        />
      </OptionsTablePair>

      <All {...props} />
    </div>
  );
}
