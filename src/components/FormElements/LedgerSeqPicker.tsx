import React, { useEffect } from "react";

import { InputSideElement } from "@/components/InputSideElement";
import { PositiveIntPicker } from "@/components/FormElements/PositiveIntPicker";

import { useLatestLedger } from "@/query/useLatestLedger";

import { useStore } from "@/store/useStore";

interface LedgerSeqPickerProps {
  id: string;
  labelSuffix?: string | React.ReactNode;
  label: string;
  value: string;
  placeholder?: string;
  error: string | undefined;
  onChange: (val: string) => void;
}

export const LedgerSeqPicker = ({
  id,
  labelSuffix,
  label,
  value,
  error,
  onChange,
  placeholder,
  ...props
}: LedgerSeqPickerProps) => {
  const { network } = useStore();

  const {
    data: latestLedgerSeq,
    error: latestLedgerError,
    refetch: fetchLedgerSequence,
    isFetching,
    isLoading,
  } = useLatestLedger({
    rpcUrl: network.rpcUrl,
  });

  useEffect(() => {
    if (latestLedgerSeq) {
      onChange(latestLedgerSeq.toString());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latestLedgerSeq]);

  return (
    <PositiveIntPicker
      key={id}
      id={id}
      label={label}
      placeholder={placeholder}
      labelSuffix={labelSuffix}
      value={value}
      error={error || latestLedgerError?.message}
      onChange={(e) => {
        onChange(e.target.value);
      }}
      rightElement={
        <InputSideElement
          variant="button"
          onClick={() => {
            fetchLedgerSequence();
          }}
          placement="right"
          disabled={!network.rpcUrl}
          isLoading={isFetching || isLoading}
        >
          Fetch latest ledger sequence
        </InputSideElement>
      }
      {...props}
    />
  );
};
