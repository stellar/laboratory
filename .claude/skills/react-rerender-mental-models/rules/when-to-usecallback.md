---
title: useCallback Only With Memoized Children
impact: MEDIUM
impactDescription: prevents breaking memoization
tags: when-to-memo, useCallback, memo, reference
---

## useCallback Only With Memoized Children

`useCallback` is only useful when passing callbacks to memoized children. If the child isn't wrapped in `React.memo`, `useCallback` does nothing—you're stabilizing a reference that nobody checks.

### The Chain

```
React.memo on child → requires stable props → requires useCallback for functions
```

You don't need one without the other.

### Incorrect: useCallback Without Memo

```tsx
// ❌ useCallback is pointless here
const Parent = () => {
  const [count, setCount] = useState(0);

  // This does nothing useful - Child isn't memoized
  const handleClick = useCallback(() => {
    console.log("clicked");
  }, []);

  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      <Child onClick={handleClick} />
    </>
  );
};

const Child = ({ onClick }) => {
  return <button onClick={onClick}>Click me</button>;
};
```

`Child` re-renders every time `Parent` re-renders—`useCallback` didn't help.

### Incorrect: Memo Without useCallback

```tsx
// ❌ Memoization is broken by new function reference
const MemoizedChild = React.memo(({ onClick }) => {
  console.log("Child rendered");
  return <button onClick={onClick}>Click me</button>;
});

const Parent = () => {
  const [count, setCount] = useState(0);

  // New function created every render - breaks memo
  const handleClick = () => {
    console.log("clicked");
  };

  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      <MemoizedChild onClick={handleClick} />
    </>
  );
};
```

`MemoizedChild` re-renders every time because `onClick` is a new reference.

### Correct: Both Together

```tsx
// ✅ Correct: memo + useCallback work together
const MemoizedChild = React.memo(({ onClick }) => {
  console.log("Child rendered");
  return <button onClick={onClick}>Click me</button>;
});

const Parent = () => {
  const [count, setCount] = useState(0);

  // Stable reference - memo check passes
  const handleClick = useCallback(() => {
    console.log("clicked");
  }, []);

  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      <MemoizedChild onClick={handleClick} />
    </>
  );
};
```

Now `MemoizedChild` only renders once. The memo check sees stable props and skips re-rendering.

### Decision Flow

```
Do I need useCallback?
│
├─ Is the child wrapped in React.memo?
│  ├─ No → Don't use useCallback
│  └─ Yes → Is the child expensive (50ms+ render)?
│           ├─ No → Consider removing memo instead
│           └─ Yes → Use useCallback
```

`useCallback` without `React.memo` on the receiving child does nothing — you're
stabilizing a reference that nobody checks.

> **Note:** If the React Compiler is enabled, it auto-memoizes — skip manual
> `useCallback` entirely.
