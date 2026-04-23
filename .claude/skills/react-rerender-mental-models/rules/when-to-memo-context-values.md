---
title: Memoize Context Values
impact: MEDIUM
impactDescription: prevents unnecessary context consumer re-renders
tags: when-to-memo, context, useMemo, reference
---

## Memoize Context Values

When passing objects to Context providers, use `useMemo` to stabilize the reference. Otherwise, every component using that context re-renders on every provider render—even if the actual values didn't change.

### The Problem

```tsx
// ❌ Incorrect: Creates new object reference every render
const ThemeContext = createContext();

const App = () => {
  const [theme, setTheme] = useState("light");
  const [user, setUser] = useState(null);

  // New object created on EVERY render
  const value = { theme, setTheme };

  return (
    <ThemeContext.Provider value={value}>
      <ExpensiveTree />
    </ThemeContext.Provider>
  );
};
```

**What happens:**
1. `user` state changes (nothing to do with theme)
2. `App` re-renders
3. New `value` object is created (different reference)
4. React sees context value "changed" (reference comparison)
5. **Every component using `useContext(ThemeContext)` re-renders**

### The Solution

```tsx
// ✅ Correct: Stable object reference with useMemo
const App = () => {
  const [theme, setTheme] = useState("light");
  const [user, setUser] = useState(null);

  // Only creates new object when theme changes
  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      <ExpensiveTree />
    </ThemeContext.Provider>
  );
};
```

Now context consumers only re-render when `theme` actually changes, not on every `App` render.

### Alternative: Split Contexts

For contexts with both state and setters, consider splitting:

```tsx
// ✅ Even better: Separate contexts for state and dispatch
const ThemeStateContext = createContext();
const ThemeDispatchContext = createContext();

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  return (
    <ThemeStateContext.Provider value={theme}>
      <ThemeDispatchContext.Provider value={setTheme}>
        {children}
      </ThemeDispatchContext.Provider>
    </ThemeStateContext.Provider>
  );
};

// Components that only SET theme don't re-render when theme CHANGES
const ThemeToggle = () => {
  const setTheme = useContext(ThemeDispatchContext);
  // ...
};
```

### When to Apply

Apply when a context provider is near the root, passes an object value, and
re-renders for reasons unrelated to that context. Skip for primitive values or
providers that rarely re-render.
