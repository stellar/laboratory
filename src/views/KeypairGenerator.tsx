import { useDispatch } from "react-redux";
import {
  generateNewKeypair,
  updateFriendbotTarget,
} from "actions/accountCreator.js";
import NETWORK from "constants/network.js";
import { useRedux } from "hooks/useRedux";

export const KeypairGenerator = () => {
  const { accountCreator, network } = useRedux("accountCreator", "network");
  const { keypairGeneratorResult, keypairGeneratorPubKey } = accountCreator;
  const baseURL = network.current.horizonURL;
  const IS_TESTNET = baseURL === NETWORK.available.test.horizonURL;
  const IS_FUTURENET = baseURL === NETWORK.available.futurenet.horizonURL;

  const dispatch = useDispatch();

  const renderKeypairTable = () => {
    if (keypairGeneratorResult !== null) {
      return (
        <div className="simpleTable AccountCreator__generator__table">
          <div className="simpleTable__row">
            <div className="simpleTable__row__label">Public Key</div>
            <div data-testid="publicKey" className="simpleTable__row__content">
              {keypairGeneratorResult.pubKey}
            </div>
          </div>

          <div className="simpleTable__row">
            <div className="simpleTable__row__label">Secret Key</div>
            <div data-testid="secretKey" className="simpleTable__row__content">
              {keypairGeneratorResult.secretKey}
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderKeypairGeneratorLink = () => {
    if ((IS_TESTNET || IS_FUTURENET) && keypairGeneratorPubKey !== "") {
      return (
        <a
          onClick={() =>
            dispatch(updateFriendbotTarget(keypairGeneratorPubKey))
          }
        >
          Fund this account on the test network using the friendbot tool below
        </a>
      );
    }

    return null;
  };

  return (
    <div className="so-back AccountCreator__section">
      <div className="so-chunk">
        <h3>Keypair generator</h3>

        <p>
          These keypairs can be used on the Stellar network where one is
          required. For example, it can be used as an account master key,
          account signer, and/or as a stellar-core node key.
        </p>

        <button
          className="s-button"
          onClick={() => {
            dispatch(generateNewKeypair());
          }}
        >
          Generate keypair
        </button>

        {renderKeypairTable()}
        {renderKeypairGeneratorLink()}
      </div>
    </div>
  );
};
