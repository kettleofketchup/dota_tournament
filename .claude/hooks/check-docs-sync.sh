#!/bin/bash
# Hook: Check if invoke tasks were modified and remind about documentation sync
#
# Triggers on PostToolUse for Edit|Write operations
# Checks if the modified file is tasks.py or scripts/*.py

read -r json_input

file_path=$(echo "$json_input" | jq -r '.tool_input.file_path // empty')

# Check if this is an invoke task file
if [[ "$file_path" == *"tasks.py"* ]] || [[ "$file_path" == *"scripts/"*".py" ]]; then
  echo ""
  echo "========================================"
  echo "Invoke tasks modified!"
  echo "========================================"
  echo ""
  echo "Consult these agents to update documentation:"
  echo "  - mkdocs-documentation: Update docs/development/invoke-tasks.md"
  echo "  - docker-ops: If docker-related, update docs/architecture/docker.md"
  echo ""
  echo "Files to check for consistency:"
  echo "  - docs/development/invoke-tasks.md"
  echo "  - docs/architecture/docker.md"
  echo "  - README.md"
  echo "  - .claude/CLAUDE.md"
  echo ""
fi

exit 0
