import { getTxData } from "../../src/helpers/getTxData";
import {
  TX_RESPONSE_SOROBAN_FEE_BUMP,
  TX_RESPONSE_SOROBAN,
} from "./mock/txResponse";

describe("getTxData() fee breakdown", () => {
  const runFeeBreakdownTests = (
    transactionName: string,
    txResponse: any,
    expectedMaxFee?: number,
  ) => {
    describe(transactionName, () => {
      let res: ReturnType<typeof getTxData>["feeBreakdown"];

      beforeAll(() => {
        res = getTxData(txResponse.result).feeBreakdown;
      });

      it("calculates soroban tx fees from tx response", () => {
        // Verify all fee breakdown properties are present and have expected types
        expect(res?.maxFee).toBeDefined();
        expect(res?.maxResourceFee).toBeDefined();
        expect(res?.inclusionFee).toBeDefined();
        expect(res?.nonRefundable).toBeDefined();
        expect(res?.refundable).toBeDefined();
        expect(res?.finalFeeCharged).toBeDefined();
        expect(res?.finalNonRefundable).toBeDefined();
        expect(res?.finalRefundable).toBeDefined();
        expect(res?.finalResourceFeeCharged).toBeDefined();
        expect(res?.finalInclusionFee).toBeDefined();
        expect(res?.finalRefunded).toBeDefined();
        expect(res?.refundedInclusionFee).toBeDefined();
        expect(res?.refundedResourceFee).toBeDefined();
        expect(res?.refundedRefundable).toBeDefined();
        expect(res?.refundedNonRefundable).toBeDefined();

        // If expected fee is provided, verify it matches
        if (expectedMaxFee) {
          expect(res?.maxFee).toEqual(String(expectedMaxFee));
        }
      });

      it("calculates fees correctly", () => {
        expect(res?.inclusionFee).toEqual(
          String(Number(res?.maxFee) - (Number(res?.maxResourceFee) || 0)),
        );
        expect(res?.finalRefunded).toEqual(
          String(Number(res?.maxFee) - Number(res?.finalFeeCharged)),
        );
      });

      it("verifies proposed fee calculations", () => {
        // inclusionFee = maxFee - maxResourceFee
        const expectedInclusionFee =
          Number(res!.maxFee) - Number(res!.maxResourceFee);
        expect(res?.inclusionFee).toEqual(String(expectedInclusionFee));

        // refundable = maxResourceFee - nonRefundable
        const expectedRefundable =
          Number(res!.maxResourceFee) - Number(res!.nonRefundable);
        expect(res?.refundable).toEqual(String(expectedRefundable));
      });

      it("verifies final fee calculations", () => {
        // finalResourceFeeCharged = finalNonRefundable + finalRefundable
        const expectedFinalResourceFee =
          Number(res!.finalNonRefundable) + Number(res!.finalRefundable);
        expect(res?.finalResourceFeeCharged).toEqual(
          String(expectedFinalResourceFee),
        );

        // finalInclusionFee = finalFeeCharged - finalResourceFeeCharged
        const expectedFinalInclusionFee =
          Number(res!.finalFeeCharged) - Number(res!.finalResourceFeeCharged);
        expect(res?.finalInclusionFee).toEqual(
          String(expectedFinalInclusionFee),
        );

        // finalRefunded = maxFee - finalFeeCharged
        const expectedFinalRefunded =
          Number(res!.maxFee) - Number(res!.finalFeeCharged);
        expect(res?.finalRefunded).toEqual(String(expectedFinalRefunded));
      });

      it("verifies refunded fee calculations", () => {
        // refundedInclusionFee = inclusionFee - finalInclusionFee
        const expectedRefundedInclusionFee =
          Number(res!.inclusionFee) - Number(res!.finalInclusionFee);
        expect(res?.refundedInclusionFee).toEqual(
          String(expectedRefundedInclusionFee),
        );

        // refundedResourceFee = maxResourceFee - finalResourceFeeCharged
        const expectedRefundedResourceFee =
          Number(res!.maxResourceFee) - Number(res!.finalResourceFeeCharged);
        expect(res?.refundedResourceFee).toEqual(
          String(expectedRefundedResourceFee),
        );

        // refundedRefundable = refundable - finalRefundable
        const expectedRefundedRefundable =
          Number(res!.refundable) - Number(res!.finalRefundable);
        expect(res?.refundedRefundable).toEqual(
          String(expectedRefundedRefundable),
        );

        // refundedNonRefundable = nonRefundable - finalNonRefundable
        const expectedRefundedNonRefundable =
          Number(res!.nonRefundable) - Number(res!.finalNonRefundable);
        expect(res?.refundedNonRefundable).toEqual(
          String(expectedRefundedNonRefundable),
        );
      });

      it("verifies total refunded amount consistency", () => {
        // Total refunded should equal sum of refunded inclusion + refunded resource fees
        const totalRefundedFromComponents =
          Number(res!.refundedInclusionFee) + Number(res!.refundedResourceFee);
        expect(Number(res?.finalRefunded)).toEqual(totalRefundedFromComponents);

        // Refunded resource fee should equal sum of refunded refundable + refunded non-refundable
        const refundedResourceFromComponents =
          Number(res!.refundedRefundable) + Number(res!.refundedNonRefundable);
        expect(Number(res?.refundedResourceFee)).toEqual(
          refundedResourceFromComponents,
        );

        // maxFee should equal inclusionFee + maxResourceFee
        const maxFeeFromComponents =
          Number(res!.inclusionFee) + Number(res!.maxResourceFee);
        expect(Number(res?.maxFee)).toEqual(maxFeeFromComponents);

        // finalFeeCharged should equal finalInclusionFee + finalResourceFeeCharged
        const finalFeeFromComponents =
          Number(res!.finalInclusionFee) + Number(res!.finalResourceFeeCharged);
        expect(Number(res?.finalFeeCharged)).toEqual(finalFeeFromComponents);

        // maxResourceFee should equal nonRefundable + refundable
        const maxResourceFromComponents =
          Number(res!.nonRefundable) + Number(res!.refundable);
        expect(Number(res?.maxResourceFee)).toEqual(maxResourceFromComponents);
      });

      it("verifies fee breakdown totals add up correctly", () => {
        // maxFee should equal inclusionFee + maxResourceFee
        const maxFeeFromComponents =
          Number(res!.inclusionFee) + Number(res!.maxResourceFee);
        expect(Number(res?.maxFee)).toEqual(maxFeeFromComponents);

        // finalFeeCharged should equal finalInclusionFee + finalResourceFeeCharged
        const finalFeeFromComponents =
          Number(res!.finalInclusionFee) + Number(res!.finalResourceFeeCharged);
        expect(Number(res?.finalFeeCharged)).toEqual(finalFeeFromComponents);

        // maxResourceFee should equal nonRefundable + refundable
        const maxResourceFromComponents =
          Number(res!.nonRefundable) + Number(res!.refundable);
        expect(Number(res?.maxResourceFee)).toEqual(maxResourceFromComponents);
      });

      it("returns null for NOT_FOUND status", () => {
        const mockTx = {
          ...txResponse.result,
          status: "NOT_FOUND",
        };
        const testRes = getTxData(mockTx).feeBreakdown;
        expect(testRes).toBeNull();
      });

      it("handles null transaction details", () => {
        const testRes = getTxData(null).feeBreakdown;
        expect(testRes).toBeNull();
      });

      it("handles missing resource fee data gracefully", () => {
        const mockTxMissingFields = {
          ...txResponse.result,
          resultMetaJson: {
            v3: {
              ext: "v0",
              operations: [],
            },
          },
        };

        const testRes = getTxData(mockTxMissingFields).feeBreakdown;

        // Should still calculate basic fees
        expect(testRes?.maxFee).toBeDefined();
        expect(testRes?.maxResourceFee).toBeDefined();
        expect(testRes?.inclusionFee).toBeDefined();

        // Fields dependent on soroban_meta should be undefined
        expect(testRes?.nonRefundable).toBeUndefined();
        expect(testRes?.refundable).toBeUndefined();
      });
    });
  };

  // Shared tests for both transaction types
  runFeeBreakdownTests("transaction (non-fee-bump)", TX_RESPONSE_SOROBAN);
  runFeeBreakdownTests(
    "fee-bump transaction",
    TX_RESPONSE_SOROBAN_FEE_BUMP,
    298012,
  );

  describe("transaction comparison and edge cases", () => {
    it("compares fee structure differences between normal and fee-bump transactions", () => {
      const normalTxRes = getTxData(TX_RESPONSE_SOROBAN.result).feeBreakdown;
      const feeBumpTxRes = getTxData(
        TX_RESPONSE_SOROBAN_FEE_BUMP.result,
      ).feeBreakdown;

      // Both should have valid fee breakdowns
      expect(normalTxRes).not.toBeNull();
      expect(feeBumpTxRes).not.toBeNull();

      // Fee amounts should be different (different transactions)
      expect(normalTxRes?.maxFee).not.toEqual(feeBumpTxRes?.maxFee);
      expect(normalTxRes?.finalFeeCharged).not.toEqual(
        feeBumpTxRes?.finalFeeCharged,
      );

      // Both should follow the same calculation rules
      // Normal transaction calculations
      const normalInclusionFee =
        Number(normalTxRes!.maxFee) - Number(normalTxRes!.maxResourceFee);
      expect(normalTxRes?.inclusionFee).toEqual(String(normalInclusionFee));

      // Fee-bump transaction calculations
      const feeBumpInclusionFee =
        Number(feeBumpTxRes!.maxFee) - Number(feeBumpTxRes!.maxResourceFee);
      expect(feeBumpTxRes?.inclusionFee).toEqual(String(feeBumpInclusionFee));
    });

    it("handles transaction without fee bump", () => {
      const mockTxWithoutFeeBump = {
        ...TX_RESPONSE_SOROBAN_FEE_BUMP.result,
        envelopeJson: {
          tx: {
            tx: {
              fee: 100000,
              ext: {
                v1: {
                  resource_fee: 95000,
                },
              },
            },
          },
        },
        resultJson: {
          fee_charged: 90000,
        },
      };

      const res = getTxData(mockTxWithoutFeeBump).feeBreakdown;
      expect(res?.maxFee).toEqual("100000");
      expect(res?.maxResourceFee).toEqual("95000");
      expect(res?.inclusionFee).toEqual("5000");
    });

    it("verifies fee-bump transaction specific values", () => {
      const res = getTxData(TX_RESPONSE_SOROBAN_FEE_BUMP.result).feeBreakdown;

      // Test specific expected values for fee-bump transaction
      expect(res?.maxFee).toEqual("298012");
      expect(res?.maxResourceFee).toEqual("297810");
      expect(res?.inclusionFee).toEqual("202");
      expect(res?.nonRefundable).toEqual("172758");
      expect(res?.refundable).toEqual("125052");
      expect(res?.finalFeeCharged).toEqual("226598");
      expect(res?.finalNonRefundable).toEqual("172758");
      expect(res?.finalRefundable).toEqual("53638");
      expect(res?.finalResourceFeeCharged).toEqual("226396");
      expect(res?.finalInclusionFee).toEqual("202");
      expect(res?.finalRefunded).toEqual("71414");
      expect(res?.refundedInclusionFee).toEqual("0");
      expect(res?.refundedResourceFee).toEqual("71414");
      expect(res?.refundedRefundable).toEqual("71414");
      expect(res?.refundedNonRefundable).toEqual("0");
    });
  });
});
