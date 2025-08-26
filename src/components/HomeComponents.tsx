import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Heading,
  Icon,
  Text,
  Button,
  Modal,
  Display,
  Logo,
} from "@stellar/design-system";

import { Box } from "@/components/layout/Box";

import { Routes } from "@/constants/routes";
import { useSwitchNetwork } from "@/hooks/useSwitchNetwork";
import { openUrl } from "@/helpers/openUrl";
import { capitalizeString } from "@/helpers/capitalizeString";

import { EmptyObj, Network, NetworkType } from "@/types/types";

export const HomeSection = ({
  title,
  eyebrow,
  description,
  children,
}: {
  title?: string;
  eyebrow?: string;
  description?: React.ReactNode;
  children: React.ReactElement | React.ReactElement[];
}) => (
  <div className="Lab__home__section" data-no-padding="true">
    <Box gap="xl" addlClassName="Lab__home__content">
      {eyebrow || title || description ? (
        <Box gap="xs">
          {eyebrow ? <div className="Lab__home__eyebrow">{eyebrow}</div> : null}
          {title ? (
            <Heading as="h2" size="xs" weight="semi-bold">
              {title}
            </Heading>
          ) : null}
          {description ? (
            <Text size="md" as="p">
              {description}
            </Text>
          ) : null}
        </Box>
      ) : null}

      {children}
    </Box>
  </div>
);

export const HomeSlider = ({ imgTheme }: { imgTheme: "light" | "dark" }) => {
  const introItems = [
    {
      id: "home-xdr",
      title: "Decode and Inspect",
      description: "Convert XDR data into human-readable JSON",
      imagePath: `/images/lab-home-intro-xdr-${imgTheme}.png`,
    },
    {
      id: "home-tx",
      title: "Build, Sign, Simulate & Submit Transactions",
      description: "Build Stellar transaction with a web interface",
      imagePath: `/images/lab-home-intro-tx-${imgTheme}.png`,
    },
    {
      id: "home-api",
      title: "Interact with API Endpoints",
      description: "Explore and test Stellar RPC and Horizon APIs",
      imagePath: `/images/lab-home-intro-api-${imgTheme}.png`,
    },
    {
      id: "home-contract",
      title: "Contract Explorer",
      description: "Explore smart contracts on the networks with ease",
      imagePath: `/images/lab-home-intro-contract-${imgTheme}.png`,
    },
  ];

  const sliderItems = [
    {
      id: "slider-xdr",
      title: "Decode and Inspect",
      description:
        "Decode XDR to human-readable JSON for inspection, or back from JSON to XDR for execution. Easily diff XDR to spot changes.",
      imagePath: `/images/lab-home-intro-xdr-${imgTheme}.png`,
      actionButton: {
        label: "XDR to JSON",
        route: Routes.XDR,
      },
      buttons: [
        {
          label: "Watch Video Tutorial",
          link: "https://youtu.be/ZrmDQKU2dqY?si=QXFFSQ4FAHgrx-8c",
        },
        {
          label: "XDR Overview",
          link: "https://developers.stellar.org/docs/learn/fundamentals/data-format/xdr",
        },
        {
          label: "XDR ⇄ JSON Conversion",
          link: "https://developers.stellar.org/docs/learn/fundamentals/data-format/xdr-json",
        },
      ],
    },
    {
      id: "slider-tx",
      title: "Build, Sign, Simulate & Submit Transactions",
      description:
        "Construct Stellar transactions with ease through a web interface. Lab supports building both classic operations (like payments, account creation) and smart contract transactions.",
      imagePath: `/images/lab-home-intro-tx-${imgTheme}.png`,
      actionButton: {
        label: "Build Transaction",
        route: Routes.BUILD_TRANSACTION,
      },
      buttons: [
        {
          label: "Watch Video Tutorial",
          link: "https://youtu.be/Isn5CkEWFs8?si=BUdXoSVYYFZPwKG8",
        },
        {
          label: "Create Account",
          link: "https://developers.stellar.org/docs/build/guides/transactions/create-account",
        },
        {
          label: "Payment",
          link: "https://developers.stellar.org/docs/build/apps/example-application-tutorial/payment",
        },
        {
          label: "Change Trust",
          link: "https://developers.stellar.org/docs/data/apis/horizon/api-reference/errors/result-codes/operation-specific/account-merge",
        },
        {
          label: "Account Merge",
          link: "https://developers.stellar.org/docs/data/apis/horizon/api-reference/errors/result-codes/operation-specific/account-merge",
        },
      ],
    },
    {
      id: "slider-api",
      title: "Explore RPC and Horizon Endpoints",
      description:
        "Interactively test and explore RPC methods and Horizon endpoints with a comprehensive interface for building requests, submitting them to networks, and viewing formatted responses.",
      imagePath: `/images/lab-home-intro-api-${imgTheme}.png`,
      actionButton: {
        label: "Use API Explorer",
        route: Routes.ENDPOINTS_RPC,
      },
      buttons: [
        {
          label: "RPC Methods Documentation",
          link: "https://developers.stellar.org/docs/tools/lab/api-explorer/rpc-methods",
        },
        {
          label: "Horizon Endpoints Documentation",
          link: "https://developers.stellar.org/docs/data/apis/horizon",
        },
      ],
    },
    {
      id: "slider-contract",
      title: "Smart Contract Explorer",
      description:
        "Inspect and interact with smart contracts deployed on the networks. Understand their interface, see their codebase, and invoke them in Lab.",
      imagePath: `/images/lab-home-intro-contract-${imgTheme}.png`,
      actionButton: {
        label: "Invoke Smart Contract",
        route: Routes.SMART_CONTRACTS_CONTRACT_EXPLORER,
      },
      buttons: [
        {
          label: "Watch Video Tutorial",
          link: "https://youtu.be/XcFgR_OHKl8?si=kJ5nEejo_t5ySpIU",
        },
        {
          label: "Contract Overview",
          link: "https://developers.stellar.org/docs/learn/fundamentals/contract-development/overview",
        },
        {
          label: "Contract Spec",
          link: "https://developers.stellar.org/docs/learn/fundamentals/contract-development/overview#contract-spec",
        },
        {
          label: "Contract Source Validation",
          link: "https://developers.stellar.org/docs/tools/lab/smart-contracts/contract-explorer#build-info",
        },
      ],
    },
  ];

  const containerEl = useRef<HTMLDivElement>(null);
  const sliderEl = useRef<HTMLDivElement>(null);
  const sliderScrollEl = useRef<HTMLDivElement>(null);

  const [isDesktopMode, setIsDesktopMode] = useState(true);
  const [isSliderVisible, setIsSliderVisible] = useState(false);
  const [currentSliderIndex, setCurrentSliderIndex] = useState<number>(0);

  useEffect(() => {
    const el = containerEl?.current;

    if (!el) {
      return;
    }

    const elResizeObserver = new ResizeObserver((entries) => {
      // Get the first entry
      if (entries[0]) {
        const isDesktop = Math.round(entries[0].contentRect.width) > 840;
        setIsDesktopMode(isDesktop);
        setIsSliderVisible(!isDesktop);
      }
    });

    // Start the observer
    elResizeObserver.observe(el);

    // Cleanup on unmount
    return () => {
      elResizeObserver.disconnect();
    };
  }, []);

  const handleClickOutside = (event: MouseEvent) => {
    if (sliderEl?.current?.contains(event.target as Node)) {
      return;
    }

    setIsSliderVisible(false);
  };

  // Close slider when clicked outside
  useLayoutEffect(() => {
    if (isDesktopMode && isSliderVisible) {
      document.addEventListener("pointerup", handleClickOutside);
    } else {
      document.removeEventListener("pointerup", handleClickOutside);
    }

    return () => {
      document.removeEventListener("pointerup", handleClickOutside);
    };
  }, [isSliderVisible, isDesktopMode, handleClickOutside]);

  useEffect(() => {
    const slider = sliderScrollEl?.current;

    if (!slider || !isSliderVisible) {
      return;
    }

    const scrollendHandler = () => {
      const width = slider.clientWidth;
      const activeIndex = Math.round(slider.scrollLeft / width);

      if (currentSliderIndex !== activeIndex) {
        setCurrentSliderIndex(activeIndex);
      }
    };

    slider.addEventListener("scrollend", scrollendHandler);

    return () => {
      slider.removeEventListener("scrollend", scrollendHandler);
    };
  }, [currentSliderIndex, isSliderVisible]);

  const handleSlideScroll = (index: number, hasScrollAnimation = true) => {
    const slider = sliderScrollEl?.current;

    if (slider) {
      const containerWidth = slider.clientWidth;

      slider.scroll({
        left: index * containerWidth,
        behavior: hasScrollAnimation ? "smooth" : "auto",
      });
    }
  };

  const updateSliderIndex = (newIndex: number) => {
    setCurrentSliderIndex(newIndex);
    handleSlideScroll(newIndex);
  };

  return (
    <div
      className="Lab__home__intro"
      ref={containerEl}
      data-is-desktop-mode={isDesktopMode}
      data-is-slider-visible={isSliderVisible}
    >
      {/* Slider */}
      <div className="Lab__home__introSlider" ref={sliderEl}>
        <div className="Lab__home__introSlider__container" ref={sliderScrollEl}>
          {sliderItems.map((s) => {
            const sliderImageSize = isDesktopMode ? 300 : 160;

            return (
              <div className="Lab__home__introSlider__cardItem" key={s.id}>
                {/* Image */}
                <div className="Lab__home__introSlider__cardItem__image">
                  <Image
                    src={s.imagePath}
                    alt={`${s.title} image`}
                    width={sliderImageSize}
                    height={sliderImageSize}
                  />
                </div>

                {/* Cards */}
                <div className="Lab__home__introSlider__cardItem__content">
                  <div className="Lab__home__introSlider__cardItem__card">
                    <Box
                      gap="md"
                      direction="row"
                      align="center"
                      justify="space-between"
                    >
                      <Display
                        size="xs"
                        weight="semi-bold"
                        addlClassName="Lab__home__introSlider__cardItem__title"
                      >
                        {s.title}
                      </Display>

                      {isDesktopMode ? (
                        <div
                          className="Lab__home__introSlider__button"
                          role="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentSliderIndex(0);
                            setIsSliderVisible(false);
                          }}
                        >
                          <Icon.X />
                        </div>
                      ) : null}
                    </Box>
                    <Text
                      as="div"
                      size="md"
                      addlClassName="Lab__home__introSlider__cardItem__description"
                    >
                      {s.description}
                    </Text>

                    <Box gap="sm" wrap="wrap">
                      <Text
                        as="div"
                        size="md"
                        addlClassName="Lab__home__introSlider__cardItem__note"
                        weight="medium"
                      >
                        Most useful documents for developer engagement:
                      </Text>

                      <Box gap="sm" wrap="wrap" direction="row">
                        {s.buttons.map((b, idx) => (
                          <Button
                            size="lg"
                            variant="tertiary"
                            icon={<Icon.LinkExternal01 />}
                            key={`${s.id}-${idx}`}
                            onClick={() => {
                              openUrl(b.link);
                            }}
                          >
                            {b.label}
                          </Button>
                        ))}
                      </Box>
                    </Box>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Left button */}
        <button
          className="Lab__home__introSlider__button"
          disabled={currentSliderIndex === 0}
          data-btn="left"
          data-is-active={currentSliderIndex !== 0}
          onClick={() => {
            updateSliderIndex(currentSliderIndex - 1);
          }}
        >
          <Icon.ChevronLeft />
        </button>

        {/* Right button */}
        <button
          className="Lab__home__introSlider__button"
          disabled={currentSliderIndex === sliderItems.length - 1}
          data-btn="right"
          data-is-active={currentSliderIndex !== sliderItems.length - 1}
          onClick={() => {
            updateSliderIndex(currentSliderIndex + 1);
          }}
        >
          <Icon.ChevronRight />
        </button>

        {/* Dots nav */}
        <Box
          gap="md"
          direction="row"
          align="center"
          justify="center"
          addlClassName="Lab__home__introSlider__nav"
        >
          {sliderItems.map((_, idx) => (
            <div
              key={`nav-dot-${idx}`}
              className="Lab__home__introSlider__nav__dot"
              data-is-current={currentSliderIndex === idx}
              onClick={() => {
                updateSliderIndex(idx);
              }}
            ></div>
          ))}
        </Box>
      </div>

      {/* Cards */}
      <div className="Lab__home__introCards">
        {introItems.map((i, cardIndex) => (
          <div
            className="Lab__home__intro__card"
            key={`home-sm-${i.id}`}
            onClick={() => {
              setCurrentSliderIndex(cardIndex);
              setIsSliderVisible(true);
              handleSlideScroll(cardIndex, false);
            }}
          >
            <Box gap="xl" align="center">
              <div className="Lab__home__introCards__image">
                <Image
                  src={i.imagePath}
                  alt={`${i.title} image`}
                  width="183"
                  height="168"
                />
              </div>

              <Box gap="xs" align="center">
                <Text
                  as="div"
                  size="md"
                  weight="medium"
                  addlClassName="Lab__home__introCards__title"
                >
                  {i.title}
                </Text>
                <Text as="div" size="sm">
                  {i.description}
                </Text>
              </Box>
            </Box>
          </div>
        ))}
      </div>
    </div>
  );
};

export const HomeTutorials = () => {
  const tutorials = [
    {
      title: "Create Account",
      description: "Creates and funds a new Stellar account.",
      youTubeLink:
        "https://www.youtube.com/embed/Sou5wUsfsZw?si=dtQFORe7YBkmApHe",
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

export const HomeNetworks = ({
  imgTheme,
  network,
}: {
  imgTheme: "light" | "dark";
  network: Network | EmptyObj;
}) => {
  type BtnNetwork = string | null;

  type NetworkItem = {
    id: string;
    title: string;
    description: string;
    imagePath: string;
    links: { label: string; url?: string }[];
  };

  const router = useRouter();
  const { getAndSetNetwork } = useSwitchNetwork();
  const [btnNetwork, setBtnNetwork] = useState<BtnNetwork>(null);

  const getNetworkLabel = (network: BtnNetwork) =>
    network ? capitalizeString(network) : "";

  const networkLabel = btnNetwork ? getNetworkLabel(btnNetwork) : "";

  const networkItems: NetworkItem[] = [
    {
      id: "testnet",
      title: "Testnet",
      description: "Safely test transactions without real funds.",
      imagePath: `/images/lab-home-net-test-${imgTheme}.png`,
      links: [
        {
          label: "Switch to Testnet",
        },
      ],
    },
    {
      id: "mainnet",
      title: "Mainnet",
      description: "Build, test, and run real transactions on Stellar.",
      imagePath: `/images/lab-home-net-main-${imgTheme}.png`,
      links: [
        {
          label: "Switch to Mainnet",
        },
      ],
    },
    {
      id: "local",
      title: "Local Network",
      description: "Run a local Stellar network for development.",
      imagePath: `/images/lab-home-net-local-${imgTheme}.png`,
      links: [
        {
          label: "Quickstart",
          url: "https://github.com/stellar/quickstart",
        },
        {
          label: "Stellar CLI",
          url: "https://github.com/stellar/stellar-cli",
        },
      ],
    },
  ];

  const handleModalClose = () => {
    setBtnNetwork(null);
  };

  const renderButtons = (item: NetworkItem) => {
    if (item.id === "local" && item.links.length > 1) {
      return item.links.map((l, idx) => (
        <Button
          variant="tertiary"
          size="lg"
          key={`networkItem-${item.id}-btn-${idx}`}
          // Not having URL here is unlikely
          onClick={() => (l.url ? openUrl(l.url) : false)}
        >
          {l.label}
        </Button>
      ));
    }

    if (["testnet", "mainnet"].includes(item.id) && item.links.length === 1) {
      // Show Build Transaction button if is current network
      if (item.id === network.id) {
        return (
          <Button
            variant="tertiary"
            size="lg"
            key={`networkItem-${item.id}-btn`}
            onClick={() => {
              router.push(Routes.BUILD_TRANSACTION);
            }}
          >
            Build Transaction
          </Button>
        );
      }

      return (
        <Button
          variant="tertiary"
          size="lg"
          key={`networkItem-${item.id}-btn`}
          onClick={() => {
            setBtnNetwork(item.id);
          }}
        >
          {item.links[0].label}
        </Button>
      );
    }

    return null;
  };

  return (
    <>
      <div className="Lab__home__networks">
        {networkItems.map((i) => (
          <div
            key={`networkItem-${i.id}`}
            className="Lab__home__networks__item"
            data-id={i.id}
          >
            <div className="Lab__home__networks__image">
              <Image
                src={i.imagePath}
                alt={`${i.title} image`}
                width={304}
                height={200}
              />
            </div>
            <Box gap="md" addlClassName="Lab__home__networks__content">
              <Box gap="xs">
                <Text
                  size="xl"
                  as="div"
                  weight="semi-bold"
                  addlClassName="Lab__home__networks__title"
                >
                  {i.title}
                </Text>
                <Text
                  size="md"
                  as="div"
                  addlClassName="Lab__home__networks__description"
                >
                  {i.description}
                </Text>
              </Box>
              <Box gap="sm" direction="row" wrap="wrap">
                {renderButtons(i)}
              </Box>
            </Box>
          </div>
        ))}
      </div>

      <Modal visible={Boolean(btnNetwork)} onClose={handleModalClose}>
        <Modal.Heading>{`Switch to ${networkLabel}`}</Modal.Heading>
        <Text
          as="div"
          size="sm"
          addlClassName="Lab__home__networks__modalText"
        >{`You’re currently on ${network.label}. Switch networks to try ${networkLabel}.`}</Text>
        <Modal.Footer>
          <Button
            size="md"
            variant="tertiary"
            onClick={() => handleModalClose()}
          >
            Cancel
          </Button>
          <Button
            size="md"
            variant="primary"
            onClick={() => {
              getAndSetNetwork(btnNetwork as NetworkType);
              handleModalClose();
            }}
          >
            {`Switch to ${networkLabel}`}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export const HomeResources = () => {
  const resourceItems = [
    {
      id: "youtube",
      title: "YouTube",
      description: "Watch tutorials, hear from us, and get inspired to build.",
      link: "https://www.youtube.com/@StellarDevelopmentFoundation",
      icon: <Logo.Youtube />,
    },
    {
      id: "discord",
      title: "Discord",
      description:
        "Join the conversation and build with us in the dev community.",
      link: "https://discord.gg/stellardev",
      icon: <Logo.Discord />,
    },
    {
      id: "stellar-quest",
      title: "Stellar Quest",
      description: "Get tested and earn rewards like XLM and NFTs.",
      link: "https://quest.stellar.org/",
      icon: <Logo.StellarShort />,
    },
    {
      id: "x",
      title: "X (Twitter)",
      description:
        "Follow along with us @StellarOrg for updates on our platforms.",
      link: "https://twitter.com/StellarOrg",
      icon: <Logo.XTwitter />,
    },
    {
      id: "dev-docs",
      title: "Developer Docs",
      description: "Place to find answers, how to build features step by step.",
      link: "https://developers.stellar.org/",
      icon: <Icon.Code01 />,
    },
  ];

  return (
    <div className="Lab__home__resources">
      {resourceItems.map((i) => (
        <Box
          gap="lg"
          addlClassName="Lab__home__resources__item"
          data-item={i.id}
          key={`resourceItem-${i.id}`}
        >
          <Box
            gap="sm"
            direction="row"
            align="center"
            addlClassName="Lab__home__resources__title"
          >
            {i.icon}
            <Text size="sm" as="div">
              {i.title}
            </Text>
          </Box>
          <Text
            size="md"
            as="div"
            weight="medium"
            addlClassName="Lab__home__resources__description"
          >
            {i.description}{" "}
          </Text>

          <Button
            size="md"
            variant="tertiary"
            icon={<Icon.LinkExternal01 />}
            onClick={() => openUrl(i.link)}
          >
            Check it out
          </Button>
        </Box>
      ))}
    </div>
  );
};
