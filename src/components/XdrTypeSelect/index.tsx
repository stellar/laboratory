import { useEffect, useState } from "react";
import { Badge, Icon, Input } from "@stellar/design-system";

import { ALL_XDR_TYPES } from "@/constants/xdr";
import { delayedAction } from "@/helpers/delayedAction";
import { useIsXdrInit } from "@/hooks/useIsXdrInit";
import { useStore } from "@/store/useStore";

import * as StellarXdr from "@/helpers/StellarXdr";

import "./styles.scss";

export interface XdrTypeSelectProps {
  error?: string | React.ReactNode;
}

export const XdrTypeSelect = ({ error }: XdrTypeSelectProps) => {
  const { xdr } = useStore();

  const [searchValue, setSearchValue] = useState("");
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);
  const [displayOptions, setDisplayOptions] = useState<string[]>([]);
  const [guessedTypes, setGuessedTypes] = useState<string[]>([]);

  const isXdrInit = useIsXdrInit();

  useEffect(() => {
    if (searchValue) {
      const res = ALL_XDR_TYPES.filter((t) =>
        t.toLowerCase().includes(searchValue.toLowerCase()),
      );
      setDisplayOptions(res);
    } else {
      setDisplayOptions([]);
    }
  }, [searchValue]);

  useEffect(() => {
    if (isXdrInit && xdr.blob) {
      try {
        const guessed = StellarXdr.guess(xdr.blob);

        setGuessedTypes(guessed.length > 0 ? guessed : []);
      } catch (e) {
        setGuessedTypes([]);
      }
    } else {
      setGuessedTypes([]);
    }
    // Not adding xdr
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xdr.blob, isXdrInit]);

  const OptionItem = ({
    option,
    sectionTitle,
  }: {
    option?: string;
    sectionTitle?: string;
  }) => {
    if (sectionTitle) {
      return (
        <div className="XdrTypeSelect__item XdrTypeSelect__item--section">
          {sectionTitle}
        </div>
      );
    }

    if (option) {
      return (
        <div
          className="XdrTypeSelect__item"
          key={option}
          onClick={() => {
            xdr.updateXdrType(option);
            setIsOptionsVisible(false);
          }}
          data-is-current={xdr.type === option}
        >
          {option}
          {guessedTypes.includes(option) ? (
            <Badge variant="secondary" size="sm">
              Possible Type
            </Badge>
          ) : null}
        </div>
      );
    }

    return null;
  };

  const renderOptions = () => {
    // Default
    if (!searchValue) {
      return (
        <>
          <OptionItem sectionTitle="Popular" />

          {["TransactionEnvelope", "TransactionResult", "TransactionMeta"].map(
            (p) => (
              <OptionItem key={`popular-${p}`} option={p} />
            ),
          )}
          {guessedTypes ? (
            <>
              <OptionItem sectionTitle="Possible Types" />
              {guessedTypes.map((o) => (
                <OptionItem key={`guessed-${o}`} option={o} />
              ))}
            </>
          ) : null}

          <OptionItem sectionTitle="All" />

          {ALL_XDR_TYPES.map((o) => (
            <OptionItem key={`all-${o}`} option={o} />
          ))}
        </>
      );
    }

    // No search results
    if (searchValue && displayOptions.length === 0) {
      return <OptionItem sectionTitle="No matching XDR type found" />;
    }

    // Search results
    return displayOptions.map((o) => (
      <OptionItem key={`search-${o}`} option={o} />
    ));
  };

  return (
    <>
      <div className="XdrTypeSelect" data-testid="xdr-type-select-container">
        <Input
          id="xdr-type-select"
          fieldSize="md"
          label="XDR type"
          error={error}
          spellCheck="false"
          value={isOptionsVisible ? searchValue : xdr.type}
          onChange={(e) => {
            setSearchValue(e.target.value);
          }}
          onFocus={() => {
            setIsOptionsVisible(true);
          }}
          onBlur={() => {
            if (isOptionsVisible) {
              delayedAction({
                action: () => {
                  setIsOptionsVisible(false);
                  setSearchValue("");
                },
                delay: 200,
              });
            }
          }}
          leftElement={<Icon.SearchSm />}
          rightElement={<Icon.ChevronDown />}
          autoComplete="off"
        />

        <div
          className="XdrTypeSelect__options"
          data-is-visible={isOptionsVisible}
          data-testid="xdr-type-select-options"
        >
          {renderOptions()}
        </div>
      </div>
    </>
  );
};
