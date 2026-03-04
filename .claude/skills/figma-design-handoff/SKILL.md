---
name: figma-design-handoff
description:
  Analyzes Figma designs and guides implementation for Stellar Lab. Use when
  user shares a Figma URL, uploads a .fig file, or asks to "implement this
  design", "generate design specs", or "create a component from Figma". Prefer
  dev mode links (m=dev) for structured spec extraction.
---

# Figma Design Handoff Workflow

Guides structured implementation from Figma designs into Stellar Lab components.

## Step 1: Extract Specs

Fetch design tokens, layout, and component hierarchy from the Figma link via
Figma MCP.

## Step 2: Map to Stellar Lab Conventions

Identify how extracted components map to existing Stellar Lab patterns and
styles.

## Step 3: Generate Implementation

Produce component code matching the Figma spec and Stellar Lab conventions.

## Design System

Source: https://github.com/stellar/stellar-design-system

Key paths to reference during implementation:

- Components: `/packages/design-system/src/components/`
- Tokens: `/packages/design-system/src/styles/`

Fetch raw content via:
`https://raw.githubusercontent.com/stellar/stellar-design-system/main/<path>`

## Examples

### Implement a design

User says: "Implement this design from Figma."
`https://www.figma.com/design/9j3YQ5URseAsn3j0tf2FFq/Laboratory?node-id=5698-142554&m=dev`

Actions:

1. Extract specs via Figma MCP using the node-id
2. Map to existing Stellar Lab component patterns
3. Generate implementation

Result: Component code matching the Figma spec
