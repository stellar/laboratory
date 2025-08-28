import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button, Display, Icon, Text } from "@stellar/design-system";

import { Routes } from "@/constants/routes";
import { Box } from "@/components/layout/Box";
import { openUrl } from "@/helpers/openUrl";
import { trackEvent, TrackingEvent } from "@/metrics/tracking";

export const Slider = ({ imgTheme }: { imgTheme: "light" | "dark" }) => {
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
          link: "https://developers.stellar.org/docs/data/apis/horizon/api-reference/errors/result-codes/operation-specific/change-trust",
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
                              trackEvent(
                                TrackingEvent.HOME_SLIDER_DETAILS_BTN,
                                {
                                  button: `${s.id}: ${b.label.toLowerCase()}`,
                                },
                              );
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

              trackEvent(TrackingEvent.HOME_SLIDER_CARD, {
                card: i.id,
              });
            }}
          >
            <Box gap="xl" align="center">
              <div className="Lab__home__introCards__image">
                <Image
                  src={i.imagePath}
                  alt={`${i.title} image`}
                  width="168"
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
