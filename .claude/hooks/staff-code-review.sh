#!/bin/bash
# Detects code review requests and injects context to use the staff-code-review skill

INPUT=$(cat)
PROMPT=$(echo "$INPUT" | jq -r '.prompt // empty')

if echo "$PROMPT" | grep -qiE '\breview\b|code.?review|review.*(pr|pull|changes|code|files|diff)'; then
  cat <<'EOF'
{
  "hookSpecificOutput": {
    "hookEventName": "UserPromptSubmit",
    "additionalContext": "The user is requesting a code review. Use the staff-code-review skill (invoke via /staff-code-review) to perform a thorough, opinionated staff-engineer-level review. Read all changed files and their dependencies before reviewing. Structure findings by severity: Bugs > Design > Code Quality > Nits."
  }
}
EOF
  exit 0
fi

exit 0
