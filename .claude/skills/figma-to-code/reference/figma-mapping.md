# Figma to Code Mapping Reference

Lookup tables and layout patterns for translating Figma MCP output to project
conventions.

## Element Mapping Rules

Map Figma's generic HTML to `@stellar/design-system` components:

| Figma output | Use instead |
|---|---|
| `<div>` with flex layout | `<Box gap="sm\|md\|lg">` or `<div>` with SCSS class |
| `<div>` as card/section | `<PageCard heading="...">` or `<Card>` |
| Page title | `<PageHeader heading="..." as="h1" />` |
| `<input>` | `<Input>` from SDS |
| `<select>` | `<Select>` from SDS |
| `<textarea>` for XDR | `<XdrPicker>` component |
| `<button>` | `<Button variant="primary\|secondary\|tertiary\|destructive">` |
| `<a>` link | `<Link>` from SDS, or Next.js `<Link>` for routes |
| Alert/banner | `<Alert variant="..." title="...">` |
| Inline text | `<Text size="..." as="span\|p">` |
| Copy-able text | `<CopyText textToCopy={value}>` |
| Code display | `<CodeEditor>` component |
| Icons | `<Icon.Name />` from SDS |

For domain-specific pickers (`<MemoPicker>`, `<TimeBoundsPicker>`,
`<PositiveIntPicker>`, etc.), check `src/components/`.

## Spacing and Layout

Use `pxToRem()` for spacing. Do NOT use arbitrary pixel values from Figma.

```scss
.ComponentName {
  display: flex;
  flex-direction: column;
  gap: pxToRem(16px);

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

- **Colors**: Map to SDS CSS variables (`--sds-clr-*`), not raw hex values
- **Typography**: Map to SDS `<Text>` sizes, not raw font specs
- **Spacing**: Map to the `pxToRem()` scale used in the project
- **Shadows/borders**: Check if SDS has equivalent, otherwise use SCSS

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
