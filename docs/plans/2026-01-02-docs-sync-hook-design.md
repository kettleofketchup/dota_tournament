# Documentation Sync Hook Design

## Overview

Create a Claude Code hook that reminds developers to update documentation when invoke tasks are modified.

## Problem

When `tasks.py` or `scripts/*.py` files are modified, documentation often gets out of sync:
- `docs/development/invoke-tasks.md`
- `docs/architecture/docker.md`
- `README.md`
- `.claude/CLAUDE.md`

## Solution

### 1. Claude Code Hook

**Location:** `.claude/hooks/check-docs-sync.sh`

Triggers on `PostToolUse` for `Edit|Write` operations. Checks if the modified file is related to invoke tasks and reminds the developer to update documentation.

### 2. Hook Configuration

**Location:** `.claude/settings.json`

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash \"$CLAUDE_PROJECT_DIR/.claude/hooks/check-docs-sync.sh\""
          }
        ]
      }
    ]
  }
}
```

### 3. CLAUDE.md Updates

Add rules about agent consultation when modifying scripts.

## Files to Update

| File | Changes |
|------|---------|
| `docs/development/invoke-tasks.md` | Add new env commands |
| `docs/architecture/docker.md` | Add env commands to operations section |
| `README.md` | Add environment management section |
| `.claude/CLAUDE.md` | Add agent consultation rules |
| `.claude/hooks/check-docs-sync.sh` | New hook script |
| `.claude/settings.json` | New hook configuration |

## New Commands to Document

```bash
# Environment Management (dev, test, prod)
inv dev.up / inv dev.down / inv dev.logs / inv dev.ps
inv dev.restart / inv dev.stop / inv dev.build / inv dev.pull
inv dev.top / inv dev.exec <service> <cmd>

# Same pattern for test.* and prod.*
```
