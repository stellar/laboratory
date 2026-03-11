#!/bin/bash
# Detects Figma-related requests and injects context to use the figma-design-handoff skill

INPUT=$(cat)
PROMPT=$(echo "$INPUT" | jq -r '.prompt // empty')

if echo "$PROMPT" | grep -qiE 'figma\.com|\.fig\b|figma.*(design|implement|spec|handoff)|implement.*(design|figma)|design.*(spec|handoff)'; then
  cat <<'EOF'
{
  "hookSpecificOutput": {
    "hookEventName": "UserPromptSubmit",
    "additionalContext": "The user is requesting a Figma design handoff. Use the figma-design-handoff skill (invoke via /figma-design-handoff) to extract specs via Figma MCP, map to Stellar Lab conventions, and generate implementation code."
  }
}
EOF
  exit 0
fi

exit 0
