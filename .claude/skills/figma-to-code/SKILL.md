---
name: figma-to-code
description: Bridge Figma MCP output to Stellar Lab code conventions. Invoke after calling get_design_context to translate Figma's reference code into project-appropriate components, classes, and patterns.
---

# Figma to Code

## Purpose

The Figma MCP's `get_design_context` returns generic reference code (often plain
HTML/CSS). This skill bridges the gap between that output and the project's
actual conventions: `@stellar/design-system` components, SCSS with BEM-ish
naming, and specific layout patterns.

## Workflow

### 1. Get the Figma design context

```
mcp__figma-desktop__get_design_context({
  nodeId: "1234:5678",
  artifactType: "COMPONENT_WITHIN_A_WEB_PAGE_OR_APP_SCREEN",
  clientFrameworks: "react",
  clientLanguages: "typescript,scss"
})
```

Also get a screenshot for visual reference:
```
mcp__figma-desktop__get_screenshot({ nodeId: "1234:5678" })
```

### 2. Translate the output

Do NOT copy the Figma reference code directly. Instead, map each element to the
project's conventions using the rules below.

### 3. Verify against screenshot

After implementing, visually compare the rendered component against the Figma
screenshot. Focus on: layout, spacing, typography hierarchy, and interactive
states.

## Element Mapping Rules

### Layout elements

| Figma output | Use instead |
|---|---|
| `<div>` with flex layout | `<Box gap="sm|md|lg">` from design system, or a `<div>` with SCSS class |
| `<div>` as card/section | `<PageCard heading="...">` or `<Card>` |
| Page title | `<PageHeader heading="..." as="h1" />` |
| Generic container | `<div className="ComponentName">` with SCSS |

### Form elements

| Figma output | Use instead |
|---|---|
| `<input>` | `<Input>` from `@stellar/design-system` |
| `<select>` | `<Select>` from `@stellar/design-system` |
| `<textarea>` for XDR | `<XdrPicker>` component |
| Memo field | `<MemoPicker>` component |
| Number input | `<PositiveIntPicker>` component |
| Time bounds | `<TimeBoundsPicker>` component |

### Action elements

| Figma output | Use instead |
|---|---|
| `<button>` primary | `<Button variant="primary">` |
| `<button>` secondary | `<Button variant="secondary">` |
| `<button>` destructive | `<Button variant="destructive">` |
| `<button>` text/link style | `<Button variant="tertiary">` |
| Icon button | `<Button variant="tertiary" icon={<Icon.Name />}>` |
| `<a>` link | `<Link>` from design system, or Next.js `<Link>` for routes |

### Feedback elements

| Figma output | Use instead |
|---|---|
| Alert/banner | `<Alert variant="primary|success|warning|error" title="...">` |
| Inline text | `<Text size="sm|md|lg" as="span|p">` |
| Copy-able text | `<CopyText textToCopy={value}>` |
| Code display | `<CodeEditor>` component (for JSON/XDR) |

### Icons

Always use icons from `@stellar/design-system`:
```typescript
import { Icon } from "@stellar/design-system";
<Icon.ChevronRight />
```

## SCSS Naming Convention

### Class naming (BEM-ish)

```scss
.ComponentName {
  // root element

  &__header {
    // child element
  }

  &__content {
    // child element
  }

  &__footer {
    // child element
  }

  &--active {
    // modifier
  }
}
```

### File structure

```
ComponentName/
├── index.tsx
└── styles.scss
```

Import in the component:
```typescript
import "./styles.scss";
```

### Spacing and layout

Use the design system's spacing scale. Do NOT use arbitrary pixel values from
Figma. Common patterns:

```scss
.ComponentName {
  display: flex;
  flex-direction: column;
  gap: pxToRem(16px);    // Use the pxToRem function if available

  &__layout {
    display: flex;
    gap: pxToRem(32px);  // Two-column layout
  }

  &__content {
    flex: 1;
    min-width: 0;        // Prevent flex overflow
  }

  &__sidebar {
    flex-shrink: 0;
  }
}
```

### Responsive patterns

```scss
@media (max-width: 960px) {
  .ComponentName {
    &__layout {
      flex-direction: column;
    }

    &__sidebar {
      display: none;      // Hide stepper on mobile
    }
  }
}
```

## Figma Variable Mapping

When `get_variable_defs` returns Figma design tokens:

- **Colors**: Map to design system CSS variables (e.g., `--color-gray-70`), not
  raw hex values
- **Typography**: Map to design system `<Text>` sizes, not raw font specs
- **Spacing**: Map to the spacing scale used in the project
- **Shadows/borders**: Check if design system has equivalent, otherwise use SCSS

## Common Pitfalls

1. **Don't copy Figma's HTML structure literally** — Figma groups elements for
   design purposes, not component architecture. Think about what makes sense as
   React components.

2. **Don't use inline styles** — Always use SCSS classes. The project has a
   strict no-inline-style convention.

3. **Don't create custom buttons/inputs** — Always check if
   `@stellar/design-system` has the component. Visit
   https://design-system.stellar.org/ for the catalog.

4. **Don't use arbitrary colors** — Figma may show raw hex values. Map them to
   the design system's color tokens.

5. **Don't ignore interactive states** — Figma may show one state. Consider
   hover, focus, disabled, loading, and error states using design system props.

## Page-Level Layout Pattern (Transaction Flow)

For new pages in the transaction flow:

```typescript
<div className="BuildTransaction">
  <Tabs tabs={[...]} activeTabHref="/transaction/build" />
  <div className="BuildTransaction__layout">
    <div className="BuildTransaction__content">
      {/* Step content */}
      <TransactionFlowFooter ... />
    </div>
    <div className="BuildTransaction__stepper">
      <TransactionStepper ... />
    </div>
  </div>
</div>
```

```scss
.BuildTransaction {
  &__layout {
    display: flex;
    gap: pxToRem(32px);
  }
  &__content {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: pxToRem(16px);
  }
  &__stepper {
    flex-shrink: 0;
    padding-top: pxToRem(8px);
  }
}
```
