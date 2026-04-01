---
title: Render vs Commit
impact: FOUNDATIONAL
impactDescription: clarifies what "render" actually means
tags: mental-model, render, commit, DOM, performance
---

## Render vs Commit

A **render** just means React called your component function. A **commit** is when React actually touches the DOM. Many renders result in zero DOM changes—and those are cheap.

### The Two Phases

| Phase | What Happens | Cost |
|-------|--------------|------|
| **Render** | React calls your component function, creates new React elements | Cheap (JavaScript execution) |
| **Commit** | React updates the actual DOM based on what changed | Expensive (DOM manipulation) |

### Why This Matters

React is incredibly efficient at the render phase. Your 50-component tree probably re-renders in under 10ms. That's not your bottleneck.

```tsx
// This component "renders" but may not "commit" anything
const Counter = ({ count }) => {
  // Render phase: this function runs
  console.log("Rendered");
  
  // React compares this output to previous output
  // If identical, no DOM commit happens
  return <div>{count}</div>;
};
```

### React.memo and the Render Phase

`React.memo` doesn't prevent re-renders entirely—it bails out early during the render phase:

1. Parent re-renders
2. React starts to render memoized child
3. Memo check: "Have props changed?"
4. If no → skip calling component function, reuse previous output
5. If yes → call component function normally

You're still in the render phase. The parent already re-rendered. The memo check already happened. Memo just prevents *wasted work* in the child.

### Practical Implication

Quick renders that don't touch the DOM are essentially free. Optimize based on
render *duration*, not render *count*.
