---
title: Keep State Local
impact: HIGH
impactDescription: prevents unnecessary re-renders structurally
tags: architecture, state, composition, local-state
---

## Keep State Local

State should live as close as possible to where it's used. When state lives too high in the tree, every state change re-renders everything below—even components that don't use that state.

### The Problem: Lifted State

```tsx
// ❌ Incorrect: All state at the top
const Dashboard = () => {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("name");
  const [data, setData] = useState([]);

  // Every state change re-renders EVERYTHING below
  return (
    <>
      <SearchBar value={search} onChange={setSearch} />
      <FilterPanel filters={filters} onChange={setFilters} />
      <SortDropdown value={sort} onChange={setSort} />
      <DataTable data={data} />
      <Summary data={data} />
      <Charts data={data} />
    </>
  );
};
```

When the user types in the search box:
1. `search` state changes
2. `Dashboard` re-renders
3. `FilterPanel`, `SortDropdown`, `DataTable`, `Summary`, `Charts` all re-render
4. None of them needed to!

### The Solution: Local State

```tsx
// ✅ Correct: State lives where it's used
const Dashboard = () => {
  // Only shared state lives here
  const [data, setData] = useState([]);

  return (
    <>
      <SearchSection onSearch={(query) => fetchData(query)} />
      <FilterSection />
      <SortSection />
      <DataTable data={data} />
      <Summary data={data} />
      <Charts data={data} />
    </>
  );
};

const SearchSection = ({ onSearch }) => {
  const [search, setSearch] = useState("");
  
  // Search changes only affect THIS component
  // DataTable, Summary, Charts don't even know it happened
  const handleChange = (value) => {
    setSearch(value);
    onSearch(value);
  };

  return <SearchBar value={search} onChange={handleChange} />;
};

const FilterSection = () => {
  const [filters, setFilters] = useState({});
  // Filter state is local - other sections don't re-render
  return <FilterPanel filters={filters} onChange={setFilters} />;
};

const SortSection = () => {
  const [sort, setSort] = useState("name");
  // Sort state is local
  return <SortDropdown value={sort} onChange={setSort} />;
};
```

### The Result

When user types in search:
1. `search` state changes in `SearchSection`
2. Only `SearchSection` re-renders
3. `FilterSection`, `SortSection`, `DataTable`, etc. are untouched

**No memo needed.** This is composition—React's been pushing this pattern forever.

### Rule of Thumb

Ask: "Does this state need to be shared?"

| If... | Then... |
|-------|---------|
| Only one component reads the state | Keep it local in that component |
| Multiple siblings need it | Lift to nearest common parent |
| Many distant components need it | Consider Context |
| "It might be needed somewhere" | Keep it local until it actually is |

### Why This Works Better Than Memoization

- **Zero overhead**: No memo checks running every render
- **Clearer code**: State lives next to the UI it controls
- **Easier debugging**: State changes are localized
- **Natural boundaries**: Components are more self-contained
