---
name: commit-progress
description: Commit a logical unit of work with a descriptive message. Invoke after completing a meaningful chunk (component created, store wired, tests passing) to maintain small, reviewable commits.
user_invocable: true
---

# Commit Progress

Create a focused commit for the work just completed. This skill produces small,
reviewable commits — one per logical unit of work, not one per file edit.

## When to Invoke

- After a component is created and rendering correctly
- After store fields/actions are wired and working
- After tests are written and passing
- After a bug fix is verified
- After a refactor is complete
- When switching context to a different sub-task

## When NOT to Invoke

- In the middle of incomplete work (half-written component, broken imports)
- After only formatting or trivial changes
- If there are no meaningful changes to commit

## Procedure

### 1. Assess what changed

Run in parallel:
- `git status` — see all modified/untracked files
- `git diff --stat` — summary of changes
- `git diff` — full diff of unstaged changes
- `git log --oneline -5` — recent commits for style reference

### 2. Determine if changes form a coherent unit

A good commit contains changes that serve **one purpose**. If the diff contains
unrelated changes, stage only the related files.

Examples of coherent units:
- "Add SignStepContent component and store fields"
- "Wire simulate isNextDisabled logic"
- "Add tracking events for sign step"
- "Fix auth entry XDR parsing edge case"

### 3. Stage and commit

Stage specific files (prefer explicit paths over `git add .`):

```bash
git add src/app/(sidebar)/transaction/build/components/SignStepContent.tsx
git add src/store/createTransactionFlowStore.ts
```

Write commit message following the project's conventions:
- **Style**: Informal, descriptive, present tense
- **Prefix**: Use `[New Tx]` for new transaction flow work
- **Format**: Short summary line; no body needed for small changes
- **Examples from this repo**:
  - `[New Tx] Add Simulate Step`
  - `[New Tx] Wire sign step into page layout`
  - `animate chevron`
  - `fix auth entry parsing for empty credentials`

```bash
git commit -m "$(cat <<'EOF'
[New Tx] Add SignStepContent component

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
EOF
)"
```

### 4. Verify

Run `git status` to confirm clean state or expected remaining changes.

## Guidelines

- **Never force push** or amend without explicit user request
- **Never commit** `.env`, credentials, or sensitive files
- **Never skip hooks** (`--no-verify`) unless user explicitly requests it
- **Prefer small commits** — if in doubt, commit more often
- **Pre-commit hook runs lint-staged** (ESLint auto-fix on staged files) — if it
  fails, fix the lint error and create a NEW commit (don't amend)
- **Pre-push hook runs** TypeScript check + all tests — these only run on push,
  not commit
