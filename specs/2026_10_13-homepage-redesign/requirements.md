# Requirements: Homepage redesign

Roadmap: **Track 1: Homepage redesign** (`specs/roadmap.md`, phases 1.1–1.6).
Branch: `homepage-redesign`. All six phases ship as **one PR** (see
"Decisions").

## Why

The homepage is the first screen a new user sees. The old page (an image slider,
a 20-item tutorial list, network cards, and a resources list) was long and
showed little of what Lab does. It did not give a beginner a clear first step.

The redesign follows the mission principles (`specs/mission.md`):

- **Beginners** get a clear starting point: a hero with an "Ask"
  input for questions, short task cards, and three tutorials.
- **Experts** get a fast way into each tool: one card per area (Transactions,
  Smart contracts, API explorer, XDR tools).
- **Progressive disclosure**: the homepage links to tools. It does not try to
  explain each tool in depth.

## Scope

The new homepage (`src/app/page.tsx`) has these sections, from top to bottom:

1. **Hero:** heading, full-width "What are you building?" chat field with the **Ask**
   button inside it. The hero has no other buttons (the Figma design has no
   **Get started** or **Read docs**).
2. **Start building:** 4 task cards (Fund account, Build a transaction, Deploy a
   smart contract, Sign message).
3. **Explore & inspect:** 4 tool cards (Transactions, Smart contracts, API
   explorer, XDR tools).
4. **Network:** Testnet, Mainnet, and Local network cards. Switching here
   changes the network everywhere in Lab.
5. **Learn by building:** 3 video tutorials and a link to the playlist.
6. **Save and share:** short copy, **View saved**, and a new image.

The Ask input sends questions to the NeevAI "Ask Stellar" chat. The chat widget
loads on every page, and the CSP allows it. Every homepage CTA fires a tracking
event.

## Decisions

1. **One PR for all of Track 1.** The roadmap says one PR per phase. The six
   phases share one layout, one stylesheet, and one e2e file, so splitting them
   would create PRs that do not stand alone. Mark 1.1–1.6 `[x]` together when
   the PR merges.
2. **Tutorial cards open YouTube videos (changes roadmap 1.3).** The roadmap
   says "each card links to a working flow". We link to the existing video
   tutorials instead. In-app guided flows move to Track 4 (4.1, 4.3). New 1.3
   done-criterion: _each card opens its video, and "View all tutorials" opens
   the playlist._
3. **`CardGrid` is not built from SDS `<Card>`.** N cards would paint N borders,
   so each seam would be 2px. The container paints the divider color and the
   cells paint over it, so the 1px gap reads as a hairline at every breakpoint.
4. **`SectionHeader` is new, not a change to `HomeSection`.** The new design has
   no eyebrow, a different heading size, and spacing set at page level.
   `HomeSection` stays for the Endpoints landing page.
5. **`AskInput` uses local `useState`.** The draft question is transient. It
   must not sync to the URL through Zustand.
6. **Network switching reuses `useSwitchNetwork`.** `NetworkPicker` uses the
   same hook, modal-confirm pattern, and success notification as the old
   `Networks` component, so the selected network updates across Lab.
7. **NeevAI widget loads on every page,** not only the homepage. The chat bubble
   is useful on tool pages too. The homepage input is a shortcut into the same
   widget. **Under security review: see "Security: third-party script".**
8. **Full-page fallback caps the question at 200 characters** (URL length). The
   widget path caps at 2000 (NeevAI `submit()` limit). The input's `maxLength`
   is 2000.
9. **UTM stripping is scoped to `utm_source=neevai`.** Campaign tags from other
   sources stay untouched.
10. **"View saved" gets its own event.** It is not a hero button, so it must not
    reuse `HOME_TOP_BTN`.

## Security: third-party script (open)

`NeevaiChatScript` injects `cdn.neevai.io/v1/embed/<agent_id>.js` from the root
layout, so NeevAI’s code runs with full same-origin access on every Lab page,
including the signing flows.

**Is the `agent_id` / script URL safe to expose?** Yes. Both are public
identifiers, not credentials; the browser must fetch them. NeevAI’s handoff doc
says the chat loads only on origins in the agent’s allowed list
(`lab.stellar.org` is already on it). That stops other sites embedding our
agent in a browser. It does not limit what the script can do on our page, and
it may not stop direct calls to NeevAI’s backend with a forged `Origin`.

**What a malicious or compromised script could reach**

- Secret keys typed or pasted into the sign inputs (`SignShell`,
  `SignTransactionXdr`, `GenerateKeypair`).
- Saved keypairs in `localStorage` (`localStorageSavedKeypairs`) and
  `account.secretKey` in the Zustand store.
- The transaction XDR before signing. It could swap the XDR or destination, so
  the user signs something they did not intend. Hardware wallets and wallet
  extensions protect the key, not the intent: they show what the page sent.
- The DOM, to draw a fake "sign" or "re-enter your key" prompt.

**Mitigations, most effective first**

1. **Isolate the chat from Lab’s JavaScript context.** The only options that
   fully remove the exposure: embed the chat as a cross-origin iframe with our
   own launcher (see 2), or drop the script and open the full-page chat in a
   new tab (what `askNeevai` already does when the widget fails to load).
   Changes Decision 7 (no global bubble in the new-tab case).
1b. **Keep the script, reduce the risk (partial).** Do not load it on signing
   routes (`/transaction/*`, `/sign-message`, `/account/*`, smart-contract
   invoke and deploy), **and** force a hard reload when the user navigates
   client-side from a page where it loaded to one of those routes. Without the
   reload it is not enough: Lab is an SPA, so a script loaded on `/` stays in
   memory and sees the signing page. `localStorage` is shared across all pages
   either way. Pair with pinning (5) and less stored secrets (4).
2. **Sandbox instead of injecting.** Embed `prism-chat.neevai.io/assistant/<id>`
   as an iframe with our own launcher. The origin boundary blocks access to
   Lab’s DOM and storage, but we lose `window.NeevaiChat.submit()` and the
   bubble. Ask NeevAI whether an iframe-only embed is supported.
3. **Tighten the CSP.** `script-src` has `https:`, `'unsafe-inline'` and
   `'unsafe-eval'` next to `'strict-dynamic'`, and `connect-src` allows
   `https:`. Narrowing these limits what a loaded script can fetch or exfiltrate.
   Separate project: it affects Monaco and the wallet kits.
4. **Reduce secrets in the page.** Avoid persisting secret keys in
   `localStorage`; clear `account.secretKey` after signing; keep secrets out of
   the DOM. Helps against any XSS, not only this script.
5. **Vendor controls.** Ask NeevAI who can change the CDN script, whether
   versions can be pinned (immutable URL plus SRI `integrity`), and what their
   incident process is.
6. **User guidance.** For high-value signing, use a wallet or hardware device
   and check the transaction details there.

**Allowed domains (ops).** Ask NeevAI (support@neevai.io) or an admin (agent
Deploy tab → Allowed domains) to add: `http://localhost:<PORT>` for each dev
port, staging, and the per-PR preview URLs (use a wildcard such as
`*.example.com`). NeevAI removes test addresses at go-live, so local dev will
show a blank chat afterwards unless an admin re-adds `localhost`. The
full-page fallback may also be allowlist-gated.

**Status:** Decision 7 stands until the team decides between isolation (1/2)
and the partial option (1b). PM informed.

## Context for the next developer

- User-facing strings use the curly apostrophe `’` (for example, "You’re on
  Testnet").
- E2E: `tests/e2e/introductionPage.test.ts`. The Networks test uses an isolated
  browser context so the network switch does not leak into other tests.
