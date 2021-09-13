import { useEffect } from "react";
import All from "components/SetupPanes/All";
import OptionsTablePair from "components/OptionsTable/Pair";
import { AssetPickerWithoutNative } from "components/FormComponents/AssetPicker";
import ManualMultiPicker from "components/FormComponents/ManualMultiPicker";
import { Asset } from "types/types.d";

interface AllLiquidityPoolsProps {
  values: {
    reserves_assets: Asset[];
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
          onUpdate={(value: string) => {
            props.onUpdate("reserves_assets", value);
          }}
        />
      </OptionsTablePair>

      <All {...props} />
    </div>
  );
};
