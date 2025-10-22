import React, { useState } from "react";

import { Button, Icon } from "@stellar/design-system";

import { arrayItem } from "@/helpers/arrayItem";

import { TextPicker } from "@/components/FormElements/TextPicker";
import { Box } from "@/components/layout/Box";
import { InputSideElement } from "@/components/InputSideElement";
import { LabelHeading } from "@/components/LabelHeading";
import { SignerSelector } from "@/components/SignerSelector";

type Values = string[];

type MultiPickerProps = {
  id: string;
  label: string;
  labelSuffix?: string | React.ReactNode;
  onChange: (val: Values) => void;
  placeholder: string;
  validate: (...args: any[]) => any;
  value: Values;
  autocomplete?: React.HTMLInputAutoCompleteAttribute;
  buttonLabel?: string;
  limit?: number;
  useAutoAdd?: boolean;
  note?: React.ReactNode;
  isPassword?: boolean;
  rightElement?: (index: number) => React.ReactNode;
  useSecretSelector?: boolean;
};

export const MultiPicker = ({
  id,
  label,
  labelSuffix,
  onChange,
  placeholder,
  validate,
  value,
  autocomplete,
  buttonLabel = "Add additional",
  limit,
  useAutoAdd,
  note,
  isPassword,
  useSecretSelector = false,
}: MultiPickerProps) => {
  if (!value || !value.length) {
    value = [];
  }

  const [isSelectorOpen, setIsSelectorOpen] = useState<{
    visible: boolean;
    index: number | null;
  }>({
    visible: false,
    index: null,
  });

  return (
    <Box gap="sm" data-testid={`multipicker-${id}`}>
      <LabelHeading size="md" labelSuffix={labelSuffix}>
        {label}
      </LabelHeading>
      <>
        {value.length
          ? value.map((singleVal: string, index: number) => {
              const errorMessage = singleVal ? validate(singleVal) : false;

              return (
                <div className="MultiPicker__input" key={`${id}-${index}`}>
                  <TextPicker
                    id={`${id}-${index}`}
                    onChange={(e) => {
                      const val = arrayItem.update(
                        value,
                        index,
                        e.target.value,
                      );
                      const isLastItem = index === value.length - 1;

                      // If enabled, automatically add another signer if is last item
                      return onChange(
                        useAutoAdd && isLastItem ? [...val, ""] : [...val],
                      );
                    }}
                    value={singleVal}
                    error={errorMessage}
                    placeholder={placeholder}
                    autocomplete={autocomplete}
                    rightElement={
                      <>
                        {useSecretSelector ? (
                          <SignerSelector.Button
                            mode="secret"
                            onClick={() => {
                              setIsSelectorOpen({ visible: true, index });
                            }}
                          />
                        ) : null}
                        {index !== 0 ? (
                          <InputSideElement
                            variant="button"
                            onClick={() => {
                              const val = arrayItem.delete(value, index);
                              return onChange([...val]);
                            }}
                            placement="right"
                            icon={<Icon.Trash01 />}
                            addlClassName="MultiPicker__delete"
                          />
                        ) : null}
                      </>
                    }
                    isPassword={isPassword}
                  />
                  {useSecretSelector ? (
                    <SignerSelector.Dropdown
                      mode="secret"
                      isOpen={
                        index === isSelectorOpen.index && isSelectorOpen.visible
                      }
                      onClose={() => {
                        setIsSelectorOpen({ visible: false, index: null });
                      }}
                      onChange={(selectedSigner) => {
                        const val = arrayItem.update(
                          value,
                          index,
                          selectedSigner,
                        );
                        onChange([...val]);
                        setIsSelectorOpen({ visible: false, index: null });
                      }}
                    />
                  ) : null}
                </div>
              );
            })
          : null}
        {note ? (
          <div className="FieldNote FieldNote--note FieldNote--md">{note}</div>
        ) : null}
      </>
      <>
        {!useAutoAdd ? (
          <div>
            <Button
              disabled={value.length === limit}
              size="md"
              variant="tertiary"
              onClick={(e) => {
                e.preventDefault();
                onChange([...value, ""]);
              }}
            >
              {buttonLabel}
            </Button>
          </div>
        ) : null}
      </>
    </Box>
  );
};
