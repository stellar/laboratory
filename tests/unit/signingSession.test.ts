import { useLayoutEffect, useRef, useState } from "react";
import { SignTransactionXdr } from "../../src/components/SignTransactionXdr";
import { useStore } from "../../src/store/useStore";
import { txHelper } from "../../src/helpers/txHelper";
import {
  Account,
  Keypair,
  Networks,
  Operation,
  TransactionBuilder,
} from "@stellar/stellar-sdk";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useLayoutEffect: jest.fn(),
  useRef: jest.fn(),
  useState: jest.fn(),
}));
jest.mock("@stellar/design-system", () => ({
  Button: "button",
  Icon: {},
  Select: "select",
  Text: "text",
}));
jest.mock("../../src/components/SignTransactionXdr/styles.scss", () => ({}));
jest.mock("../../src/components/FormElements/MultiPicker", () => ({
  MultiPicker: "multi-picker",
}));
jest.mock("../../src/components/layout/Box", () => ({ Box: "box" }));
jest.mock("../../src/components/MessageField", () => ({
  MessageField: "message",
}));
jest.mock("../../src/components/FormElements/TextPicker", () => ({
  TextPicker: "text-picker",
}));
jest.mock("../../src/components/LabelHeading", () => ({
  LabelHeading: "heading",
}));
jest.mock(
  "../../src/components/FormElements/PubKeyPickerWithSignerSelector",
  () => ({ PubKeyPickerWithSignerSelector: "key-picker" }),
);
jest.mock("../../src/helpers/txHelper", () => ({
  txHelper: { signWithLedger: jest.fn() },
}));
jest.mock("../../src/validate", () => ({
  validate: { getSecretKeyError: () => "", getBipPathError: () => "" },
}));
jest.mock("../../src/metrics/tracking", () => ({
  trackEvent: jest.fn(),
  TrackingEvent: {},
}));
jest.mock("../../src/hooks/useSignWithExtensionWallet", () => ({
  useSignWithExtensionWallet: () => ({ signTx: jest.fn(), isLoading: false }),
}));
jest.mock("../../src/store/useStore", () => ({ useStore: jest.fn() }));

// Exercise the boundary's callbacks and pending device requests without a DOM.
// Hook cells persist across rerenders; a new session gets new cells, as React keys dictate.
let cells: any[];
let cursor: number;
let effects: Array<() => void | (() => void)>;
let cleanups: Array<() => void>;
const render = (component: () => any) => {
  cursor = 0;
  effects = [];
  const result = component();
  cleanups = effects.map((effect) => effect()).filter(Boolean) as Array<
    () => void
  >;
  return result;
};
const find = (node: any, predicate: (node: any) => boolean): any => {
  if (!node || typeof node !== "object") return;
  if (predicate(node)) return node;
  for (const child of Object.values(node.props ?? node)) {
    const found = Array.isArray(child)
      ? child.map((item) => find(item, predicate)).find(Boolean)
      : find(child, predicate);
    if (found) return found;
  }
};

beforeEach(() => {
  jest.clearAllMocks();
  cells = [];
  cursor = 0;
  effects = [];
  cleanups = [];
  (useRef as jest.Mock).mockImplementation((initial) => {
    const index = cursor++;
    if (!(index in cells)) cells[index] = { current: initial };
    return cells[index];
  });
  (useState as jest.Mock).mockImplementation((initial) => {
    const index = cursor++;
    if (!(index in cells)) cells[index] = initial;
    return [
      cells[index],
      (value: any) => {
        cells[index] =
          typeof value === "function" ? value(cells[index]) : value;
      },
    ];
  });
  (useLayoutEffect as jest.Mock).mockImplementation((effect) => {
    effects.push(effect);
  });
  (useStore as unknown as jest.Mock).mockReturnValue({
    network: { id: "testnet", passphrase: Networks.TESTNET },
  });
});

it.each(["xdr", "network", "passphrase"])(
  "replaces the entire signing session and clears the parent result when %s changes",
  (change) => {
    const onDoneAction = jest.fn();
    const props = { id: "test", xdrToSign: "transaction-A", onDoneAction };
    const first = render(() => SignTransactionXdr(props));
    expect(onDoneAction).not.toHaveBeenCalled();
    expect(render(() => SignTransactionXdr(props)).key).toBe(first.key);
    if (change === "xdr") props.xdrToSign = "transaction-B";
    else
      (useStore as unknown as jest.Mock).mockReturnValue({
        network: {
          id: change === "network" ? "custom" : "testnet",
          passphrase:
            change === "network" ? Networks.TESTNET : "different passphrase",
        },
      });
    const next = render(() => SignTransactionXdr(props));
    expect(next.key).not.toBe(first.key);
    expect(onDoneAction).toHaveBeenCalledWith({
      signedXdr: null,
      successMessage: null,
      errorMessage: null,
    });
    onDoneAction.mockClear();
    render(() => SignTransactionXdr({ ...props, onDoneAction: jest.fn() }));
    expect(onDoneAction).not.toHaveBeenCalled();
  },
);

it("drops a late custom signing completion after its session is replaced", async () => {
  let finish!: (result: {
    successMessage: string;
    errorMessage: string;
  }) => void;
  const customSignFn = jest.fn(
    () =>
      new Promise<{ successMessage: string; errorMessage: string }>(
        (resolve) => {
          finish = resolve;
        },
      ),
  );
  const onDoneAction = jest.fn();
  const boundary = render(() =>
    SignTransactionXdr({
      id: "test",
      xdrToSign: "A",
      onDoneAction,
      customSignFn,
    }),
  );
  cells = [];
  const session = render(() => boundary.type(boundary.props));
  const button = find(session, (node) => node.type?.name === "SignTxButton");
  const pending = button.props.onSign();
  cleanups.forEach((cleanup) => cleanup());
  finish({ successMessage: "signed A", errorMessage: "" });
  await pending;
  expect(onDoneAction).not.toHaveBeenCalled();
});

it("drops a late hardware signature after its transaction session unmounts", async () => {
  const source = Keypair.random();
  const tx = new TransactionBuilder(new Account(source.publicKey(), "1"), {
    fee: "100",
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(Operation.manageData({ name: "test", value: "A" }))
    .setTimeout(0)
    .build();
  let finish!: (value: { signature: typeof tx.signatures }) => void;
  (txHelper.signWithLedger as jest.Mock).mockReturnValueOnce(
    new Promise((resolve) => {
      finish = resolve;
    }),
  );
  const onDoneAction = jest.fn();
  const boundary = render(() =>
    SignTransactionXdr({ id: "test", xdrToSign: tx.toXDR(), onDoneAction }),
  );
  cells = [];
  const draw = () => boundary.type(boundary.props);
  const initial = render(draw);
  find(initial, (node) => node.type === "select").props.onChange({
    target: { value: "ledger" },
  });
  const session = render(draw);
  const hardware = find(
    session,
    (node) => node.props?.["data-type"] === "hardwareWallet",
  );
  find(hardware, (node) => node.type?.name === "SignTxButton").props.onSign();
  expect(txHelper.signWithLedger).toHaveBeenCalledTimes(1);
  cleanups.forEach((cleanup) => cleanup());
  tx.sign(source);
  finish({ signature: tx.signatures });
  await new Promise((resolve) => setImmediate(resolve));
  expect(onDoneAction).not.toHaveBeenCalled();
});
