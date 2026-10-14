# Mission

## What Stellar Lab is

Stellar Lab is the all-in-one web tool for working with the Stellar network.
In one place, a person can build, import, simulate, sign, and submit
transactions, interact with smart contracts, and make requests to RPC (and,
for legacy features, Horizon).

It is deployed from `main` to https://lab.stellar.org/.

## Who it is for

Lab must welcome **both beginners and experts**.

- **Beginners**: developers new to Stellar who want to learn by doing. They
  need a clear starting point, safe defaults (testnet, Friendbot), plain
  language, and guidance when something fails.
- **Experts**: protocol, wallet, and contract engineers who need full control
  over every field, raw XDR, and deep diagnostics. They need speed, density,
  and shareable state.

Lab is built for **humans**. Agents and scripts can use the same network, but
the product is judged by how a person experiences it.

## Principles

### 1. Progressive disclosure

When beginner simplicity and expert power conflict, use progressive
disclosure:

- The default path is simple and gets a first-time user to success.
- Expert depth (raw XDR, resource details, advanced options) is one click
  away: expandable, tabbed, or toggled.
- Never remove an expert capability to make a screen simpler. Hide it, do not
  delete it.

### 2. Best UX, always

- Every flow must show the user where they are, what comes next, and what went
  wrong.
- Errors are explained in human terms first, with the raw result available
  underneath.
- State is preserved: users do not lose work on navigation or reload within
  the current session (tab), via `sessionStorage`. Users can save work they
  want to keep to `localStorage`. Lab does not save or share state through
  URLs.
- Accessible and responsive by default.

### 3. Current with the protocol

- Lab supports each new Stellar protocol release (new operations, XDR types,
  host functions, limits) on or before the day it reaches testnet.
- Network limits, SDK, and XDR definitions are kept in sync with the network.

### 4. The best debugging tool on Stellar

For both **classic** and **smart contract** transactions, Lab is where a
developer goes to understand what happened and why:

- Decode any XDR into readable form and back.
- Show simulation results, resource usage, fees, auth entries, events, state
  changes, and call stack traces.
- Explain failure result codes and diagnostic events with actionable hints.

### 5. Trustworthy

- Keys and secrets stay in the browser. Lab never sends secret keys to a
  server.
- Signing is explicit: the user always sees what they sign.
- Advisory checks (missing signers, blocklisted domains) inform; they do not
  block the user from submitting a valid transaction.

## Non-goals

- Lab is not a wallet. It does not hold funds or keys long-term.
- Lab is not a block explorer replacement for analytics or history.
- Lab does not add new features on Horizon (see `tech-stack.md`).

## How we know we are succeeding

Success is measured with Amplitude (`src/metrics/`). The PM and engineering
will define the success metrics.

- [ ] Define success metrics (owner: PM + engineering).
- [ ] Make sure each metric has the Amplitude events it needs.
