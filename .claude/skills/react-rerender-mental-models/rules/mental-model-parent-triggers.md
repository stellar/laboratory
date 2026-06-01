---
title: Props Don't Trigger Re-renders
impact: FOUNDATIONAL
impactDescription: corrects fundamental misconception
tags: mental-model, re-renders, props, parent
---

## Props Don't Trigger Re-renders

When a parent component re-renders, React automatically re-renders all its children. Props have nothing to do with the trigger—they're just values that get passed down during a render that's already happening.

### What Actually Triggers Re-renders

1. Component's own state changes
2. Parent component re-renders
3. Context value changes

Props are inputs to a render, not triggers of one.

### The Proof

**This child re-renders every time, even though props never change:**

```tsx
const Child = ({ count }) => {
  console.log("Child rendered");
  return <div>Count: {count}</div>;
};

const Parent = () => {
  const [parentCount, setParentCount] = useState(0);
  const childCount = 5; // Never changes

  return (
    <>
      <button onClick={() => setParentCount((c) => c + 1)}>
        Clicked {parentCount} times
      </button>
      <Child count={childCount} />
    </>
  );
};
```

Click the button—Child logs every time. The prop `count` is always `5`, yet Child re-renders because Parent re-renders.

### What's Happening Under the Hood

1. Parent's state changes (`parentCount` updates)
2. React calls `Parent()` function
3. Parent returns new JSX
4. React sees `<Child count={5} />` in the JSX
5. React calls `Child()` function ← **This is the re-render**
6. Child returns its JSX
7. React compares old vs new output, updates DOM if needed

Steps 1-6 happen every time. The component function runs, JSX gets created, new React elements are built.

### Why This Matters

The "props cause re-renders" mental model leads to defensive programming:
- Wrapping everything in `React.memo` "just in case"
- Using `useCallback` everywhere because some article said to
- Code becomes harder to read without actual performance benefit

**Correct mental model:** Trust React to be fast. Optimize based on profiler data, not fear.
