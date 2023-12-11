import { useEffect } from "react";
import All from "components/SetupPanes/All.js";
import OptionsTablePair from "components/OptionsTable/Pair.js";
import AssetPicker from "components/FormComponents/AssetPicker.js";
import ManualMultiPicker from "components/FormComponents/ManualMultiPicker.js";
import { AssetWithType } from "types/types";

const NATIVE_TYPE = "native";

interface AllLiquidityPoolsProps {
  values: {
    reserves_assets: AssetWithType[];
  };
  onUpdate: (key: string, value: string) => void;
}

export const AllLiquidityPools = (props: AllLiquidityPoolsProps) => {
  const getReservesString = () => {
    if (!props.values.reserves_assets) {
      return "";
    }

    return props.values.reserves_assets
      .reduce((result: string[], current) => {
        if (current.type === NATIVE_TYPE) {
          result.push(NATIVE_TYPE);
        } else {
          if (current?.code && current?.issuer) {
            result.push(`${current.code}:${current.issuer}`);
          }
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
          component={AssetPicker}
          value={props.values["reserves_assets"]}
          default=""
          addNewLabel="Add reserve"
          onUpdate={(value: string) => {
            props.onUpdate("reserves_assets", value);
          }}
        />
      </OptionsTablePair>

      <All {...props} />
    </div>
  );
};
