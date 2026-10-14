# Plan: Homepage redesign

Roadmap: **Track 1** (`specs/roadmap.md`). Groups 1–6 match roadmap phases
1.1–1.6. Group 7 is merge prep. All groups ship as **one PR** (see
`requirements.md`, Decision 1).

Status as of 2026-10-13: groups 1–5 are done. Group 6 and group 7 have open
tasks.

## 1. New homepage layout (roadmap 1.1)

- [x] 1.1 Rewrite `src/app/page.tsx`: hero (H1, subtitle, Ask field), then
      sections with page-level spacing (96px hero → content, 40px between
      sections).
- [x] 1.2 Add `SectionHeader` (title + optional description, no eyebrow).
- [x] 1.3 Add `CardGrid` / `CardGrid.Cell` with hairline dividers,
      `bordered` / `open` variants, and 4 → 2 → 1 or 3 → 2 → 1 collapse.
- [x] 1.4 Add `StartBuilding` (Fund account, Build a transaction, Deploy a
      smart contract, Sign message).
- [x] 1.5 Add `ExploreInspect` (Transactions, Smart contracts, API explorer,
      XDR tools) on the `open` grid.
- [x] 1.6 Delete `Slider`, `Tutorials`, `Networks`, `Resources`.
- [x] 1.7 Rewrite `src/styles/home.scss` for the new sections. Keep the
      `HomeSection` styles (still used by `EndpointsLandingPage`).
- [x] 1.8 Update `tests/e2e/introductionPage.test.ts`: H1, section
      headers, card counts and titles for each section.

## 2. Network picker (roadmap 1.2)

- [x] 2.1 Add `NetworkPicker`: Testnet, Mainnet, Local network cards using
      `NetworkIndicator`.
- [x] 2.2 Active card shows "You’re on {Network}". Other cards show
      **Switch**, which opens a confirm modal.
- [x] 2.3 Confirm calls `useSwitchNetwork().getAndSetNetwork()`, then shows
      the success notification with a next-step action.
- [x] 2.4 Local network card links to Quickstart and Stellar CLI (external).
- [x] 2.5 E2E: switch Testnet → Mainnet in an isolated context; status and
      Switch buttons swap.

## 3. Learn by building (roadmap 1.3)

- [x] 3.1 Add `LearnByBuilding`: 3 cards (Create an account, Payments, Hello
      world) with thumbnails and a play overlay.
- [x] 3.2 Add thumbnails `lab-home-tutorial-{create-account,payments,hello-world}.png`.
- [x] 3.3 Cards open YouTube videos. **View all tutorials** opens the
      playlist. (Decision 2: in-app flows deferred to Track 4.)
- [x] 3.4 E2E: 3 cards with the expected titles.
- [ ] 3.5 Update roadmap 1.3 done-criterion to match Decision 2.

## 4. Ask input / NeevAI (roadmap 1.4)

- [x] 4.1 Add `NEEVAI_*` constants to `src/constants/settings.ts`.
- [x] 4.2 Add `NeevaiChatScript` (`next/script`, `afterInteractive`) to the
      root layout.
- [x] 4.3 Add `src/helpers/askNeevai.ts`: `askNeevai()` (widget first,
      full-page fallback) and `getNeevaiFullPageUrl()`.
- [x] 4.4 Add `AskInput`: full-width chat field (rounded card) with the
      textarea and the **Ask** button inside it, bottom right. Enter submits,
      Shift+Enter adds a new line, **Ask** disabled while empty, clears after
      submit. Suggested-question chips (bottom left in Figma) are skipped
      until the questions are known.
- [x] 4.5 CSP: add `https://prism-chat.neevai.io/` to `frame-src`.
- [x] 4.6 Middleware: redirect to strip `utm_*` when `utm_source=neevai`.
- [x] 4.7 Unit test `tests/unit/getNeevaiFullPageUrl.test.ts` (encoding,
      autosend, length cap).
- [ ] 4.8 Decide how to contain the third-party script (requirements →
      "Security: third-party script"). Preferred: isolate
      the chat (cross-origin iframe with our own launcher, or open the
      full-page chat in a new tab). Fallback: skip the script on signing
      routes plus a hard reload when navigating into them (route exclusion
      alone does not work in an SPA).
- [ ] 4.9 Ask NeevAI to allow `localhost:<PORT>`, staging, and a wildcard for
      PR previews; confirm the full-page fallback works on a preview URL.
- [ ] 4.10 Ask NeevAI about script versioning/SRI, who controls the CDN, and
      whether the allowlist is enforced server-side.

## 5. Save & Share refresh (roadmap 1.5)

- [x] 5.1 Rewrite `SaveAndShare`: `SectionHeader`, **View saved** (→
      `/saved`), new image `lab-home-save-share-v2.png` via `next/image`.
- [x] 5.2 Remove the light/dark and mobile image switching.

## 6. Homepage tracking events (roadmap 1.6)

- [x] 6.1 Add `HOME_START_BUILDING` and `HOME_EXPLORE` events.
- [x] 6.2 Fire events from Start building, Explore & inspect,
      Network buttons, tutorial cards, and View all tutorials.
- [ ] 6.3 Add a dedicated event for **View saved** (for example
      `HOME_SAVE_SHARE = "home: save and share"`). Stop reusing
      `HOME_TOP_BTN`.
- [ ] 6.4 Fire an event when the Ask input submits (for example
      `HOME_ASK = "home: ask"`, with `{ via: "widget" | "fullpage" }`).
      Do not send the question text.
- [ ] 6.5 Remove unused enums: `HOME_SLIDER_CARD`,
      `HOME_SLIDER_DETAILS_BTN`, `HOME_RESOURCES_BTN`.

## 7. Cleanup and merge prep

- [ ] 7.1 Delete unused images in `public/images/`: `lab-home-intro-*`,
      `lab-home-main-*`, `lab-home-net-*`, `lab-home-save-share-{light,dark}.png`,
      `lab-home-save-share-mobile-*` (20 files). Re-check with `grep` first.
- [ ] 7.2 Revert `src/constants/networkLimits.ts` (auto-fetched by `predev`,
      not part of this change).
- [ ] 7.3 Do not commit `.tool-versions` (local tooling file).
- [ ] 7.4 Run the checks in `validation.md`.
- [ ] 7.5 Open the PR. After merge, mark roadmap 1.1–1.6 `[x]`.
