---
name: react-rerender-mental-models
description: Correct mental models for React re-renders and memoization. Use this skill when writing, reviewing, or optimizing React components to avoid common misconceptions about performance. Debunks the myth that "props cause re-renders" and teaches when memoization actually helps.
license: MIT
metadata:
  author: freighter
  version: "1.0.0"
---

# React Re-render Mental Models

A practical guide to understanding how React re-renders actually work, debunking common misconceptions, and knowing when optimization is truly needed.

## Core Philosophy

> "Trust React to be fast. Write simple code. Measure when something actually feels slow. Optimize based on data, not fear."

## When to Apply

Reference these guidelines when:
- Writing new React components
- Reviewing code for performance issues
- Deciding whether to add React.memo, useCallback, or useMemo
- Debugging perceived "slowness" in React apps
- Refactoring component architecture

## Rule Categories

| Category | Prefix | Description |
|----------|--------|-------------|
| Mental Models | `mental-model-` | Correct understanding of how React works |
| Anti-Patterns | `anti-pattern-` | Common mistakes to avoid |
| When to Memoize | `when-to-memo-` | Profile-driven optimization guidance |
| Architecture | `architecture-` | Component structure patterns |

## Quick Reference

### Mental Models (Foundational)

- `mental-model-parent-triggers` - Props don't trigger re-renders; parent re-renders do
- `mental-model-render-vs-commit` - Render ≠ Commit; renders are cheap, commits touch DOM

### Anti-Patterns (Avoid These)

- `anti-pattern-premature-memo` - Don't memoize without profiling first
- `anti-pattern-memoization-trap` - Real bottlenecks are often not re-renders

### When to Memoize (Use Sparingly)

- `when-to-memo-context-values` - Stabilize context object references
- `when-to-usecallback` - Only needed when child is already memoized

### Architecture (Prefer These)

- `architecture-local-state` - Keep state close to where it's used
- `architecture-composition` - Component structure prevents re-renders naturally

## What Actually Triggers Re-renders

1. **Component's own state changes** (useState, useReducer)
2. **Parent component re-renders** (cascades to all children)
3. **Context value changes** (for consumers of that context)

**Props are NOT on this list.** Props are inputs to a render that's already happening—they don't schedule one.

## The Performance Debugging Flow

```
1. Something feels slow
2. Open React DevTools Profiler
3. Record the interaction
4. Look for components with 50ms+ render times
5. If found → consider memoization
6. If not found → the problem is elsewhere:
   - API calls firing too often
   - Unoptimized images
   - Too many DOM nodes
   - CSS animations triggering layout
```

## React 19 Compiler

This project runs React 19. The **React Compiler** (formerly React Forget) is
an opt-in build-time tool that statically analyzes components and automatically
inserts the equivalent of `useMemo`, `useCallback`, and `React.memo`. It is
**not enabled by default** — it requires `babel-plugin-react-compiler` (or the
SWC equivalent) to be installed and configured.

- If the compiler is **enabled in this project**: skip manual memoization. The
  compiler tracks data flow within each component and caches results at a more
  granular level than hand-written hooks. If the compiler opts out a specific
  component (e.g. due to side effects during render), fix the component rather
  than adding manual memo.
- If the compiler is **not enabled** (current default): follow the rules below,
  but prefer architecture fixes (local state, composition) over adding
  memo/useCallback.

Regardless of compiler status, the mental models and architecture rules in this
skill still apply — composition and local state are always better than relying
on memoization (auto or manual). Re-render triggers remain the same either way.

## How to Use

Read individual rule files for detailed explanations and code examples:

```
rules/mental-model-parent-triggers.md
rules/anti-pattern-premature-memo.md
rules/architecture-local-state.md
```

Each rule file contains:
- Brief explanation of why it matters
- Incorrect code example with explanation
- Correct code example with explanation
