import { test, expect } from "@playwright/test";

test.describe("Diff XDRs Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/xdr/diff");
  });

  test("Loads", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText("Diff XDRs");
  });

  test("Default TransactionEnvelope type works", async ({ page }) => {
    const xdrInputOne = page.getByLabel("XDR One", { exact: true });
    const xdrInputTwo = page.getByLabel("XDR Two", { exact: true });
    const diffEditor = page.getByTestId("diff-xdr-editor");

    // Default input state
    await expect(xdrInputOne).toBeEnabled();
    await expect(xdrInputTwo).toBeDisabled();
    await expect(diffEditor).toBeHidden();

    // Fill inputs
    await xdrInputOne.fill(XDR_TX_1);
    await expect(xdrInputTwo).toBeEnabled();
    await xdrInputTwo.fill(XDR_TX_2);
    await expect(diffEditor).toBeVisible();
  });

  test("Non-default type works", async ({ page }) => {
    const xdrInputOne = page.getByLabel("XDR One", { exact: true });
    const xdrInputTwo = page.getByLabel("XDR Two", { exact: true });
    const diffEditor = page.getByTestId("diff-xdr-editor");
    const errorMessageOne = page.getByText(
      "XDR One error: Unable to decode input as TransactionEnvelope: xdr value invalid. Make sure the XDR value and type are valid.",
    );
    const errorMessageTwo = page.getByText(
      "XDR Two error: Unable to decode input as ScVal: length limit exceeded. Make sure the XDR value and type are valid.",
    );

    const xdrTypeInput = page.getByLabel("XDR type", { exact: true });
    const xdrTypeOptions = page.getByTestId("xdr-type-select-options");

    // Default input state
    await expect(xdrInputOne).toBeEnabled();
    await expect(xdrInputTwo).toBeDisabled();
    await expect(diffEditor).toBeHidden();
    await expect(xdrTypeInput).toHaveValue("TransactionEnvelope");

    // Fill the first XDR input
    await xdrInputOne.fill(XDR_SCVAL_1);
    await expect(errorMessageOne).toBeVisible();
    await expect(xdrInputTwo).toBeDisabled();

    // Select suggested type
    await xdrTypeInput.focus();
    await expect(xdrTypeOptions).toBeVisible();
    await page.getByText("ScValPossible Type").first().click();

    // The initial error message should be hidden, and the second XDR input should be enabled
    await expect(errorMessageOne).toBeHidden();
    await expect(xdrInputTwo).toBeEnabled();

    // Invalid second XDR input
    await xdrInputTwo.fill("aaaa");
    await expect(errorMessageTwo).toBeVisible();

    // Valid second XDR input
    await xdrInputTwo.fill(XDR_SCVAL_2);
    await expect(errorMessageTwo).toBeHidden();
    await expect(diffEditor).toBeVisible();
  });
});

// =============================================================================
// Mock data
// =============================================================================
const XDR_TX_1 =
  "AAAABQAAAABNaBZJk5idBm4/YrzSeX17zmI6GXojYX+w86x50onj6QAAAAAABSIYAAAAAgAAAABc/m/I6JgZ8x+u/QA62BED9k3D2g2s4bgvVeojjIf1jwAFIU8DWL6dAADlwwAAAAEAAAAAAAAAAAAAAABoN2P7AAAAAAAAAAEAAAAAAAAAGAAAAAAAAAAB1/5EvQrxHWArEJHy9KH03yEtRE0DIeoyrbPMHLurCgQAAAAFcGxhbnQAAAAAAAACAAAAEgAAAAE5IMx/xda3bSKXUyqFH/ELrdJf8mVZZpTQRpnQccZkpgAAAAoAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAEAAAABOSDMf8XWt20il1MqhR/xC63SX/JlWWaU0EaZ0HHGZKY8Tc+Zei4bfANqHxsAAAAQAAAAAQAAAAEAAAARAAAAAQAAAAEAAAAQAAAAAQAAAAIAAAAPAAAAB0VkMjU1MTkAAAAADQAAACCnlIgihBZ9AFbc83tqqjXRA4HNTydxZTnfOnH9+UixBAAAABAAAAABAAAAAgAAAA8AAAAHRWQyNTUxOQAAAAANAAAAQFdKsBA8ieh+GoKsLdWfeTgokCV+Vebsyw9chBncDGE8Kcv9Angbaj89+N4xIGY41I26qHhU4EC+Gq4EKcP6ng4AAAAAAAAAAdf+RL0K8R1gKxCR8vSh9N8hLURNAyHqMq2zzBy7qwoEAAAABXBsYW50AAAAAAAAAgAAABIAAAABOSDMf8XWt20il1MqhR/xC63SX/JlWWaU0EaZ0HHGZKYAAAAKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAQAAAAGAAAAATkgzH/F1rdtIpdTKoUf8Qut0l/yZVlmlNBGmdBxxmSmAAAAEAAAAAEAAAACAAAADwAAAAdFZDI1NTE5AAAAAA0AAAAgp5SIIoQWfQBW3PN7aqo10QOBzU8ncWU53zpx/flIsQQAAAAAAAAABgAAAAE5IMx/xda3bSKXUyqFH/ELrdJf8mVZZpTQRpnQccZkpgAAABQAAAABAAAAB9ssFCkNSWTjgF8lJ90TKTm6X7P8ysVrML+rj9CRARYnAAAAB+zZkPC0XKaBcUm2F195sy77RC81cxmFoIQTHoJlxM2QAAAABAAAAAYAAAABOSDMf8XWt20il1MqhR/xC63SX/JlWWaU0EaZ0HHGZKYAAAAVPE3PmXouG3wAAAAAAAAABgAAAAHX/kS9CvEdYCsQkfL0ofTfIS1ETQMh6jKts8wcu6sKBAAAABAAAAABAAAAAgAAAA8AAAAFQmxvY2sAAAAAAAADAADRNgAAAAAAAAAGAAAAAdf+RL0K8R1gKxCR8vSh9N8hLURNAyHqMq2zzBy7qwoEAAAAEAAAAAEAAAADAAAADwAAAARQYWlsAAAAEgAAAAE5IMx/xda3bSKXUyqFH/ELrdJf8mVZZpTQRpnQccZkpgAAAAMAANE2AAAAAAAAAAYAAAAB1/5EvQrxHWArEJHy9KH03yEtRE0DIeoyrbPMHLurCgQAAAAUAAAAAQCPsUAAAK4oAAAGBAAAAAAABSFPAAAAAYyH9Y8AAABAbcq5InHKEL6FneNTwN4ofINVfMibIAcAmwM6tg7yreKLkVE0u5ZZUa2oic0Dj1Z5BEu4DQ2tWAa8Rvf0u1yjBAAAAAAAAAAB0onj6QAAAEA4Ed4utOaBYXb0S2waKf+8V/2b77y7hvNXUjIXxP2HF3EJxkG6Aq25sNplVNDp1f0jmhBsls/XArFZvXUDusQM";
const XDR_TX_2 =
  "AAAAAgAAAABYoQOvSI5exayEafOOkq4hwuhqQilBrZcdxJ/sP5Z5kQADDjMAEnY+AAAAAgAAAAAAAAAAAAAAAQAAAAAAAAAYAAAAAAAAAAHf65G24dyt1q+Xu3xFX5fzdHcKf3j2lXO5n11b+EnOfAAAAAdkZXBvc2l0AAAAAAIAAAAFAAAAAAAGYB8AAAAKAAAAAAAAAAAAAAAAAAABKQAAAAEAAAAAAAAAAAAAAAHf65G24dyt1q+Xu3xFX5fzdHcKf3j2lXO5n11b+EnOfAAAAAdkZXBvc2l0AAAAAAIAAAAFAAAAAAAGYB8AAAAKAAAAAAAAAAAAAAAAAAABKQAAAAEAAAAAAAAAAbrCs4s4F0bFFiiUEa6VhwFhv8ro0OiwU/6TA5YxIgHoAAAACHRyYW5zZmVyAAAAAwAAABIAAAAAAAAAAFihA69Ijl7FrIRp846SriHC6GpCKUGtlx3En+w/lnmRAAAAEgAAAAHf65G24dyt1q+Xu3xFX5fzdHcKf3j2lXO5n11b+EnOfAAAAAoAAAAAAAAAAAAAAAAAAAEpAAAAAAAAAAEAAAAAAAAAAwAAAAYAAAABusKzizgXRsUWKJQRrpWHAWG/yujQ6LBT/pMDljEiAegAAAAUAAAAAQAAAAYAAAAB3+uRtuHcrdavl7t8RV+X83R3Cn949pVzuZ9dW/hJznwAAAAUAAAAAQAAAAcPdllDl2zzgp+Ujx7ICDqvCtVMqTKSXtfBIebOnh/CngAAAAMAAAABAAAAAFihA69Ijl7FrIRp846SriHC6GpCKUGtlx3En+w/lnmRAAAAAUVUQgAAAAAAdjUaPTIi7PpaJD05BYii5sBNxV5VeYhqKKZpzRluGMgAAAAGAAAAAbrCs4s4F0bFFiiUEa6VhwFhv8ro0OiwU/6TA5YxIgHoAAAAEAAAAAEAAAACAAAADwAAAAdCYWxhbmNlAAAAABIAAAAB3+uRtuHcrdavl7t8RV+X83R3Cn949pVzuZ9dW/hJznwAAAABAAAABgAAAAHf65G24dyt1q+Xu3xFX5fzdHcKf3j2lXO5n11b+EnOfAAAABAAAAABAAAAAgAAAA8AAAAFU3RhdGUAAAAAAAAFAAAAAAAGYB8AAAABADo3IAAARZgAAAMMAAAAAAADDc8AAAABP5Z5kQAAAEBmSoGHrsV7nz09KBZOzilxSPw8h5thNVolgiE6gLYjB+Ogzn1ugX0+7/JGEYF6Q11eac6JZEXrqyEVhYHeXacO";

const XDR_SCVAL_1 =
  "AAAAEQAAAAEAAAADAAAADwAAAApjb2xsYXRlcmFsAAAAAAARAAAAAQAAAAIAAAADAAAAAQAAAAoAAAAAAAAAAAAAABWfIWAVAAAAAwAAAAMAAAAKAAAAAAAAAAAAAAAyLhomSAAAAA8AAAALbGlhYmlsaXRpZXMAAAAAEQAAAAEAAAABAAAAAwAAAAMAAAAKAAAAAAAAAAAAAAAa5FRJJAAAAA8AAAAGc3VwcGx5AAAAAAARAAAAAQAAAAA=";
const XDR_SCVAL_2 =
  "AAAAEQAAAAEAAAADAAAADwAAAApjb2xsYXRlcmFsAAAAAAARAAAAAQAAAAAAAAAPAAAAC2xpYWJpbGl0aWVzAAAAABEAAAABAAAAAAAAAA8AAAAGc3VwcGx5AAAAAAARAAAAAQAAAAA=";
