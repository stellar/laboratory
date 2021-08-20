import { addEventHandler } from "helpers/metrics";
import accountCreatorMetrics from "metricsHandlers/accountCreator";
import { KeypairGenerator } from "views/KeypairGenerator";
import { FriendbotFundAccount } from "views/FriendbotFundAccount";
import { MuxedAccount } from "views/MuxedAccount";

addEventHandler(accountCreatorMetrics);

export const AccountCreator = () => {
  return (
    <div className="AccountCreator" data-testid="page-account-creator">
      <KeypairGenerator />
      <div className="so-back AccountCreator__separator"></div>

      <FriendbotFundAccount />
      <div className="so-back AccountCreator__separator"></div>

      <MuxedAccount />
    </div>
  );
};
