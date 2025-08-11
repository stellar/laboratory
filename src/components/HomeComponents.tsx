import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Heading,
  Icon,
  Text,
  Button,
  Modal,
  Display,
} from "@stellar/design-system";

import { Box } from "@/components/layout/Box";
import { SdsLink } from "@/components/SdsLink";

import { useSwitchNetwork } from "@/hooks/useSwitchNetwork";
import { openUrl } from "@/helpers/openUrl";
import { capitalizeString } from "@/helpers/capitalizeString";

import { EmptyObj, Network, NetworkType, ThemeColorType } from "@/types/types";

export const HomeSection = ({
  title,
  eyebrow,
  description,
  children,
  isTopSection = false,
}: {
  title: string;
  eyebrow?: string;
  description?: React.ReactNode;
  children: React.ReactElement | React.ReactElement[];
  isTopSection?: boolean;
}) => (
  <div className="Lab__home__section" data-no-padding="true">
    <Box gap="xl" addlClassName="Lab__home__content">
      <Box gap="xs">
        {eyebrow ? <div className="Lab__home__eyebrow">{eyebrow}</div> : null}
        <Heading
          as={isTopSection ? "h1" : "h2"}
          size={isTopSection ? "md" : "xs"}
          weight="semi-bold"
        >
          {title}
        </Heading>
        {description ? (
          <Text size="md" as="p">
            {description}
          </Text>
        ) : null}
      </Box>

      {children}
    </Box>
  </div>
);

export const HomeIntro = () => {
  const introItems = [
    {
      id: "home-tx",
      title: "Sign, Simulate & Build Transactions",
      description: "Build Stellar transaction through a web interface",
      imagePath: "/images/lab-home-intro-tx.png",
      imageSize: 180,
    },
    {
      id: "home-contract",
      title: "Contract Explorer",
      description: "Comprehensive smart contract inspection",
      imagePath: "/images/lab-home-intro-contract.png",
      imageSize: 180,
    },
    {
      id: "home-xdr",
      title: "Decode and Inspect",
      description: "Convert XDR data into human-readable JSON",
      imagePath: "/images/lab-home-intro-xdr.png",
      imageSize: 180,
    },
    {
      id: "home-api",
      title: "Explore Endpoints",
      description: "Test and explore Stellar Horizon and RPC API",
      imagePath: "/images/lab-home-intro-api.png",
      imageSize: 210,
    },
  ];

  const sliderItems = [
    {
      id: "slider-tx",
      title: "Sign, Simulate & Build Transaction",
      description:
        "Construct Stellar transactions through a web interface. It supports building both classic Stellar operations(like payments, account creation) and Soroban smart contract transactions.",
      tutorialLink: "",
      imagePath: "/images/lab-home-intro-tx.png",
      imageSize: 311,
      buttons: [
        {
          label: "Create Account",
          link: "",
        },
        {
          label: "Payment",
          link: "",
        },
        {
          label: "Change Trust",
          link: "",
        },
        {
          label: "Account Merge",
          link: "",
        },
      ],
    },
    {
      id: "slider-contract",
      title: "Real-time feedback",
      description:
        "Immediate validation and error display system that provides instant feedback as users build transactions. The system validates user input continuously and shows error without requiring from submission.",
      tutorialLink: "",
      imagePath: "/images/lab-home-intro-contract.png",
      imageSize: 311,
      buttons: [
        {
          label: "Resource Fee Validation",
          link: "",
        },
        {
          label: "Multisignature Account Validation",
          link: "",
        },
        {
          label: "API Documentation",
          link: "",
        },
      ],
    },
    {
      id: "slider-xdr",
      title: "Decode and Inspect",
      description:
        "The process of converting XDR(External Data Representation) data into human-readable JSON format for inspection and analysis.",
      tutorialLink: "",
      imagePath: "/images/lab-home-intro-xdr.png",
      imageSize: 311,
      buttons: [
        {
          label: "XDR Overview",
          link: "",
        },
        {
          label: "XDR ⇄ JSON Conversion",
          link: "",
        },
      ],
    },
    {
      id: "slider-api",
      title: "Explore Endpoints ",
      description:
        "Interactively test and explore Stellar’s REST API endpoints and RPC methods, with a comprehensive interface for building requests, submitting them to networks, and viewing formatted responses. ",
      tutorialLink: "",
      imagePath: "/images/lab-home-intro-api.png",
      imageSize: 343,
      buttons: [
        {
          label: "RPC Methods Documentation",
          link: "",
        },
        {
          label: "Horizon Endpoints Documentation",
          link: "",
        },
      ],
    },
  ];

  const containerEl = useRef<HTMLDivElement>(null);
  const sliderEl = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const slider = sliderEl?.current;

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
    const slider = sliderEl?.current;

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
      <div className="Lab__home__introSlider">
        <div className="Lab__home__introSlider__container" ref={sliderEl}>
          {sliderItems.map((s) => {
            const sliderImageSize = isDesktopMode ? s.imageSize : 160;

            return (
              <div className="Lab__home__introSlider__cardItem" key={s.id}>
                <div className="Lab__home__introSlider__cardItem__image">
                  <Image
                    src={s.imagePath}
                    alt={`${s.title} image`}
                    width={sliderImageSize}
                    height={sliderImageSize}
                  />
                </div>

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

                    {s.tutorialLink ? (
                      <SdsLink
                        href={s.tutorialLink}
                        icon={<Icon.LinkExternal01 />}
                      >
                        Watch Video Tutorial
                      </SdsLink>
                    ) : null}

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
                            // TODO: handle link
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

        <div className="Lab__home__introSlider__nav">
          <Box
            gap="md"
            direction="row"
            align="center"
            justify="center"
            addlClassName="Lab__home__introSlider__nav__container"
          >
            {/* Left button */}
            <button
              className="Lab__home__introSlider__button"
              disabled={currentSliderIndex === 0}
              data-is-active={currentSliderIndex !== 0}
              onClick={() => {
                updateSliderIndex(currentSliderIndex - 1);
              }}
            >
              <Icon.ChevronLeft />
            </button>
            {/* Dots */}
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
            {/* Right button */}
            <button
              className="Lab__home__introSlider__button"
              disabled={currentSliderIndex === sliderItems.length - 1}
              data-is-active={currentSliderIndex !== sliderItems.length - 1}
              onClick={() => {
                updateSliderIndex(currentSliderIndex + 1);
              }}
            >
              <Icon.ChevronRight />
            </button>
          </Box>
        </div>
      </div>

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
                  width={i.imageSize}
                  height={i.imageSize}
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
      description: "Stellar Quest Level 1 (Lumen Loop)",
      youTubeLink:
        "https://www.youtube.com/embed/Sou5wUsfsZw?si=dtQFORe7YBkmApHe",
    },
    {
      title: "Payment",
      description: "Stellar Quest Level 1 (Lumen Loop)",
      youTubeLink:
        "https://www.youtube.com/embed/Isn5CkEWFs8?si=Fj5UkHk8XzVWzyA_",
    },
    {
      title: "Change Trust",
      description: "Stellar Quest Level 1 (Lumen Loop)",
      youTubeLink:
        "https://www.youtube.com/embed/Ln-_2pkkj3k?si=B9XmD2BEkc6cyDpu",
    },
    {
      title: "Manage Offers",
      description: "Stellar Quest Level 1 (Lumen Loop)",
      youTubeLink:
        "https://www.youtube.com/embed/4d558Q0MDso?si=IIslGXLT1clwXIOR",
    },
    {
      title: "Path Payments",
      description: "Stellar Quest Level 1 (Lumen Loop)",
      youTubeLink:
        "https://www.youtube.com/embed/ZNuNrYjpx9s?si=ZAK5L_ZCg9Jb1B0y",
    },
    {
      title: "Account Merge",
      description: "Stellar Quest Level 2 (Lumen Loop)",
      youTubeLink:
        "https://www.youtube.com/embed/XkzYMQUtyeo?si=VcOGkVJErgdiHip3",
    },
    {
      title: "Manage Data",
      description: "Stellar Quest Level 2 (Lumen Loop)",
      youTubeLink:
        "https://www.youtube.com/embed/vRq8_cSFdlQ?si=AtsZ-W7uzuZi3Fz4",
    },
    {
      title: "Set Options Home Domain",
      description: "Stellar Quest Level 2 (Lumen Loop)",
      youTubeLink:
        "https://www.youtube.com/embed/2bEe8DzKUUw?si=kjYopS1IOfUSgiOV",
    },
    {
      title: "Set Options Weights, Thresholds, and Signers",
      description: "Stellar Quest Level 2 (Lumen Loop)",
      youTubeLink:
        "https://www.youtube.com/embed/RmvIdxkm_JE?si=SkVtyqcJ4leeBFU3",
    },
    {
      title: "Set Flags",
      description: "Stellar Quest Level 2 (Lumen Loop)",
      youTubeLink:
        "https://www.youtube.com/embed/ovJK8I4qoC0?si=XkXvXZSQEUhlV5Zu",
    },
    {
      title: "Bump Sequence",
      description: "Stellar Quest Level 3 (Lumen Loop)",
      youTubeLink:
        "https://www.youtube.com/embed/9sCTcK2sYaU?si=E1FoQeiudnWlne7N",
    },
    {
      title: "Sponsorships",
      description: "Stellar Quest Level 3 (Lumen Loop)",
      youTubeLink:
        "https://www.youtube.com/embed/-MTUtsp_Ovc?si=60EEBVFoYzxszfrc",
    },
    {
      title: "Claimable Balances",
      description: "Stellar Quest Level 3 (Lumen Loop)",
      youTubeLink:
        "https://www.youtube.com/embed/cC669NmLyew?si=XAVMNapfqeOVoAeV",
    },
    {
      title: "Clawbacks",
      description: "Stellar Quest Level 3 (Lumen Loop)",
      youTubeLink:
        "https://www.youtube.com/embed/DWJ-wOydPJQ?si=vW-PF5ffoEoX1H9-",
    },
    {
      title: "Liquidity Pools",
      description: "Stellar Quest Level 3 (Lumen Loop)",
      youTubeLink:
        "https://www.youtube.com/embed/kd5sa5df3oU?si=wK2bkN1_SAUrnfw8",
    },
    {
      title: "Hello World (Build, Deploy, Invoke)",
      description: "Stellar Soroban Quest Live 1 (Lumen Loop)",
      youTubeLink:
        "https://www.youtube.com/embed/XcFgR_OHKl8?si=-5wdlfi5xqhQyoRX",
    },
    {
      title: "Auth Store (Store and Retrieve)",
      description: "Stellar Soroban Quest Live 2 (Lumen Loop)",
      youTubeLink:
        "https://www.youtube.com/embed/kpyIotaiFfw?si=p9QSbs3hNYguHawP",
    },
    {
      title: "Reverse Engineer (Decode XDR)",
      description: "Stellar Soroban Quest Live 3 (Lumen Loop)",
      youTubeLink:
        "https://www.youtube.com/embed/ZrmDQKU2dqY?si=iMELpqmM_mn8rbkL",
    },
    {
      title: "Cross Contract",
      description: "Stellar Soroban Quest Live 4 (Lumen Loop)",
      youTubeLink:
        "https://www.youtube.com/embed/nyGFAA8hcDE?si=1mOFIgEYboi2VgSC",
    },
    {
      title: "Custom Types (Structs and Enums)",
      description: "Stellar Soroban Quest Live 5 (Lumen Loop)",
      youTubeLink:
        "https://www.youtube.com/embed/Dypune9qagg?si=_geNAtdF07s4hQfN",
    },
  ];

  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="Lab__home__tutorials">
      {/* Video */}
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

      {/* List */}
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
  theme,
  network,
}: {
  theme: ThemeColorType | null;
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

  const { getAndSetNetwork } = useSwitchNetwork();
  const [btnNetwork, setBtnNetwork] = useState<BtnNetwork>(null);

  const getNetworkLabel = (network: BtnNetwork) =>
    network ? capitalizeString(network) : "";

  const imgTheme = theme === "sds-theme-dark" ? "dark" : "light";
  const networkLabel = btnNetwork ? getNetworkLabel(btnNetwork) : "";

  const networkItems: NetworkItem[] = [
    {
      id: "testnet",
      title: "Testnet",
      description:
        "Works like a staging environment. Test and develop without using real XLM.",
      imagePath: `/images/lab-home-net-test-${imgTheme}.png`,
      links: [
        {
          label: "Try Testnet",
        },
      ],
    },
    {
      id: "mainnet",
      title: "Mainnet",
      description:
        "This is the production environment. Connect to the Stellar public network.",
      imagePath: `/images/lab-home-net-main-${imgTheme}.png`,
      links: [
        {
          label: "Try Mainnet",
        },
      ],
    },
    {
      id: "local",
      title: "Local Network",
      description: "Use the Stellar CLI to create a local network.",
      imagePath: `/images/lab-home-net-local-${imgTheme}.png`,
      links: [
        {
          label: "Use Quickstart",
          url: "https://github.com/stellar/quickstart",
        },
        {
          label: "Use Stellar CLI",
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
          icon={<Icon.ArrowRight />}
          // Not having URL here is unlikely
          onClick={() => (l.url ? openUrl(l.url) : false)}
        >
          {l.label}
        </Button>
      ));
    }

    if (["testnet", "mainnet"].includes(item.id) && item.links.length === 1) {
      return (
        <Button
          variant="tertiary"
          size="lg"
          key={`networkItem-${item.id}-btn`}
          icon={<Icon.ArrowRight />}
          onClick={() => {
            setBtnNetwork(item.id);
          }}
          disabled={item.id === network.id}
        >
          {item.id === network.id
            ? `You’re on ${network.label}`
            : item.links[0].label}
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
              <Box gap="sm">{renderButtons(i)}</Box>
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
      title: "Developer Docs",
      description: "Place to find answers, how to build features step by step.",
      link: "https://developers.stellar.org/",
    },
    {
      title: "YouTube",
      description: "Watch tutorials, hear from us, and get inspired to build.",
      link: "https://www.youtube.com/@StellarDevelopmentFoundation",
    },
    {
      title: "Stellar Quest",
      description: "Get tested and earn rewards like XLM and NFTs.",
      link: "https://quest.stellar.org/",
    },
    {
      title: "X (Twitter)",
      description:
        "Follow along with us @StellarOrg for updates on our platforms.",
      link: "https://twitter.com/StellarOrg",
    },
    {
      title: "Discord",
      description:
        "Join the conversation and build with us in the dev community.",
      link: "https://discord.gg/stellardev",
    },
  ];

  return (
    <div className="Lab__home__resources">
      {resourceItems.map((i, idx) => (
        <div className="Lab__home__resources__item" key={`resourceItem-${idx}`}>
          <Text size="sm" as="div" addlClassName="Lab__home__resources__title">
            {i.title}
          </Text>
          <Text
            size="md"
            as="div"
            weight="medium"
            addlClassName="Lab__home__resources__description"
          >
            {i.description}{" "}
            <SdsLink
              href={i.link}
              variant="primary"
              icon={<Icon.LinkExternal01 />}
            ></SdsLink>
          </Text>
        </div>
      ))}
    </div>
  );
};
