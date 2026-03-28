---
name: component-with-design-system
description: Guide for building React components using @stellar/design-system and project SCSS conventions. Invoke when creating new components or reviewing component code.
read_files:
  - .claude/skills/component-with-design-system/reference/*.md
---

# Component with Design System

## Before Building Anything Custom

Check if `@stellar/design-system` already has the component:
https://github.com/stellar/stellar-design-system

> For the full SDS component catalog and props patterns, see
> `reference/sds-components.md` (loaded automatically).

## Component File Structure

### With styles (preferred for non-trivial components)

```
src/components/ComponentName/
├── index.tsx
└── styles.scss
```

### Without styles (simple components)

```
src/components/ComponentName.tsx
```

### Page-specific components

```
src/app/(sidebar)/[feature]/components/ComponentName.tsx
```

## Component Template

```typescript
"use client";

import { useState } from "react";
import { Button, Input, Card } from "@stellar/design-system";

import "./styles.scss";

interface ComponentNameProps {
  /** Description of prop */
  propName: string;
}

/**
 * Brief description of what this component does
 *
 * @example
 * <ComponentName propName="value" />
 */
export const ComponentName = ({ propName }: ComponentNameProps) => {
  return (
    <div className="ComponentName">
      <div className="ComponentName__header">
        {/* ... */}
      </div>
      <div className="ComponentName__content">
        {/* ... */}
      </div>
    </div>
  );
};
```

## SCSS Template

```scss
.ComponentName {
  // Root styles

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: pxToRem(16px);
  }

  &__footer {
    display: flex;
    gap: pxToRem(8px);
  }
}
```

## Conventions

### Do
- Use design system components for all standard UI elements
- Use SCSS with BEM-ish class naming (`ComponentName__element--modifier`)
- Use `pxToRem()` for spacing values in SCSS
- Use SDS CSS custom properties for colors/fonts/gaps: `var(--sds-clr-gray-06)`,
  `var(--sds-ff-monospace)`, `var(--sds-gap-md)`
- Use `data-*` attributes for state-driven styling instead of modifier classes:
  `data-is-active`, `data-is-visible`, `data-is-selected`, `data-is-clickable`
- Use `data-testid` with dashes for test selectors (`data-testid="sign-button"`)
- Add JSDoc comments with `@example` for exported components
- Co-locate page-specific components with their page
- Import shared SCSS utilities: `@use "../../styles/utils.scss" as *;`

### Don't
- Use inline `style={}` attributes — always use SCSS classes
- Create custom buttons, inputs, or alerts when design system has equivalents
- Use arbitrary hex colors — use SDS CSS custom properties (`--sds-clr-*`)
- Put styles in the component file — always separate into `.scss`
- Use `className` string concatenation — use template literals or classnames lib
- Use conditional CSS classes for state — prefer `data-*` attributes

## Data Attribute Pattern for State-Driven Styling

Prefer `data-*` attributes over CSS modifier classes for dynamic state:

```typescript
// Component
<div
  className="TransactionStepper__step"
  data-is-active={isActive || undefined}
  data-is-completed={isCompleted || undefined}
  data-is-clickable={isClickable || undefined}
  onClick={isClickable ? () => onStepClick(step) : undefined}
>
```

```scss
// SCSS — target with attribute selectors
.TransactionStepper__step {
  opacity: 0.5;

  &[data-is-active="true"] {
    opacity: 1;
    font-weight: var(--sds-fw-medium);
  }

  &[data-is-clickable="true"] {
    cursor: pointer;
  }

  &[data-is-completed="true"] {
    opacity: 0.8;
  }
}
```

Pass `undefined` (not `false`) to omit the attribute from the DOM entirely.
