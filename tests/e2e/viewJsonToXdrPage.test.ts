import { test, expect } from "@playwright/test";

test.describe("View JSON to XDR Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/xdr/to");
  });

  test("Loads", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText("To XDR");
  });

  test("Import TransactionEnvelope JSON", async ({ page }) => {
    const xdrView = page.getByLabel("Base64 encoded XDR");
    const clearBtn = page.getByText("Clear JSON");

    // XDR not visible
    await expect(xdrView).toBeHidden();

    // Clear button disabled
    await expect(clearBtn).toBeDisabled();

    // JSON input
    const jsonInput = page.getByLabel("JSON");
    await jsonInput.fill(MOCK_TX_TRANSACTION_ENVELOPE_JSON);

    await expect(jsonInput).toHaveValue(MOCK_TX_TRANSACTION_ENVELOPE_JSON);

    // XDR type
    await expect(page.getByLabel("XDR type")).toHaveValue(
      "TransactionEnvelope",
    );

    // XDR visible
    await expect(xdrView).toBeVisible();
    await expect(xdrView).toHaveValue(MOCK_TX_TRANSACTION_ENVELOPE_XDR);

    // Clear button enabled
    await expect(clearBtn).toBeEnabled();

    // Clear screen
    await clearBtn.click();

    await expect(jsonInput).toHaveValue("");
  });

  test("Import TransactionResult JSON", async ({ page }) => {
    const jsonInput = page.getByLabel("JSON");
    await jsonInput.fill(MOCK_TX_TRANSACTION_RESULT_JSON);

    const xdrType = page.getByLabel("XDR type");
    const xdrTypeOptions = page.getByTestId("xdr-type-select-options");
    const xdrView = page.getByLabel("Base64 encoded XDR");
    const decodeErrorMsg = page.getByText(
      "Unable to decode JSON as TransactionEnvelope: unknown variant `fee_charged`, expected one of `tx_v0`, `tx`, `tx_fee_bump` at line 2 column 15",
    );

    // Initial state
    await expect(xdrType).toHaveValue("TransactionEnvelope");

    // Show unable to decode message
    await expect(decodeErrorMsg).toBeVisible();
    await expect(xdrTypeOptions).toBeHidden();
    await expect(xdrView).toBeHidden();

    // Select TransactionResult type from options
    await xdrType.focus();
    await expect(xdrTypeOptions).toBeVisible();
    await page.getByText("TransactionResult").first().click();

    // Decode JSON for the correct type
    await expect(xdrType).toHaveValue("TransactionResult");
    await expect(decodeErrorMsg).toBeHidden();
    await expect(xdrView).toBeVisible();
    await expect(xdrView).toHaveValue(MOCK_TX_TRANSACTION_RESULT_XDR);
  });

  test("Invalid JSON", async ({ page }) => {
    const decodeErrorMsg = page.getByText("Invalid JSON");

    await expect(decodeErrorMsg).toBeHidden();

    const xdrInput = page.getByLabel("JSON");
    await xdrInput.fill("AAA");

    await expect(decodeErrorMsg).toBeVisible();
    await expect(page.getByLabel("Base64 encoded XDR")).toBeHidden();
  });
});

// =============================================================================
// Mock data
// =============================================================================
const MOCK_TX_TRANSACTION_ENVELOPE_JSON = `{
  "tx": {
    "tx": {
      "source_account": "GAMQTINWD3YPP3GLTQZ4M6FKCCSRGROQLIIRVECIFC6VEGL5F64CND22",
      "fee": 100,
      "seq_num": 61607010893868,
      "cond": {
        "time": {
          "min_time": 0,
          "max_time": 0
        }
      },
      "memo": "none",
      "operations": [
        {
          "source_account": null,
          "body": {
            "payment": {
              "destination": "GAN7KZMNUEWWN7E35VGGST72QSA2YWA34XWJ55H7CL6MFLR6WPJVEA2U",
              "asset": "native",
              "amount": 10000000
            }
          }
        }
      ],
      "ext": "v0"
    },
    "signatures": []
  }
}`;
const MOCK_TX_TRANSACTION_ENVELOPE_XDR =
  "AAAAAgAAAAAZCaG2HvD37MucM8Z4qhClE0XQWhEakEgovVIZfS+4JgAAAGQAADgIAAAALAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAQAAAAAb9WWNoS1m/JvtTGlP+oSBrFgb5eye9P8S/MKuPrPTUgAAAAAAAAAAAJiWgAAAAAAAAAAA";
const MOCK_TX_TRANSACTION_RESULT_JSON = `{
  "fee_charged": 1100,
  "result": {
    "tx_success": [
      {
        "op_inner": {
          "create_account": "success"
        }
      },
      {
        "op_inner": {
          "create_account": "success"
        }
      },
      {
        "op_inner": {
          "create_account": "success"
        }
      },
      {
        "op_inner": {
          "create_account": "success"
        }
      },
      {
        "op_inner": {
          "create_account": "success"
        }
      },
      {
        "op_inner": {
          "create_account": "success"
        }
      },
      {
        "op_inner": {
          "change_trust": "success"
        }
      },
      {
        "op_inner": {
          "change_trust": "success"
        }
      },
      {
        "op_inner": {
          "payment": "success"
        }
      },
      {
        "op_inner": {
          "payment": "success"
        }
      },
      {
        "op_inner": {
          "create_account": "success"
        }
      }
    ]
  },
  "ext": "v0"
}`;
const MOCK_TX_TRANSACTION_RESULT_XDR =
  "AAAAAAAABEwAAAAAAAAACwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGAAAAAAAAAAAAAAAGAAAAAAAAAAAAAAABAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAA=";
