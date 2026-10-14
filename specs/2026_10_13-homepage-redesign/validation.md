# Validation: Homepage redesign

The PR can merge when **all automated checks pass** and **every manual check
below is ticked** on the PR preview (or `pnpm dev`).

## 1. Automated checks

Run locally and confirm CI is green:

```bash
pnpm lint
pnpm lint:ts
pnpm test:unit
pnpm test:e2e tests/e2e/introductionPage.test.ts
```

- [ ] `pnpm lint`: no errors.
- [ ] `pnpm lint:ts`: no errors.
- [ ] `pnpm test:unit`: passes, including
      `tests/unit/getNeevaiFullPageUrl.test.ts`.
- [ ] `introductionPage.test.ts` passes: Loads, Section headers, Start
      building, Explore & inspect, Learn by building, Networks.
- [ ] Full `pnpm test:e2e` passes (no other page broke).

If e2e fails after a branch switch, restart the dev server and clear `.next`
(see `CLAUDE.md`, "E2E Tests Fail After Switching Branches").

## 2. Diff hygiene

- [ ] `git diff main --stat` does **not** include
      `src/constants/networkLimits.ts` or `.tool-versions`.
- [ ] No references to deleted components:
      `grep -rn "Home/Slider\|Home/Tutorials\|Home/Networks\|Home/Resources" src tests`
      returns nothing.
- [ ] No unused homepage images:
      `for i in public/images/lab-home-*; do n=$(basename "${i%.*}"); grep -rq "$n" src || echo "$i"; done`
      prints nothing.
- [ ] No unused tracking enums: `HOME_SLIDER_CARD`,
      `HOME_SLIDER_DETAILS_BTN`, `HOME_RESOURCES_BTN` are gone.
- [ ] `HomeSection` still exists and the Endpoints landing page (`/endpoints`)
      looks unchanged.

## 3. Manual checks

### Layout and theme

- [ ] All sections render in order: Hero, Start building, Explore & inspect,
      Network, Learn by building, Save and share, footer.
- [ ] Light and dark theme: text, dividers, and images are readable in both.
- [ ] Widths 1440, 1024, 768, 375: grids collapse 4 → 2 → 1 (and 3 → 2 → 1),
      dividers stay 1px, no horizontal scroll.
- [ ] Keyboard: Tab reaches every card, button, and the Ask input. Focus is
      visible.

### Links

- [ ] Start building cards open: `/account/fund`, Build transaction, Deploy
      contract, `/sign-message`.
- [ ] Explore & inspect cards open: Transactions, Smart contracts, Endpoints,
      XDR.
- [ ] Each tutorial card opens its YouTube video. **View all tutorials** opens
      the playlist.
- [ ] **View saved** → `/saved`.
- [ ] The hero has no **Get started** or **Read docs** buttons.

### Network picker (roadmap 1.2)

- [ ] Default shows "You’re on Testnet".
- [ ] **Switch** on Mainnet → modal → confirm → status moves to Mainnet and a
      success notification appears.
- [ ] Go to another page (for example Build transaction): the network
      selector shows Mainnet. Reload: still Mainnet.
- [ ] Cancel in the modal changes nothing.
- [ ] Local network: Quickstart and Stellar CLI open GitHub in a new tab.

### Ask input / NeevAI (roadmap 1.4)

- [ ] **Ask** is disabled while the input is empty or only spaces.
- [ ] Enter submits. Shift+Enter adds a new line. The input clears after
      submit.
- [ ] With the widget loaded: the chat opens and sends the question.
- [ ] With the widget blocked (DevTools → block `cdn.neevai.io`): submit opens
      the full-page chat in a new tab with the question filled in and sent.
- [ ] The chat bubble shows on a non-home page (for example `/xdr/view`).
- [ ] Browser console has **no CSP violations** on the homepage and while the
      chat is open.
- [ ] Open `/?utm_source=neevai&utm_medium=chat&network=testnet`: redirects to
      `/?network=testnet` (all `utm_*` removed, other params kept).
- [ ] Open `/?utm_source=newsletter`: no redirect; the param stays.
- [ ] Security: on the signing routes (`/transaction/build`, `/sign-message`,
      `/account/create`), DevTools → Network shows **no** request to
      `cdn.neevai.io` (applies once plan 4.8 is done).
- [ ] The chat loads on a PR preview URL and on `localhost` (allowed domains
      are set). On a non-allowed origin the panel is blank, with no console
      errors beyond the blocked embed.
- [ ] The full-page fallback opens and works from a preview URL.

### Tracking (roadmap 1.6)

With Amplitude debug or the network tab, each action fires one event with the
expected properties:

| Action                       | Event                         | Properties                                 |
| ---------------------------- | ----------------------------- | ------------------------------------------ |
| Ask submit                   | `home: ask` (new)             | `via`; **no question text**                |
| Start building card          | `home: start building`        | `card: <id>`                               |
| Explore & inspect card       | `home: explore & inspect`     | `card: <id>`                               |
| Network Switch / Local links | `home: networks btn`          | `button: <label>`                          |
| Tutorial card / View all     | `home: tutorial`              | `tutorial: <id> \| "view all"`             |
| View saved                   | `home: save and share` (new)  | —                                          |

- [ ] Every row above fires.

## 4. After merge

- [ ] Mark roadmap Track 1 phases 1.1–1.6 `[x]` in `specs/roadmap.md`.
- [ ] Roadmap 1.3 done-criterion reads "each card opens its video" (Decision
      2 in `requirements.md`).
