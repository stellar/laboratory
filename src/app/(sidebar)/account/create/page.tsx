"use client";

import { useCallback, useEffect, useState } from "react";
import { Text, Button, Icon } from "@stellar/design-system";
import { Keypair } from "@stellar/stellar-sdk";

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
import { SaveToLocalStorageModal } from "@/components/SaveToLocalStorageModal";

import { trackEvent, TrackingEvent } from "@/metrics/tracking";

import "../styles.scss";

export default function CreateAccount() {
  const { account, network } = useStore();
  const { reset } = account;

  const [secretKey, setSecretKey] = useState("");
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

    const keypair = Keypair.random();

    if (IS_TESTING_NETWORK) {
      account.updateKeypair(keypair.publicKey(), keypair.secret());
    } else {
      account.updateKeypair(keypair.publicKey());
    }

    setSecretKey(keypair.secret());

    trackEvent(TrackingEvent.ACCOUNT_CREATE_GENERATE_KEYPAIR);
  };

  return (
    <div className="Account">
      <PageCard heading="Keypair Generator">
        <div className="Account__card">
          <Text size="sm" as="div">
            These keypairs can be used on the Stellar network where one is
            required. For example, it can be used as an account master key,
            account signer, and/or as a stellar-core node key.
          </Text>

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
                    Save Keypair
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
                  Fund account with Friendbot
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

      <SaveToLocalStorageModal
        type="save"
        itemTitle="Keypair"
        itemProps={{
          publicKey: account.publicKey,
          secretKey: secretKey,
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
