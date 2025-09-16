import { test, expect } from "@playwright/test";

// Test URL params render correctly on the UI
test.describe("URL Params", () => {
  test.describe("View XDR", () => {
    test("XDR to JSON", async ({ page }) => {
      await page.goto(
        "http://localhost:3000/xdr/view?$=network$id=testnet&label=Testnet&horizonUrl=https:////horizon-testnet.stellar.org&rpcUrl=https:////soroban-testnet.stellar.org&passphrase=Test%20SDF%20Network%20/;%20September%202015;&xdr$blob=AAAAAgAAAAAYheerp3FCahtW+3qusxzklJhfxMPQJERfPKY0lXnVjQAPQkAADQg//AAAAJAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAABAAAAABB90WssODNIgi6BHveqzxTRmIpvAFRyVNM+Hm2GVuCcAAAAAAAAAADGfZUR9pNoQGv+u6uGjdcwVF3zlb//mjyN53fUCn+iBGQAAABdIdugAAAAAAAAAAAKVedWNAAAAQA8JEfXRL2BLjcYHYX+6Dloij4OIR44zsu6hd9CSI//rQSgGulcIFmzY0sX4LIxdwCg//3UMOfXFEpGxIsDvaJEQuGVuCcAAAAQBYyy1VZl3iPQBI4hyv4e91Xv9KfM54jWWLVoh2HEjTWzPUsTlo6e2u//zGi+dcZxbNy//1MV9ipZuflVzLHPKlgs=;;",
      );

      await expect(page.locator("h1")).toHaveText("View XDR");
      await expect(page.getByLabel("Base-64 encoded XDR")).toHaveValue(
        "AAAAAgAAAAAYheerp3FCahtW+3qusxzklJhfxMPQJERfPKY0lXnVjQAPQkAADQg/AAAAJAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAABAAAAABB90WssODNIgi6BHveqzxTRmIpvAFRyVNM+Hm2GVuCcAAAAAAAAAADGfZUR9pNoQGv+u6uGjdcwVF3zlb/mjyN53fUCn+iBGQAAABdIdugAAAAAAAAAAAKVedWNAAAAQA8JEfXRL2BLjcYHYX+6Dloij4OIR44zsu6hd9CSI/rQSgGulcIFmzY0sX4LIxdwCg/3UMOfXFEpGxIsDvaJEQuGVuCcAAAAQBYyy1VZl3iPQBI4hyv4e91Xv9KfM54jWWLVoh2HEjTWzPUsTlo6e2u/zGi+dcZxbNy/1MV9ipZuflVzLHPKlgs=",
      );
      await expect(page.getByLabel("Transaction hash")).toHaveValue(
        "690b27bc3708ccaf6a97a136fe02ba1f52a3203ef6d3832f372ea3a06f38390f",
      );
      await expect(page.getByLabel("XDR type")).toHaveValue(
        "TransactionEnvelope",
      );
    });

    test("JSON to XDR", async ({ page }) => {
      await page.goto(
        "http://localhost:3000/xdr/to?$=network$id=testnet&label=Testnet&horizonUrl=https:////horizon-testnet.stellar.org&rpcUrl=https:////soroban-testnet.stellar.org&passphrase=Test%20SDF%20Network%20/;%20September%202015;&xdr$jsonString=%7B%0A%20%20%22tx%22:%20%7B%0A%20%20%20%20%22tx%22:%20%7B%0A%20%20%20%20%20%20%22source_account%22:%20%22GAMILZ5LU5YUE2Q3K35XVLVTDTSJJGC7YTB5AJCEL46KMNEVPHKY24VT%22,%0A%20%20%20%20%20%20%22fee%22:%201000000,%0A%20%20%20%20%20%20%22seq_num%22:%203668241373200420,%0A%20%20%20%20%20%20%22cond%22:%20%7B%0A%20%20%20%20%20%20%20%20%22time%22:%20%7B%0A%20%20%20%20%20%20%20%20%20%20%22min_time%22:%200,%0A%20%20%20%20%20%20%20%20%20%20%22max_time%22:%200%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%7D,%0A%20%20%20%20%20%20%22memo%22:%20%22none%22,%0A%20%20%20%20%20%20%22operations%22:%20%5B%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%22source_account%22:%20%22GAIH3ULLFQ4DGSECF2AR555KZ4KNDGEKN4AFI4SU2M7B43MGK3QJZNSR%22,%0A%20%20%20%20%20%20%20%20%20%20%22body%22:%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22create_account%22:%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22destination%22:%20%22GDDH3FIR62JWQQDL7252XBUN24YFIXPTSW76NDZDPHO7KAU75CARTCAQ%22,%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22starting_balance%22:%20100000000000%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%5D,%0A%20%20%20%20%20%20%22ext%22:%20%22v0%22%0A%20%20%20%20%7D,%0A%20%20%20%20%22signatures%22:%20%5B%0A%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%22hint%22:%20%229579d58d%22,%0A%20%20%20%20%20%20%20%20%22signature%22:%20%220f0911f5d12f604b8dc607617fba0e5a228f8388478e33b2eea177d09223fad04a01ae95c2059b3634b17e0b2317700a0ff750c39f5c51291b122c0ef689110b%22%0A%20%20%20%20%20%20%7D,%0A%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%22hint%22:%20%228656e09c%22,%0A%20%20%20%20%20%20%20%20%22signature%22:%20%221632cb555997788f401238872bf87bdd57bfd29f339e235962d5a21d871234d6ccf52c4e5a3a7b6bbfcc68be75c6716cdcbfd4c57d8a966e7e55732c73ca960b%22%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%5D%0A%20%20%7D%0A%7D;;",
      );

      await expect(page.locator("h1")).toHaveText("To XDR");
      await expect(page.getByLabel("XDR type")).toHaveValue(
        "TransactionEnvelope",
      );
      await expect(page.getByLabel("Base-64 encoded XDR")).toHaveValue(
        "AAAAAgAAAAAYheerp3FCahtW+3qusxzklJhfxMPQJERfPKY0lXnVjQAPQkAADQg/AAAAJAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAABAAAAABB90WssODNIgi6BHveqzxTRmIpvAFRyVNM+Hm2GVuCcAAAAAAAAAADGfZUR9pNoQGv+u6uGjdcwVF3zlb/mjyN53fUCn+iBGQAAABdIdugAAAAAAAAAAAKVedWNAAAAQA8JEfXRL2BLjcYHYX+6Dloij4OIR44zsu6hd9CSI/rQSgGulcIFmzY0sX4LIxdwCg/3UMOfXFEpGxIsDvaJEQuGVuCcAAAAQBYyy1VZl3iPQBI4hyv4e91Xv9KfM54jWWLVoh2HEjTWzPUsTlo6e2u/zGi+dcZxbNy/1MV9ipZuflVzLHPKlgs=",
      );
    });
  });

  test.describe("Transactions", () => {
    test("[Classic] Build Transaction", async ({ page }) => {
      await page.goto(
        "http://localhost:3000/transaction/build?$=network$id=testnet&label=Testnet&horizonUrl=https:////horizon-testnet.stellar.org&rpcUrl=https:////soroban-testnet.stellar.org&passphrase=Test%20SDF%20Network%20/;%20September%202015;&transaction$build$classic$operations@$operation_type=create_account&params$destination=GC5TQ7TXKHGE5JQMZPYV5KBSQ67X6PYQVU5QN7JRGWCHRA227UFPZ6LD&starting_balance=3000;&source_account=;&$operation_type=payment&params$destination=GAJAIHPKNTJ362TAUWTU2S56B7PULRTMY456LUELK53USX43537IFMS3&asset$code=USDC&issuer=GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5&type=credit_alphanum4;&amount=4000;&source_account=GA46LGGOLXJY5OSX6N4LHV4MWDFXNGLK76I4NDNKKYAXRRSKI5AJGMXG;;;&params$source_account=GA46LGGOLXJY5OSX6N4LHV4MWDFXNGLK76I4NDNKKYAXRRSKI5AJGMXG&fee=2000&seq_num=3668692344766465&cond$time$max_time=1733409768;;&memo$text=123;;&isValid$params:true&operations:true;;",
      );

      await expect(page.locator("h1")).toHaveText("Build Transaction");

      // Params
      await expect(
        page.getByLabel("Source Account", { exact: true }),
      ).toHaveValue("GA46LGGOLXJY5OSX6N4LHV4MWDFXNGLK76I4NDNKKYAXRRSKI5AJGMXG");
      await expect(page.getByLabel("Transaction Sequence Number")).toHaveValue(
        "3668692344766465",
      );
      await expect(page.getByLabel("Base Fee")).toHaveValue("2000");

      await expect(page.locator("#text-memo")).toBeChecked();
      await expect(page.locator("#memo_value")).toHaveValue("123");

      await expect(
        page.getByPlaceholder(
          "Lower time bound unix timestamp. Ex: 1479151713",
        ),
      ).toHaveValue("");
      await expect(
        page.getByPlaceholder(
          "Upper time bound unix timestamp. Ex: 1479151713",
        ),
      ).toHaveValue("1733409768");

      // Operations
      // Operation 0
      const op0 = page.getByTestId("build-transaction-operation-0");

      await expect(op0.getByLabel("Operation Type")).toHaveValue(
        "create_account",
      );
      await expect(op0.getByLabel("Destination")).toHaveValue(
        "GC5TQ7TXKHGE5JQMZPYV5KBSQ67X6PYQVU5QN7JRGWCHRA227UFPZ6LD",
      );
      await expect(op0.getByLabel("Starting Balance")).toHaveValue("3000");

      // Operation 1
      const op1 = page.getByTestId("build-transaction-operation-1");

      await expect(op1.getByLabel("Operation Type")).toHaveValue("payment");
      await expect(op1.getByLabel("Destination")).toHaveValue(
        "GAJAIHPKNTJ362TAUWTU2S56B7PULRTMY456LUELK53USX43537IFMS3",
      );
      await expect(
        op1.locator("#credit_alphanum4-1-payment-asset"),
      ).toBeChecked();
      await expect(op1.getByLabel("Asset Code")).toHaveValue("USDC");
      await expect(op1.getByLabel("Issuer Account ID")).toHaveValue(
        "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5",
      );
      await expect(op1.getByLabel("Amount")).toHaveValue("4000");
      await expect(op1.getByLabel("Source Account")).toHaveValue(
        "GA46LGGOLXJY5OSX6N4LHV4MWDFXNGLK76I4NDNKKYAXRRSKI5AJGMXG",
      );

      // Validation
      const txnSuccess = page.getByTestId("build-transaction-envelope-xdr");

      await expect(
        txnSuccess.getByText("Network Passphrase").locator("+ div"),
      ).toHaveText("Test SDF Network ; September 2015");
      await expect(txnSuccess.getByText("Hash").locator("+ div")).toHaveText(
        "44abaabac11c318d595d392c24166965301b48109899bc8e819723afb89d5e37",
      );
      await expect(txnSuccess.getByText("XDR").locator("+ div")).toHaveText(
        "AAAAAgAAAAA55ZjOXdOOulfzeLPXjLDLdplq/5HGjapWAXjGSkdAkwAAD6AADQioAAAAAQAAAAEAAAAAAAAAAAAAAABnUbvoAAAAAQAAAAMxMjMAAAAAAgAAAAAAAAAAAAAAALs4fndRzE6mDMvxXqgyh79/PxCtOwb9MTWEeINa/Qr8AAAABvwjrAAAAAABAAAAADnlmM5d0466V/N4s9eMsMt2mWr/kcaNqlYBeMZKR0CTAAAAAQAAAAASBB3qbNO/amClp01Lvg/fRcZsxzvl0ItXd0lfm+7+ggAAAAFVU0RDAAAAAEI+fQXy7K+/7BkrIVo/G+lq7bjY5wJUq+NBPgIH3layAAAACVAvkAAAAAAAAAAAAA==",
      );
    });

    test("[Classic] Sign Transaction", async ({ page }) => {
      await page.goto(
        "http://localhost:3000/transaction/sign?$=network$id=testnet&label=Testnet&horizonUrl=https:////horizon-testnet.stellar.org&rpcUrl=https:////soroban-testnet.stellar.org&passphrase=Test%20SDF%20Network%20/;%20September%202015;&transaction$sign$activeView=overview&importXdr=AAAAAgAAAAA55ZjOXdOOulfzeLPXjLDLdplq//5HGjapWAXjGSkdAkwAAD6AADQioAAAAAQAAAAEAAAAAAAAAAAAAAABnUbvoAAAAAQAAAAMxMjMAAAAAAgAAAAAAAAAAAAAAALs4fndRzE6mDMvxXqgyh79//PxCtOwb9MTWEeINa//Qr8AAAABvwjrAAAAAABAAAAADnlmM5d0466V//N4s9eMsMt2mWr//kcaNqlYBeMZKR0CTAAAAAQAAAAASBB3qbNO//amClp01Lvg//fRcZsxzvl0ItXd0lfm+7+ggAAAAFVU0RDAAAAAEI+fQXy7K+//7BkrIVo//G+lq7bjY5wJUq+NBPgIH3layAAAACVAvkAAAAAAAAAAAAA==;;",
      );

      await expect(page.locator("h1")).toHaveText("Transaction Overview");

      await expect(page.getByLabel("Signing for")).toHaveValue(
        "Test SDF Network ; September 2015",
      );
      await expect(page.getByLabel("Transaction Envelope XDR")).toHaveValue(
        "AAAAAgAAAAA55ZjOXdOOulfzeLPXjLDLdplq/5HGjapWAXjGSkdAkwAAD6AADQioAAAAAQAAAAEAAAAAAAAAAAAAAABnUbvoAAAAAQAAAAMxMjMAAAAAAgAAAAAAAAAAAAAAALs4fndRzE6mDMvxXqgyh79/PxCtOwb9MTWEeINa/Qr8AAAABvwjrAAAAAABAAAAADnlmM5d0466V/N4s9eMsMt2mWr/kcaNqlYBeMZKR0CTAAAAAQAAAAASBB3qbNO/amClp01Lvg/fRcZsxzvl0ItXd0lfm+7+ggAAAAFVU0RDAAAAAEI+fQXy7K+/7BkrIVo/G+lq7bjY5wJUq+NBPgIH3layAAAACVAvkAAAAAAAAAAAAA==",
      );
      await expect(page.getByLabel("Transaction Hash")).toHaveValue(
        "44abaabac11c318d595d392c24166965301b48109899bc8e819723afb89d5e37",
      );
    });

    test("Simulate Transaction", async ({ page }) => {
      await page.goto(
        "http://localhost:3000/transaction/simulate?$=network$id=testnet&label=Testnet&horizonUrl=https:////horizon-testnet.stellar.org&rpcUrl=https:////soroban-testnet.stellar.org&passphrase=Test%20SDF%20Network%20/;%20September%202015;&xdr$blob=AAAAAgAAAAA55ZjOXdOOulfzeLPXjLDLdplq//5HGjapWAXjGSkdAkwAAD6AADQioAAAAAQAAAAEAAAAAAAAAAAAAAABnUbvoAAAAAQAAAAMxMjMAAAAAAgAAAAAAAAAAAAAAALs4fndRzE6mDMvxXqgyh79//PxCtOwb9MTWEeINa//Qr8AAAABvwjrAAAAAABAAAAADnlmM5d0466V//N4s9eMsMt2mWr//kcaNqlYBeMZKR0CTAAAAAQAAAAASBB3qbNO//amClp01Lvg//fRcZsxzvl0ItXd0lfm+7+ggAAAAFVU0RDAAAAAEI+fQXy7K+//7BkrIVo//G+lq7bjY5wJUq+NBPgIH3layAAAACVAvkAAAAAAAAAAAAA==;;",
      );

      await expect(page.locator("h1")).toHaveText("Simulate Transaction");

      await expect(
        page.getByLabel("Input a base-64 encoded TransactionEnvelope"),
      ).toHaveValue(
        "AAAAAgAAAAA55ZjOXdOOulfzeLPXjLDLdplq/5HGjapWAXjGSkdAkwAAD6AADQioAAAAAQAAAAEAAAAAAAAAAAAAAABnUbvoAAAAAQAAAAMxMjMAAAAAAgAAAAAAAAAAAAAAALs4fndRzE6mDMvxXqgyh79/PxCtOwb9MTWEeINa/Qr8AAAABvwjrAAAAAABAAAAADnlmM5d0466V/N4s9eMsMt2mWr/kcaNqlYBeMZKR0CTAAAAAQAAAAASBB3qbNO/amClp01Lvg/fRcZsxzvl0ItXd0lfm+7+ggAAAAFVU0RDAAAAAEI+fQXy7K+/7BkrIVo/G+lq7bjY5wJUq+NBPgIH3layAAAACVAvkAAAAAAAAAAAAA==",
      );
    });

    test("[Classic] Submit Transaction", async ({ page }) => {
      await page.goto(
        "http://localhost:3000/transaction/submit?$=network$id=testnet&label=Testnet&horizonUrl=https:////horizon-testnet.stellar.org&rpcUrl=https:////soroban-testnet.stellar.org&passphrase=Test%20SDF%20Network%20/;%20September%202015;&xdr$blob=AAAAAgAAAAA55ZjOXdOOulfzeLPXjLDLdplq//5HGjapWAXjGSkdAkwAAD6AADQioAAAAAQAAAAEAAAAAAAAAAAAAAABnUbvoAAAAAQAAAAMxMjMAAAAAAgAAAAAAAAAAAAAAALs4fndRzE6mDMvxXqgyh79//PxCtOwb9MTWEeINa//Qr8AAAABvwjrAAAAAABAAAAADnlmM5d0466V//N4s9eMsMt2mWr//kcaNqlYBeMZKR0CTAAAAAQAAAAASBB3qbNO//amClp01Lvg//fRcZsxzvl0ItXd0lfm+7+ggAAAAFVU0RDAAAAAEI+fQXy7K+//7BkrIVo//G+lq7bjY5wJUq+NBPgIH3layAAAACVAvkAAAAAAAAAAAAA==;;",
      );

      await expect(page.locator("h1")).toHaveText("Submit Transaction");

      await expect(
        page.getByLabel("Input a base-64 encoded TransactionEnvelope"),
      ).toHaveValue(
        "AAAAAgAAAAA55ZjOXdOOulfzeLPXjLDLdplq/5HGjapWAXjGSkdAkwAAD6AADQioAAAAAQAAAAEAAAAAAAAAAAAAAABnUbvoAAAAAQAAAAMxMjMAAAAAAgAAAAAAAAAAAAAAALs4fndRzE6mDMvxXqgyh79/PxCtOwb9MTWEeINa/Qr8AAAABvwjrAAAAAABAAAAADnlmM5d0466V/N4s9eMsMt2mWr/kcaNqlYBeMZKR0CTAAAAAQAAAAASBB3qbNO/amClp01Lvg/fRcZsxzvl0ItXd0lfm+7+ggAAAAFVU0RDAAAAAEI+fQXy7K+/7BkrIVo/G+lq7bjY5wJUq+NBPgIH3layAAAACVAvkAAAAAAAAAAAAA==",
      );
      await expect(page.getByLabel("Transaction hash")).toHaveValue(
        "44abaabac11c318d595d392c24166965301b48109899bc8e819723afb89d5e37",
      );
    });

    test("[Soroban] Build Transaction", async ({ page }) => {
      await page.goto(
        "http://localhost:3000/transaction/build?$=network$id=testnet&label=Testnet&horizonUrl=https:////horizon-testnet.stellar.org&rpcUrl=https:////soroban-testnet.stellar.org&passphrase=Test%20SDF%20Network%20/;%20September%202015;&transaction$build$classic$operations@$operation_type=payment&params$destination=GA46LGGOLXJY5OSX6N4LHV4MWDFXNGLK76I4NDNKKYAXRRSKI5AJGMXG&asset$code=&issuer=&type=native;&amount=5;&source_account=;;;&soroban$operation$operation_type=extend_footprint_ttl&params$durability=persistent&contract=CAQP53Z2GMZ6WVOKJWXMCVDLZYJ7GYVMWPAMWACPLEZRF2UEZW3B636S&key_xdr=AAAAEAAAAAEAAAACAAAADwAAAAdDb3VudGVyAAAAABIAAAAAAAAAAH5MvQcuICNqcxGfJ6rKFvwi77h3WDZ2XVzA+LVRkCKD&extend_ttl_to=20000&resource_fee=46753;;;&params$source_account=GB7EZPIHFYQCG2TTCGPSPKWKC36CF35YO5MDM5S5LTAPRNKRSARIHWGG&seq_num=1727208213184538&cond$time$min_time=1733409768;;&memo$text=100;;&isValid$params:true&operations:true;;",
      );

      await expect(page.locator("h1")).toHaveText("Build Transaction");

      // Params
      await expect(
        page.getByLabel("Source Account", { exact: true }),
      ).toHaveValue("GB7EZPIHFYQCG2TTCGPSPKWKC36CF35YO5MDM5S5LTAPRNKRSARIHWGG");
      await expect(page.getByLabel("Transaction Sequence Number")).toHaveValue(
        "1727208213184538",
      );
      await expect(page.getByLabel("Base Fee")).toHaveValue("100");

      await expect(page.locator("#text-memo")).toBeChecked();
      await expect(page.locator("#memo_value")).toHaveValue("100");

      await expect(
        page.getByPlaceholder(
          "Lower time bound unix timestamp. Ex: 1479151713",
        ),
      ).toHaveValue("1733409768");
      await expect(
        page.getByPlaceholder(
          "Upper time bound unix timestamp. Ex: 1479151713",
        ),
      ).toHaveValue("");

      // Only One Operation Allowed in Soroban
      const sorobanOp = page.getByTestId("build-soroban-transaction-operation");

      await expect(sorobanOp.getByLabel("Operation Type")).toHaveValue(
        "extend_footprint_ttl",
      );
      await expect(sorobanOp.getByLabel("Contract ID")).toHaveValue(
        "CAQP53Z2GMZ6WVOKJWXMCVDLZYJ7GYVMWPAMWACPLEZRF2UEZW3B636S",
      );
      await expect(sorobanOp.getByLabel("Extend To")).toHaveValue("20000");
      await expect(sorobanOp.getByLabel("Durability")).toHaveValue(
        "persistent",
      );
      await expect(sorobanOp.getByLabel("Resource Fee")).toHaveValue("46753");
    });

    test("Fee Bump", async ({ page }) => {
      await page.goto(
        "http://localhost:3000/transaction/fee-bump?$=network$id=testnet&label=Testnet&horizonUrl=https:////horizon-testnet.stellar.org&rpcUrl=https:////soroban-testnet.stellar.org&passphrase=Test%20SDF%20Network%20/;%20September%202015;&transaction$feeBump$source_account=GA46LGGOLXJY5OSX6N4LHV4MWDFXNGLK76I4NDNKKYAXRRSKI5AJGMXG&fee=2000&xdr=AAAAAgAAAAA55ZjOXdOOulfzeLPXjLDLdplq//5HGjapWAXjGSkdAkwAAD6AADQioAAAAAQAAAAEAAAAAAAAAAAAAAABnUbvoAAAAAQAAAAMxMjMAAAAAAgAAAAAAAAAAAAAAALs4fndRzE6mDMvxXqgyh79//PxCtOwb9MTWEeINa//Qr8AAAABvwjrAAAAAABAAAAADnlmM5d0466V//N4s9eMsMt2mWr//kcaNqlYBeMZKR0CTAAAAAQAAAAASBB3qbNO//amClp01Lvg//fRcZsxzvl0ItXd0lfm+7+ggAAAAFVU0RDAAAAAEI+fQXy7K+//7BkrIVo//G+lq7bjY5wJUq+NBPgIH3layAAAACVAvkAAAAAAAAAAAAA==;;",
      );

      await expect(page.locator("h1")).toHaveText("Fee Bump");

      await expect(page.getByLabel("Source Account")).toHaveValue(
        "GA46LGGOLXJY5OSX6N4LHV4MWDFXNGLK76I4NDNKKYAXRRSKI5AJGMXG",
      );
      await expect(page.getByLabel("Base Fee")).toHaveValue("2000");
      await expect(
        page.getByLabel("Input a base-64 encoded TransactionEnvelope"),
      ).toHaveValue(
        "AAAAAgAAAAA55ZjOXdOOulfzeLPXjLDLdplq/5HGjapWAXjGSkdAkwAAD6AADQioAAAAAQAAAAEAAAAAAAAAAAAAAABnUbvoAAAAAQAAAAMxMjMAAAAAAgAAAAAAAAAAAAAAALs4fndRzE6mDMvxXqgyh79/PxCtOwb9MTWEeINa/Qr8AAAABvwjrAAAAAABAAAAADnlmM5d0466V/N4s9eMsMt2mWr/kcaNqlYBeMZKR0CTAAAAAQAAAAASBB3qbNO/amClp01Lvg/fRcZsxzvl0ItXd0lfm+7+ggAAAAFVU0RDAAAAAEI+fQXy7K+/7BkrIVo/G+lq7bjY5wJUq+NBPgIH3layAAAACVAvkAAAAAAAAAAAAA==",
      );
    });
  });

  test.describe("API Explorer", () => {
    test("RPC Methods: getTransactions", async ({ page }) => {
      await page.goto(
        "http://localhost:3000/endpoints/rpc/get-transactions?$=network$id=testnet&label=Testnet&horizonUrl=https:////horizon-testnet.stellar.org&rpcUrl=https:////soroban-testnet.stellar.org&passphrase=Test%20SDF%20Network%20/;%20September%202015;&endpoints$params$startLedger=1316619&cursor=123123&limit=5&xdrFormat=json;;",
      );

      await expect(page.locator("h1")).toHaveText("getTransactions");

      await expect(page.getByLabel("Start Ledger Sequence")).toHaveValue(
        "1316619",
      );
      await expect(page.getByLabel("Cursor")).toHaveValue("123123");
      await expect(page.getByLabel("Limit")).toHaveValue("5");

      const xdrFormatInput = page.locator("#json-xdrFormat-type");
      await expect(xdrFormatInput).toBeChecked();
    });

    test("Horizon Endpoints: Payments for Account", async ({ page }) => {
      await page.goto(
        "http://localhost:3000/endpoints/horizon/payments/account?$=network$id=testnet&label=Testnet&horizonUrl=https:////horizon-testnet.stellar.org&rpcUrl=https:////soroban-testnet.stellar.org&passphrase=Test%20SDF%20Network%20/;%20September%202015;&endpoints$params$account_id=GA46LGGOLXJY5OSX6N4LHV4MWDFXNGLK76I4NDNKKYAXRRSKI5AJGMXG&cursor=123123&limit=5&order=desc&include_failed=true;;",
      );

      await expect(page.locator("h1")).toHaveText("Payments for Account");

      await expect(page.getByTestId("endpoints-url")).toHaveValue(
        "https://horizon-testnet.stellar.org/accounts/GA46LGGOLXJY5OSX6N4LHV4MWDFXNGLK76I4NDNKKYAXRRSKI5AJGMXG/payments?cursor=123123&limit=5&order=desc&include_failed=true",
      );
      await expect(page.getByLabel("Account ID")).toHaveValue(
        "GA46LGGOLXJY5OSX6N4LHV4MWDFXNGLK76I4NDNKKYAXRRSKI5AJGMXG",
      );
      await expect(page.getByLabel("Cursor")).toHaveValue("123123");
      await expect(page.getByLabel("Limit")).toHaveValue("5");
      await expect(page.locator("#desc-order")).toBeChecked();
      await expect(page.locator("#true-include_failed")).toBeChecked();
    });
  });
});
