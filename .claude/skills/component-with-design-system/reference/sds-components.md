# SDS Component Catalog and Props Patterns

Quick reference for `@stellar/design-system` components used in this project.

## Commonly Used Components

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

## Props Patterns

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
