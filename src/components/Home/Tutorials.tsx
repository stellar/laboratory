import { useState } from "react";
import { Text } from "@stellar/design-system";
import { Box } from "@/components/layout/Box";
import { trackEvent, TrackingEvent } from "@/metrics/tracking";

export const Tutorials = () => {
  const tutorials = [
    {
      title: "Create Account",
      description: "Creates and funds a new Stellar account.",
      youTubeLink:
        "https://www.youtube.com/embed/7j5t69f40dM?si=4svimk6VRVqnGmCj",
    },
    {
      title: "Payment",
      description:
        "Send an amount in a specific asset to a destination account.",
      youTubeLink:
        "https://www.youtube.com/embed/Isn5CkEWFs8?si=Fj5UkHk8XzVWzyA_",
    },
    {
      title: "Change Trust",
      description: "Add or remove trustlines for assets on Stellar.",
      youTubeLink:
        "https://www.youtube.com/embed/Ln-_2pkkj3k?si=B9XmD2BEkc6cyDpu",
    },
    {
      title: "Manage Offers",
      description:
        "Create, update, or delete orders for assets on the Stellar DEX.",
      youTubeLink:
        "https://www.youtube.com/embed/4d558Q0MDso?si=IIslGXLT1clwXIOR",
    },
    {
      title: "Path Payments",
      description: "Send one asset, convert through path, receive another.",
      youTubeLink:
        "https://www.youtube.com/embed/ZNuNrYjpx9s?si=ZAK5L_ZCg9Jb1B0y",
    },
    {
      title: "Account Merge",
      description: "Move XLM to another account and delete the source.",
      youTubeLink:
        "https://www.youtube.com/embed/XkzYMQUtyeo?si=VcOGkVJErgdiHip3",
    },
    {
      title: "Manage Data",
      description: "Set, modify, or delete a key-value pair on an account.",
      youTubeLink:
        "https://www.youtube.com/embed/vRq8_cSFdlQ?si=AtsZ-W7uzuZi3Fz4",
    },
    {
      title: "Set Options Home Domain",
      description: "Assign a web domain to an account for verification.",
      youTubeLink:
        "https://www.youtube.com/embed/2bEe8DzKUUw?si=kjYopS1IOfUSgiOV",
    },
    {
      title: "Set Options Weights, Thresholds, and Signers",
      description: "Configure signer keys, weights, and threshold levels.",
      youTubeLink:
        "https://www.youtube.com/embed/RmvIdxkm_JE?si=SkVtyqcJ4leeBFU3",
    },
    {
      title: "Set Flags",
      description: "Enable or clear account flags for asset behavior.",
      youTubeLink:
        "https://www.youtube.com/embed/ovJK8I4qoC0?si=XkXvXZSQEUhlV5Zu",
    },
    {
      title: "Bump Sequence",
      description: "Advance an account’s sequence number forward.",
      youTubeLink:
        "https://www.youtube.com/embed/9sCTcK2sYaU?si=E1FoQeiudnWlne7N",
    },
    {
      title: "Sponsorships",
      description: "Assign or remove responsibility for account reserves.",
      youTubeLink:
        "https://www.youtube.com/embed/-MTUtsp_Ovc?si=60EEBVFoYzxszfrc",
    },
    {
      title: "Claimable Balances",
      description: "Create a balance claimable later under set conditions.",
      youTubeLink:
        "https://www.youtube.com/embed/cC669NmLyew?si=XAVMNapfqeOVoAeV",
    },
    {
      title: "Clawbacks",
      description: "Reclaim issued assets from another account.",
      youTubeLink:
        "https://www.youtube.com/embed/DWJ-wOydPJQ?si=vW-PF5ffoEoX1H9-",
    },
    {
      title: "Liquidity Pools",
      description: "Deposit assets to enable automated decentralized trading.",
      youTubeLink:
        "https://www.youtube.com/embed/kd5sa5df3oU?si=wK2bkN1_SAUrnfw8",
    },
    {
      title: "Hello World (Build, Deploy, Invoke)",
      description: "Build a contract, deploy it, then invoke a method.",
      youTubeLink:
        "https://www.youtube.com/embed/XcFgR_OHKl8?si=-5wdlfi5xqhQyoRX",
    },
    {
      title: "Auth Store (Store and Retrieve)",
      description: "Auth users, store and retrieve on-chain data.",
      youTubeLink:
        "https://www.youtube.com/embed/kpyIotaiFfw?si=p9QSbs3hNYguHawP",
    },
    {
      title: "Reverse Engineer (Decode XDR)",
      description: "Decode XDR into JSON for human-readable view",
      youTubeLink:
        "https://www.youtube.com/embed/ZrmDQKU2dqY?si=iMELpqmM_mn8rbkL",
    },
    {
      title: "Cross Contract",
      description: "Invoke another contract from within a contract.",
      youTubeLink:
        "https://www.youtube.com/embed/nyGFAA8hcDE?si=1mOFIgEYboi2VgSC",
    },
    {
      title: "Custom Types (Structs and Enums)",
      description: "Define custom data types like structs and enums.",
      youTubeLink:
        "https://www.youtube.com/embed/Dypune9qagg?si=_geNAtdF07s4hQfN",
    },
  ];

  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="Lab__home__tutorials">
      {/* Tutorial video */}
      <div className="Lab__home__tutorials__video">
        <iframe
          width="100%"
          height="100%"
          src={tutorials[selectedIndex].youTubeLink}
          title={`${tutorials[selectedIndex].title} video`}
          frameBorder="0"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope;"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </div>

      {/* Tutorial List */}
      <div className="Lab__home__tutorials__list">
        <div className="Lab__home__tutorials__list__container">
          <Box gap="xs" addlClassName="Lab__home__tutorials__list__scroll">
            {tutorials.map((t, idx) => (
              <div
                key={`tutorialItem-${idx}`}
                className="Lab__home__tutorials__item"
                onClick={() => {
                  setSelectedIndex(idx);
                  trackEvent(TrackingEvent.HOME_TUTORIAL, {
                    tutorial: t.title.toLowerCase(),
                  });
                }}
                data-selected={selectedIndex === idx}
              >
                <Text
                  as="div"
                  size="sm"
                  weight="semi-bold"
                  addlClassName="Lab__home__tutorials__item__title"
                  data-number={idx + 1}
                >
                  {t.title}
                </Text>
                <Text
                  as="div"
                  size="sm"
                  addlClassName="Lab__home__tutorials__item__description"
                >
                  {t.description}
                </Text>
              </div>
            ))}
          </Box>
        </div>
      </div>
    </div>
  );
};
