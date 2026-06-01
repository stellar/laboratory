---
title: The Memoization Trap
impact: HIGH
impactDescription: identifies real performance bottlenecks
tags: anti-pattern, debugging, bottlenecks, profiling
---

## The Memoization Trap

You see slowness, assume it's re-renders, add memoization, feel productive—meanwhile the real issue is something else entirely.

### Real-World Example

A search input feels laggy. Every keystroke has a noticeable delay.

```tsx
// The "obvious" fix that doesn't work
const ProductList = () => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);

  // ❌ Added useMemo - still laggy
  const filteredProducts = useMemo(
    () => products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    ),
    [products, search]
  );

  // ❌ Added useCallback - still laggy
  const handleChange = useCallback((value) => {
    setSearch(value);
  }, []);

  return (
    <>
      <SearchInput value={search} onChange={handleChange} />
      {filteredProducts.map((product) => (
        <MemoizedProductCard key={product.id} product={product} />
      ))}
    </>
  );
};
```

### The Actual Problem

After profiling:
- The `.filter()` call: ~0.3ms on 200 products
- Re-rendering ProductCards: ~8ms total
- **A useEffect hitting analytics API on every keystroke: 200ms+ blocking**

```tsx
// ✅ The real fix
useEffect(() => {
  // Debounce the analytics call
  const timer = setTimeout(() => {
    analytics.track("search", { query: search });
  }, 300);
  return () => clearTimeout(timer);
}, [search]);
```

### Common Real Bottlenecks (Not Re-renders)

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| Laggy input | API calls on every keystroke | Debounce |
| Slow initial load | Large unoptimized images | Lazy load, compress |
| Scroll jank | Too many DOM nodes (1000+) | Virtualization |
| Animation stutter | CSS triggering layout recalc | Use transform/opacity only |
| Memory issues | Event listeners not cleaned up | Proper useEffect cleanup |

### Key Takeaway

If the React DevTools Profiler shows render times under 16ms, re-renders aren't
the problem — look at network calls, DOM node count, and CSS layout thrashing
instead.
