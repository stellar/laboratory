"use client";

import { useCallback, useEffect, useState } from "react";
import { Text, Button, Icon, Notification } from "@stellar/design-system";
import StellarHDWallet from "stellar-hd-wallet";

import { useStore } from "@/store/useStore";
import { useFriendBot } from "@/query/useFriendBot";
import { useQueryClient } from "@tanstack/react-query";

import { useIsTestingNetwork } from "@/hooks/useIsTestingNetwork";
import { useNetworkChanged } from "@/hooks/useNetworkChanged";
import { getNetworkHeaders } from "@/helpers/getNetworkHeaders";
import { localStorageSavedKeypairs } from "@/helpers/localStorageSavedKeypairs";

import { GenerateKeypair } from "@/components/GenerateKeypair";
import { ExpandBox } from "@/components/ExpandBox";
import { SuccessMsg } from "@/components/FriendBot/SuccessMsg";
import { ErrorMsg } from "@/components/FriendBot/ErrorMsg";
import { Box } from "@/components/layout/Box";
import { PageCard } from "@/components/layout/PageCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { SaveToLocalStorageModal } from "@/components/SaveToLocalStorageModal";

import { trackEvent, TrackingEvent } from "@/metrics/tracking";

import "../styles.scss";

export default function CreateAccount() {
  const { account, network } = useStore();
  const { reset } = account;

  const [secretKey, setSecretKey] = useState("");
  const [recoveryPhrase, setRecoveryPhrase] = useState("");
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [isSaveModalVisible, setIsSaveModalVisible] = useState(false);

  const queryClient = useQueryClient();
  const IS_TESTING_NETWORK = useIsTestingNetwork();
  const IS_CUSTOM_NETWORK_WITH_HORIZON =
    network.id === "custom" && network.horizonUrl;

  const resetQuery = useCallback(
    () =>
      queryClient.resetQueries({
        queryKey: ["friendBot", { type: "create" }],
      }),
    [queryClient],
  );

  const resetStates = useCallback(() => {
    reset();
    resetQuery();
  }, [reset, resetQuery]);

  const { error, isError, isFetching, isLoading, isSuccess, refetch } =
    useFriendBot({
      network,
      publicKey: account.publicKey!,
      key: { type: "create" },
      headers: getNetworkHeaders(network, "horizon"),
    });

  useEffect(() => {
    if (isError || isSuccess) {
      setShowAlert(true);
    }
  }, [isError, isSuccess]);

  useNetworkChanged(resetStates);

  const generateKeypair = () => {
    resetStates();

    // Generate 24-word mnemonic
    const mnemonic = StellarHDWallet.generateMnemonic({
      entropyBits: 256,
      language: "english",
    });
    const wallet = StellarHDWallet.fromMnemonic(mnemonic);
    const publicKey = wallet.getPublicKey(0);
    const secret = wallet.getSecret(0);

    if (IS_TESTING_NETWORK) {
      account.updateKeypair(publicKey, secret, mnemonic);
    } else {
      account.updateKeypair(publicKey);
    }

    setSecretKey(secret);
    setRecoveryPhrase(mnemonic);

    trackEvent(TrackingEvent.ACCOUNT_CREATE_GENERATE_KEYPAIR);
  };

  return (
    <div className="Account">
      <PageHeader heading="Keypair generator" />
      <Text size="sm" as="div">
        This keypair is generated temporarily for testing and experimentation on
        the Stellar network. It exists only for the current browser session, and
        you must save it to continue using it. Once the page is closed or
        refreshed, the keypair cannot be recovered.
      </Text>
      <PageCard>
        <div className="Account__card">
          <Box
            gap="sm"
            direction="row"
            justify="space-between"
            wrap="wrap"
            data-testid="createAccount-buttons"
            addlClassName="Account__create__buttons"
          >
            <Box
              gap="sm"
              direction="row"
              wrap="wrap"
              addlClassName="Account__create__buttons__group"
            >
              <Button
                disabled={isLoading || isFetching}
                size="md"
                variant="secondary"
                onClick={generateKeypair}
              >
                Generate keypair
              </Button>

              <>
                {IS_TESTING_NETWORK ? (
                  <Button
                    disabled={!account.publicKey || isLoading || isFetching}
                    size="md"
                    variant="tertiary"
                    icon={<Icon.Save01 />}
                    onClick={() => {
                      setIsSaveModalVisible(true);
                    }}
                  >
                    Save keypair
                  </Button>
                ) : null}
              </>
            </Box>

            <>
              {IS_TESTING_NETWORK || IS_CUSTOM_NETWORK_WITH_HORIZON ? (
                <Button
                  size="md"
                  disabled={!account.publicKey || isLoading}
                  variant="tertiary"
                  isLoading={isLoading || isFetching}
                  onClick={() => {
                    resetQuery();
                    refetch();
                    trackEvent(TrackingEvent.ACCOUNT_CREATE_FUND_ACCOUNT);
                  }}
                  data-testid="fundAccount-button"
                >
                  Fund 10,000 XLM
                </Button>
              ) : null}
            </>
          </Box>

          {Boolean(account.publicKey) && (
            <ExpandBox isExpanded={Boolean(account.publicKey)} offsetTop="xl">
              <div className="Account__result">
                <GenerateKeypair
                  publicKey={account.publicKey}
                  secretKey={IS_TESTING_NETWORK ? account.secretKey : secretKey}
                  recoveryPhrase={
                    IS_TESTING_NETWORK ? account.recoveryPhrase : recoveryPhrase
                  }
                />
              </div>
            </ExpandBox>
          )}
        </div>
      </PageCard>

      <SuccessMsg
        publicKey={account.publicKey!}
        isVisible={Boolean(showAlert && isSuccess && account.publicKey)}
        onClose={() => {
          setShowAlert(false);
        }}
      />

      <ErrorMsg
        isVisible={Boolean(showAlert && isError)}
        errorMsg={error?.message}
        onClose={() => {
          setShowAlert(false);
        }}
      />

      {!IS_TESTING_NETWORK ? (
        <Notification
          variant="warning"
          title="Please Avoid Using Private Keys Directly on Mainnet"
        >
          For your security, do not use your private key for accounts holding
          significant funds when interacting with the Stellar’s mainnet.
          Handling private keys manually increases the risk of loss, theft, or
          accidental misuse. Instead, connect your wallet and sign transactions
          securely. Wallets are designed to manage keys safely and protect your
          assets.
        </Notification>
      ) : null}

      <SaveToLocalStorageModal
        type="save"
        itemTitle="Keypair"
        itemProps={{
          publicKey: account.publicKey,
          secretKey: IS_TESTING_NETWORK ? account.secretKey : secretKey,
          recoveryPhrase: IS_TESTING_NETWORK
            ? account.recoveryPhrase
            : recoveryPhrase,
        }}
        allSavedItems={localStorageSavedKeypairs.get()}
        isVisible={isSaveModalVisible}
        onClose={() => {
          setIsSaveModalVisible(false);
        }}
        onUpdate={(updatedItems) => {
          localStorageSavedKeypairs.set(updatedItems);
          trackEvent(TrackingEvent.ACCOUNT_CREATE_SAVE);
        }}
      />
    </div>
  );
}
