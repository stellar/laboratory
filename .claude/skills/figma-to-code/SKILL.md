---
name: figma-to-code
description: Bridge Figma MCP output to Stellar Lab code conventions. Invoke after calling get_design_context to translate Figma's reference code into project-appropriate components, classes, and patterns.
read_files:
  - .claude/skills/figma-to-code/reference/*.md
---

# Figma to Code

## Purpose

The Figma MCP's `get_design_context` returns generic reference code (often plain
HTML/CSS). This skill bridges the gap between that output and the project's
actual conventions: `@stellar/design-system` components, SCSS with BEM-ish
naming, and specific layout patterns.

> For the full SDS component catalog, props, SCSS conventions, and usage
> examples, invoke `/component-guide`.

> For element mapping tables, spacing/layout patterns, and Figma variable
> mappings, see `reference/figma-mapping.md` (loaded automatically).

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
project's conventions using the mapping rules in `reference/figma-mapping.md`.

### 3. Verify against screenshot

After implementing, visually compare the rendered component against the Figma
screenshot. Focus on: layout, spacing, typography hierarchy, and interactive
states.

## Common Pitfalls

1. **Don't copy Figma's HTML structure literally** — Figma groups elements for
   design purposes, not component architecture. Think about what makes sense as
   React components.

2. **Don't use arbitrary colors** — Figma may show raw hex values. Map them to
   SDS color tokens (`--sds-clr-*`).

3. **Don't ignore interactive states** — Figma may show one state. Consider
   hover, focus, disabled, loading, and error states using design system props.
