---
name: component-with-design-system
description: Guide for building React components using @stellar/design-system and project SCSS conventions. Invoke when creating new components or reviewing component code.
---

# Component with Design System

## Before Building Anything Custom

Check if `@stellar/design-system` already has the component:
https://github.com/stellar/stellar-design-system

## Commonly Used Design System Components

### Layout & Structure
- `<Box gap="sm|md|lg">` — flex container with gap
- `<Card>` — bordered card container
- `<PageCard heading="...">` — card with heading, optional `rightElement`
- `<PageHeader heading="..." as="h1|h2">` — page/section title

### Form Inputs
- `<Input>` — text input with label, error, note props
- `<Select>` — dropdown with `fieldSize` prop
- `<Textarea>` — multiline text
- `<RadioButton id label fieldSize="sm|md|lg">` — radio input, extends native
  `<input>` attributes (`name`, `value`, `checked`, `onChange`, etc.)

### Actions
- `<Button variant="primary|secondary|tertiary|destructive">` — with optional
  `icon`, `isLoading`, `disabled` props
- `<CopyText textToCopy={value}>` — text with copy button

### Feedback
- `<Alert variant="primary|success|warning|error" title="...">` — alert banner
  with optional children for body
- `<Text size="xs|sm|md|lg" as="span|p|div">` — typography
- `<Link>` — styled link
- `<Icon.[Name] />` — icon from icon set

### Display
- `<Badge variant="primary|secondary|tertiary|success|warning|error" size="sm|md|lg">`
  — status label with optional `icon`, `iconPosition`, `isOutlined`, `isSquare`,
  `isStatus` props
- `<Text size="xs|sm|md|lg" as="span|p|div">` — typography for displaying text

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

## Design System Props Patterns

### Input with validation

```typescript
<Input
  id="source-account"
  fieldSize="md"
  label="Source Account"
  value={sourceAccount}
  onChange={(e) => setSourceAccount(e.target.value)}
  error={getPublicKeyError(sourceAccount)}
  note="The account that originates the transaction"
/>
```

### Button with loading state

```typescript
<Button
  variant="primary"
  size="md"
  isLoading={isSubmitting}
  disabled={!isValid}
  onClick={handleSubmit}
>
  Submit Transaction
</Button>
```

### Alert with details

```typescript
<Alert variant="warning" title="Auth entries require signing">
  This transaction has {authCount} authorization entries that must be
  signed before the transaction envelope can be signed.
</Alert>
```

### RadioButton group

```typescript
<RadioButton
  id="network-testnet"
  name="network"
  label="Testnet"
  fieldSize="md"
  checked={network === "testnet"}
  onChange={() => setNetwork("testnet")}
/>
<RadioButton
  id="network-mainnet"
  name="network"
  label="Mainnet"
  fieldSize="md"
  checked={network === "mainnet"}
  onChange={() => setNetwork("mainnet")}
/>
```

### Badge with icon

```typescript
<Badge variant="success" size="sm" icon={<Icon.CheckCircle />} iconPosition="right">
  Verified
</Badge>

<Badge variant="error">Failed</Badge>

<Badge variant="secondary" size="sm">
  {itemCount} items
</Badge>
```

### PageCard with action

```typescript
<PageCard
  heading="Transaction Parameters"
  rightElement={
    <Button variant="tertiary" onClick={handleClear}>
      Clear all
    </Button>
  }
>
  {/* Card content */}
</PageCard>
```

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
