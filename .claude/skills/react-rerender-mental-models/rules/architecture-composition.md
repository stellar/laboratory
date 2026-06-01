---
title: Composition Over Optimization
impact: HIGH
impactDescription: prevents re-renders through structure
tags: architecture, composition, children, structure
---

## Composition Over Optimization

Good component structure prevents re-renders naturally—no `memo`, `useCallback`, or `useMemo` required. Reach for architecture changes before optimization hooks.

### The Pattern: Children Prop

```tsx
// ❌ Problem: ExpensiveComponent re-renders on every scroll
const ScrollTracker = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      <ScrollIndicator position={scrollY} />
      <ExpensiveComponent /> {/* Re-renders on every scroll! */}
    </div>
  );
};
```

### The Fix: Extract State, Pass Children

```tsx
// ✅ Solution: ExpensiveComponent doesn't re-render
const ScrollTracker = ({ children }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      <ScrollIndicator position={scrollY} />
      {children}
    </div>
  );
};

// Usage
const App = () => {
  return (
    <ScrollTracker>
      <ExpensiveComponent /> {/* Created by App, not ScrollTracker */}
    </ScrollTracker>
  );
};
```

**Why this works:** `ExpensiveComponent` is created by `App`, not `ScrollTracker`. When `ScrollTracker` re-renders due to scroll, `children` is the same React element reference—no re-render needed.

### Another Pattern: Extracting Changing State

```tsx
// ❌ Problem: Entire form re-renders on mouse move
const Form = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [formData, setFormData] = useState({});

  return (
    <div onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}>
      <Cursor position={mousePos} />
      <ExpensiveFormFields data={formData} onChange={setFormData} />
    </div>
  );
};
```

```tsx
// ✅ Solution: Extract the changing state into its own component
const MouseTracker = ({ children }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  return (
    <div onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}>
      <Cursor position={mousePos} />
      {children}
    </div>
  );
};

const Form = () => {
  const [formData, setFormData] = useState({});

  return (
    <MouseTracker>
      <ExpensiveFormFields data={formData} onChange={setFormData} />
    </MouseTracker>
  );
};
```

### When to Use This Pattern

- Frequently changing state (scroll, mouse, timers)
- State that only affects part of the UI
- Expensive children that don't depend on that state

### The Hierarchy of Solutions

```
1. First: Can I restructure components to avoid the problem?
   └─ Move state down, use children prop, split components

2. Second: Is there an architectural issue?
   └─ State lifted too high, unnecessary context usage

3. Last resort: Add memoization
   └─ Only after profiling confirms it's needed
```

### Key Insight

> "Most React apps don't have re-render problems. They have architecture problems. State lifted way too high, components that do ten different things. Fix the architecture first."
