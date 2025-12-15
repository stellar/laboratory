"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Input,
  Text,
  Button,
  Notification,
  Link,
  Icon,
  Alert,
} from "@stellar/design-system";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";

import { useFriendBot } from "@/query/useFriendBot";
import { useAccountInfo } from "@/query/useAccountInfo";
import { useAddTrustline } from "@/query/useAddTrustline";
import { useSubmitHorizonTx } from "@/query/useSubmitHorizonTx";
import { useStore } from "@/store/useStore";
import { EURC_TESTNET_ISSUER, USDC_TESTNET_ISSUER } from "@/constants/settings";

import { getNetworkHeaders } from "@/helpers/getNetworkHeaders";
import { muxedAccount } from "@/helpers/muxedAccount";
import { formatNumber } from "@/helpers/formatNumber";
import { delayedAction } from "@/helpers/delayedAction";
import { openUrl } from "@/helpers/openUrl";
import { shortenStellarAddress } from "@/helpers/shortenStellarAddress";

import { validate } from "@/validate";

import { PageCard } from "@/components/layout/PageCard";
import { Box } from "@/components/layout/Box";
import { InputSideElement } from "@/components/InputSideElement";
import { SignTransactionXdr } from "@/components/SignTransactionXdr";

import { trackEvent, TrackingEvent } from "@/metrics/tracking";

import { SwitchNetwork } from "./components/SwitchNetwork";

import "../styles.scss";

export default function FundAccount() {
  const fundTokens = [
    {
      id: "xlm",
      assetCode: "XLM",
      assetIssuer: "native",
      label: "Native",
      currency: "XLM",
      amount: "10000",
    },
    {
      id: "usdc",
      assetCode: "USDC",
      assetIssuer: USDC_TESTNET_ISSUER,
      label: "Stellar asset",
      currency: "USDC",
      amount: "1",
    },
    {
      id: "eurc",
      assetCode: "EURC",
      assetIssuer: EURC_TESTNET_ISSUER,
      label: "Stellar asset",
      currency: "EURC",
      amount: "1",
    },
  ];

  const { account, network, addFloatNotification } = useStore();
  const { reset } = account;

  const [generatedPublicKey, setGeneratedPublicKey] = useState<string>("");
  const [inlineErrorMessage, setInlineErrorMessage] = useState<string>("");

  const [muxedBaseAccount, setMuxedBaseAccount] = useState<string>("");
  const [muxedAccountMsg, setMuxedAccountMsg] = useState<string>("");

  const [isFetchInfoEnabled, setIsFetchInfoEnabled] = useState(false);
  const [activeToken, setActiveToken] = useState("");
  const [signedTx, setSignedTx] = useState<string | null>(null);

  const inputPublicKey = muxedBaseAccount || generatedPublicKey;

  const networkRef = useRef(network);

  const getCurrentAsset = () => {
    const found = fundTokens.find((t) => t.id === activeToken);

    return { assetCode: found?.assetCode, assetIssuer: found?.assetIssuer };
  };

  const {
    data: accountInfo,
    error: accountInfoError,
    isFetching: isAccountInfoFetching,
    isLoading: isAccountInfoLoading,
    refetch: fetchAccountInfo,
  } = useAccountInfo({
    publicKey: inputPublicKey,
    horizonUrl: network.horizonUrl,
    headers: getNetworkHeaders(network, "horizon"),
  });

  const {
    error: friendBotError,
    isFetching: isFriendBotFetching,
    isLoading: isFriendBotLoading,
    isSuccess: isFriendBotSuccess,
    isFetchedAfterMount: isFriendBotFetchedAfterMount,
    refetch: fetchFriendBot,
  } = useFriendBot({
    network,
    publicKey: inputPublicKey,
    key: { type: "fund" },
    headers: getNetworkHeaders(network, "horizon"),
  });

  const {
    data: addTrustlineTx,
    error: addTrustlineError,
    isLoading: isAddTrustlineLoading,
    isFetching: isAddTrustlineFetching,
    refetch: addTrustline,
  } = useAddTrustline({
    asset: getCurrentAsset(),
    publicKey: inputPublicKey,
    network,
    headers: getNetworkHeaders(network, "horizon"),
  });

  const {
    mutate: submitTx,
    isSuccess: isSubmitSuccess,
    error: submitError,
    isPending: isSubmitPending,
    reset: resetSubmitTx,
  } = useSubmitHorizonTx();

  const accountBalances = accountInfo?.details?.balances.reduce(
    (res: Record<string, string>, cur: any) => {
      if (cur.asset_type === "native") {
        return { ...res, "XLM:native": cur.balance };
      }

      return { ...res, [`${cur.asset_code}:${cur.asset_issuer}`]: cur.balance };
    },
    {},
  );

  const queryClient = useQueryClient();
  const isAccountLoading = isAccountInfoLoading || isAccountInfoFetching;
  const isFriendBotFundLoading = isFriendBotLoading || isFriendBotFetching;
  const isAddTrustlineInProgress =
    isAddTrustlineLoading || isAddTrustlineFetching;

  const resetFriendBotQuery = useCallback(
    () =>
      queryClient.resetQueries({
        queryKey: ["friendBot", inputPublicKey, { type: "fund" }],
      }),
    [inputPublicKey, queryClient],
  );

  const resetAccountInfoQuery = useCallback(
    () =>
      queryClient.resetQueries({
        queryKey: ["accountInfo", inputPublicKey],
      }),
    [inputPublicKey, queryClient],
  );

  const resetAddTrustlineQuery = useCallback(
    () =>
      queryClient.resetQueries({
        queryKey: ["addTrustline", inputPublicKey],
      }),
    [inputPublicKey, queryClient],
  );

  const resetStates = useCallback(() => {
    reset();
    resetFriendBotQuery();
    resetAccountInfoQuery();
  }, [reset, resetAccountInfoQuery, resetFriendBotQuery]);

  useEffect(() => {
    // when switching network, reset the state
    if (networkRef.current.id !== network.id) {
      networkRef.current = network;
      resetStates();
    }
    // Not including network and resetStates()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [networkRef.current.id, network.id]);

  useEffect(() => {
    if (isFriendBotFetchedAfterMount && isFriendBotSuccess) {
      addFloatNotification({
        id: `fund-account-success-xlm`,
        type: "success",
        title: "XLM has been successfully funded!",
        description: `10,000 XLM was funded to ${shortenStellarAddress(inputPublicKey)} on ${network.label}.`,
      });

      setActiveToken("");
      fetchAccountInfo();
    }
  }, [
    addFloatNotification,
    fetchAccountInfo,
    inputPublicKey,
    isFriendBotFetchedAfterMount,
    isFriendBotSuccess,
    network.label,
  ]);

  useEffect(() => {
    if (
      isFetchInfoEnabled &&
      inputPublicKey &&
      !validate.getPublicKeyError(inputPublicKey)
    ) {
      fetchAccountInfo();
    }
  }, [fetchAccountInfo, inputPublicKey, isFetchInfoEnabled]);

  useEffect(() => {
    if (isSubmitSuccess) {
      resetAddTrustlineQuery();
      resetSubmitTx();
      fetchAccountInfo();
      setSignedTx(null);
      setActiveToken("");

      const assetCode = getCurrentAsset().assetCode;

      addFloatNotification({
        id: `fund-account-success-${assetCode}`,
        type: "success",
        title: "Trustline added",
        description: `${assetCode} trustline has been successfully added to ${shortenStellarAddress(inputPublicKey)} on ${network.label}.`,
      });
    }
  }, [
    fetchAccountInfo,
    isSubmitSuccess,
    resetAddTrustlineQuery,
    resetSubmitTx,
  ]);

  if (network.id === "mainnet") {
    return <SwitchNetwork />;
  }

  const handleMuxedAccount = (muxedAddress: string) => {
    if (muxedAddress.startsWith("M")) {
      try {
        const { baseAddress } = muxedAccount.parse({
          muxedAddress,
        });

        if (baseAddress) {
          setMuxedBaseAccount(baseAddress);
          setMuxedAccountMsg(`The base account ${baseAddress} will be funded.`);
          return;
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        // do nothing
      }
    }
  };

  const handleFund = (id: string) => {
    setActiveToken(id);

    if (id === "xlm") {
      fetchFriendBot();
      trackEvent(TrackingEvent.ACCOUNT_FUND_FUND_ACCOUNT);
    } else {
      openUrl("https://faucet.circle.com/");
    }
  };

  return (
    <div className="Account">
      <PageCard
        heading={`Friendbot: fund a ${network.id} network account with XLM, USDC, and EURC`}
      >
        <div className="Account__card">
          <Text size="sm" as="div">
            Friendbot is a Horizon API endpoint that funds your test account
            with XLM, USDC, and EURC. To use other assets, you’ll need to add a
            trustline manually before funding other assets.
          </Text>

          <Input
            id="fund-public-key-input"
            fieldSize="md"
            label="Public Key"
            value={generatedPublicKey}
            onChange={(e) => {
              if (accountInfo) {
                resetAccountInfoQuery();
              }

              setIsFetchInfoEnabled(false);
              setGeneratedPublicKey(e.target.value);

              const error = validate.getPublicKeyError(e.target.value);
              setInlineErrorMessage(error || "");
              setMuxedBaseAccount("");
              setMuxedAccountMsg("");

              if (!error) {
                handleMuxedAccount(e.target.value);
              }
            }}
            onBlur={() => {
              setIsFetchInfoEnabled(true);
            }}
            placeholder="Ex: GCEXAMPLE5HWNK4AYSTEQ4UWDKHTCKADVS2AHF3UI2ZMO3DPUSM6Q4UG"
            error={inlineErrorMessage}
            rightElement={
              <InputSideElement
                variant="button"
                placement="right"
                disabled={
                  !account.publicKey ||
                  isAccountLoading ||
                  isFriendBotFundLoading
                }
                onClick={() => {
                  setInlineErrorMessage("");
                  setGeneratedPublicKey(account.publicKey!);
                  setIsFetchInfoEnabled(true);
                  trackEvent(TrackingEvent.ACCOUNT_FUND_FILL);
                }}
              >
                Fill in with generated key
              </InputSideElement>
            }
          />

          {muxedAccountMsg ? (
            <Notification title="Muxed Account" variant="primary">
              {muxedAccountMsg}
            </Notification>
          ) : null}

          <Box gap="sm">
            <Box
              gap="md"
              direction="row"
              justify="space-between"
              align="center"
              wrap="wrap"
            >
              <Text size="xs" as="div" weight="medium">
                Choose asset to fund
              </Text>

              <Link
                href="https://developers.stellar.org/docs/learn/fundamentals/stellar-data-structures/accounts#trustlines"
                icon={<Icon.LinkExternal01 />}
                size="sm"
              >
                What is a trustline?
              </Link>
            </Box>

            <div className="Account__fundTokens">
              {fundTokens.map((t) => {
                const asset = `${t.assetCode}:${t.assetIssuer}`;
                const hasTrustline = Boolean(accountBalances?.[asset]);

                return (
                  <div key={t.id} className="Account__fundTokens__item">
                    <div className="Account__fundTokens__item__icon">
                      <Image
                        src={`/images/token-icon-${t.id}.png`}
                        alt={`${t.label} icon`}
                        width={32}
                        height={32}
                      />
                    </div>

                    <div className="Account__fundTokens__item__info">
                      <Text as="div" size="xs" weight="medium">
                        {t.label}
                      </Text>
                      <Text
                        as="div"
                        size="md"
                        weight="medium"
                        addlClassName="Account__fundTokens__item__amount"
                      >{`${formatNumber(parseFloat(t.amount))} ${t.currency}`}</Text>
                    </div>

                    {t.id === "xlm" || hasTrustline ? (
                      // Fund button
                      <Button
                        variant="secondary"
                        size="md"
                        disabled={
                          !accountInfo ||
                          isAddTrustlineInProgress ||
                          Boolean(addTrustlineTx)
                        }
                        isLoading={
                          isAccountLoading ||
                          (isFriendBotFundLoading && t.id === activeToken)
                        }
                        onClick={() => {
                          handleFund(t.id);
                        }}
                      >
                        Fund
                      </Button>
                    ) : (
                      // Add trustline button
                      <Button
                        variant="secondary"
                        size="md"
                        disabled={
                          !accountInfo ||
                          !accountInfo?.isFunded ||
                          isFriendBotFundLoading ||
                          ((isAddTrustlineInProgress ||
                            Boolean(addTrustlineTx)) &&
                            t.id !== activeToken)
                        }
                        isLoading={
                          isAccountLoading ||
                          ((isAddTrustlineInProgress ||
                            Boolean(addTrustlineTx)) &&
                            t.id === activeToken)
                        }
                        title={
                          !accountInfo?.isFunded
                            ? "Account must be funded with XLM first"
                            : undefined
                        }
                        onClick={() => {
                          setActiveToken(t.id);

                          delayedAction({
                            action: () => {
                              resetFriendBotQuery();
                              addTrustline();
                            },
                            delay: 300,
                          });
                        }}
                      >
                        Add trustline
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </Box>

          {isFriendBotFetchedAfterMount && friendBotError ? (
            <Alert
              placement="inline"
              variant="error"
              title="Error funding XLM"
              onClose={() => {
                resetFriendBotQuery();
              }}
            >
              {friendBotError.message}
            </Alert>
          ) : null}

          {addTrustlineError ? (
            <Alert
              placement="inline"
              variant="error"
              title="Error adding trustline"
              onClose={() => {
                resetAddTrustlineQuery();
              }}
            >
              {addTrustlineError.message}
            </Alert>
          ) : null}

          {accountInfoError ? (
            <Alert
              placement="inline"
              variant="error"
              title="Error fetching account info"
              onClose={() => {
                resetAccountInfoQuery();
              }}
            >
              {accountInfoError.message}
            </Alert>
          ) : null}

          {addTrustlineTx ? (
            <SignTransactionXdr
              id="fund-account-sign-tx"
              title="Sign Transaction"
              description={`Sign this transaction to add a trustline so you can hold ${getCurrentAsset().assetCode}.`}
              xdrToSign={addTrustlineTx || ""}
              onDoneAction={({ signedXdr }) => {
                setSignedTx(signedXdr);
              }}
              customFooter={
                <Box gap="lg">
                  {submitError ? (
                    <Alert
                      placement="inline"
                      variant="error"
                      title="Error submitting transaction"
                    >
                      {submitError.message}
                    </Alert>
                  ) : null}

                  <Box gap="lg" direction="row" justify="end">
                    <Button
                      size="md"
                      variant="tertiary"
                      onClick={() => {
                        resetAddTrustlineQuery();
                        resetSubmitTx();
                        setSignedTx(null);
                      }}
                      disabled={isSubmitPending}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="md"
                      variant="secondary"
                      onClick={() => {
                        if (signedTx) {
                          submitTx({
                            horizonUrl: network.horizonUrl,
                            transactionXdr: signedTx,
                            networkPassphrase: network.passphrase,
                            headers: getNetworkHeaders(network, "horizon"),
                          });
                        }
                      }}
                      disabled={!signedTx}
                      isLoading={isSubmitPending}
                    >
                      Add trustline
                    </Button>
                  </Box>
                </Box>
              }
            />
          ) : null}
        </div>
      </PageCard>
    </div>
  );
}
