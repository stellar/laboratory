# Roadmap

High-level implementation order. Each phase is **one PR** with a clear
done-criterion. Phases are ordered: finish in-flight work first, then
debugging, then onboarding polish.

Mark a phase `[x]` when its PR merges. Add new phases where they fit; keep
them small.

## Baseline (already shipped)

- Single-page transaction flow: Build → Simulate → Sign → Validate → Submit.
- Soroban auth entry signing and enforce-mode validation.
- Import transaction with Operations and Signatures tabs.
- Transaction dashboard: fee breakdown, resource profiler, events, state
  changes, call stack trace.
- SEP-53 sign and verify message.
- Session state in `sessionStorage`; legacy URL state migration removed
  ([#2218](https://github.com/stellar/laboratory/pull/2218)).
- Stellar SDK v17, XDR JSON v28, Wallets Kit with WalletConnect.

---

## Track 1: Homepage redesign (in flight)

- [ ] **1.1 New homepage layout.** Replace slider/networks/resources/tutorials
      with section header, card grid, Start Building, Explore & Inspect.
      _Done:_ new sections render; old components deleted; e2e intro test
      updated.
- [ ] **1.2 Network picker on homepage.** _Done:_ switching network from the
      homepage updates the selected network across Lab.
- [ ] **1.3 Learn by Building tutorials.** Create account, payments, hello
      world cards with images. _Done:_ each card links to a working flow.
- [ ] **1.4 Ask input (AI docs search).** Neevai script, full-page URL
      helper, CSP update. _Done:_ unit test for URL helper; CSP allows only
      required sources.
- [ ] **1.5 Save & Share section refresh.** _Done:_ new image and copy.
- [ ] **1.6 Homepage tracking events.** _Done:_ every CTA fires a tracked
      event.

## Track 2: Transaction flow polish

- [ ] **2.1 Network limits from backend.** Replace the fetch script and
      static file with the backend endpoint
      ([#2206](https://github.com/stellar/laboratory/pull/2206)). _Done:_
      Network Limits page and resource checks read from the backend.
- [ ] **2.2 Retire legacy transaction pages.** Remove or redirect pages that
      the single-page flow replaces. _Done:_ no dead routes; redirects
      covered by e2e.
- [ ] **2.3 Flow state on network switch.** _Done:_ switching network warns
      and resets or keeps flow state predictably.
- [ ] **2.4 Save and resume a flow.** _Done:_ a transaction saved to
      `localStorage` reopens at the correct step.
- [ ] **2.5 Token units and base units in Invoke Contract.** Productionize
      the prototype in
      [#2164](https://github.com/stellar/laboratory/pull/2164): read the
      SEP-41 `decimals()` value and let users enter amounts in token units
      (for example, `5` SolvBTC) or base units. _Done:_ amount fields
      convert correctly for tokens with different decimals; unit + e2e
      tests.

## Track 3: Best debugging tool

Classic and smart contract transactions both get first-class diagnostics.

- [ ] **3.1 Human-readable result codes (classic).** Map tx and op result
      codes to plain-language explanations with fix hints. _Done:_ every
      classic result code has a message; unit tested.
- [ ] **3.2 Human-readable Soroban errors.** Explain host errors and contract
      errors (using contract spec error enums). _Done:_ simulate and submit
      failures show an explanation above the raw output.
- [ ] **3.3 Diagnostic events viewer.** Readable, filterable list of
      diagnostic events from simulate and submit. _Done:_ shared component
      used in Simulate step and dashboard.
- [ ] **3.4 Simulation vs. actual resources.** Show simulated estimates next
      to post-submit actual metrics. _Done:_ side-by-side view on dashboard.
- [ ] **3.5 Resource limit warnings.** Compare usage with network limits.
      _Done:_ values near or above limits are flagged.
- [ ] **3.6 Debug by hash.** Paste a tx hash to load the full debug view via
      RPC `getTransaction`. _Done:_ works for success and failure on all
      networks within RPC retention.
- [ ] **3.7 Footprint and auth explainer.** Show which entries are read or
      written and who authorized what. _Done:_ auth tree and footprint
      rendered from tx XDR.
- [ ] **3.8 Contract spec XDR as one base64 stream.** Show the spec in XDR
      view as a single base64 value, the same as `stellar-cli`
      ([#1556](https://github.com/stellar/laboratory/issues/1556)). _Done:_
      the copied value decodes to the full spec with `stellar-cli`.

### Token and event explorer (Lumenitos Scan)

Bring Lumenitos Scan features into Lab
([#1802](https://github.com/stellar/laboratory/issues/1802)). One PR each:

- [ ] **3.9 SEP-41 token metadata.** Show name, symbol, decimals for a token
      contract. _Done:_ metadata shown on the contract dashboard.
- [ ] **3.10 Recent token transfers.** List recent transfer events for a
      token and for an account. _Done:_ paginated list from RPC
      `getEvents`.
- [ ] **3.11 Balances from transfers.** Pre-populate an account's token
      balance list from its recent transfer events. _Done:_ balances shown
      for each token seen in transfers.
- [ ] **3.12 All contract events.** Show all events for a contract, with
      filters. _Done:_ filter by topic and event type.

## Track 4: Beginner onboarding

- [ ] **4.1 First-run guide.** Create keypair → fund → first payment.
      _Done:_ new user completes it on testnet without external docs.
- [ ] **4.2 Inline field help.** _Done:_ every build-step field has a short
      tooltip and docs link.
- [ ] **4.3 Contract quickstart.** Invoke a sample contract on testnet.
      _Done:_ guided path from homepage to a successful invoke.
- [ ] **4.4 Download contract bindings.** Let users download TypeScript
      bindings from the Bindings tab on the Contract Dashboard
      ([#1887](https://github.com/stellar/laboratory/issues/1887)). _Done:_
      downloaded bindings import and build in a sample project. _Later:_ a
      backend service that compiles and publishes bindings for a contract.
- [ ] **4.5 Empty and error states audit.** _Done:_ every page has a helpful
      empty state and a next action.
- [ ] **4.6 Accessibility pass.** _Done:_ keyboard navigation and screen
      reader labels on all flows.

## Ongoing (every release)

- Keep dependencies current; follow the protocol upgrade policy in
  `tech-stack.md`.
- Add e2e coverage for every new flow.
- Track usage of new features with Amplitude and prune unused ones.
