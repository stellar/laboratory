---
title: Don't Memoize Without Profiling
impact: HIGH
impactDescription: prevents unnecessary complexity
tags: anti-pattern, memo, useCallback, useMemo, profiling
---

## Don't Memoize Without Profiling

Adding `React.memo`, `useCallback`, and `useMemo` without profiling first is premature optimization. For cheap components (most of them), the memo check itself costs more than just re-rendering.

### The Problem

```tsx
// ❌ Incorrect: Memoizing without knowing if it helps
const ProductCard = React.memo(({ product, onSelect }) => {
  return (
    <div onClick={() => onSelect(product.id)}>
      <h3>{product.name}</h3>
      <p>${product.price}</p>
    </div>
  );
});

const ProductList = ({ products }) => {
  // ❌ useCallback "just in case"
  const handleSelect = useCallback((id) => {
    console.log("Selected:", id);
  }, []);

  return products.map((p) => (
    <ProductCard key={p.id} product={p} onSelect={handleSelect} />
  ));
};
```

This adds complexity with no proven benefit. The memo check happens every render, comparing props that probably haven't changed.

### The Correct Approach

**Step 1: Write simple code first**

```tsx
// ✅ Correct: Simple, readable, no premature optimization
const ProductCard = ({ product, onSelect }) => {
  return (
    <div onClick={() => onSelect(product.id)}>
      <h3>{product.name}</h3>
      <p>${product.price}</p>
    </div>
  );
};

const ProductList = ({ products }) => {
  const handleSelect = (id) => {
    console.log("Selected:", id);
  };

  return products.map((p) => (
    <ProductCard key={p.id} product={p} onSelect={handleSelect} />
  ));
};
```

**Step 2: Profile when something feels slow** — only add memoization for
components with **50ms+ render times** that re-render frequently with unchanged
props.

### The Real Cost of Premature Memoization

- **Cognitive overhead**: More code to read and maintain
- **Hidden bugs**: Stale closures from incorrect dependency arrays
- **False confidence**: "I optimized it" when the real issue is elsewhere
- **Memo overhead**: The comparison check runs every render

> **Note:** If the React Compiler is enabled, it handles memoization
> automatically — manual `memo`/`useMemo`/`useCallback` becomes unnecessary for
> most components.
