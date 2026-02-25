---
name: "git-best-practices"
displayName: "Git Best Practices"
description: "Essential Git workflows and best practices for clean commit history, effective branching, and team collaboration."
keywords: ["git", "version-control", "commit", "branch", "workflow"]
author: "Kiro Example"
---

# Git Best Practices

## Overview

This power provides essential Git best practices for developers working in teams or solo projects. Learn how to maintain a clean commit history, use effective branching strategies, and collaborate smoothly with your team.

Whether you're new to Git or looking to refine your workflow, these practices will help you avoid common pitfalls and work more efficiently with version control.

## Core Principles

### 1. Commit Often, Commit Smart
- Make small, focused commits that do one thing
- Each commit should be a logical unit of work
- Commit working code - don't break the build

### 2. Write Clear Commit Messages
- Use present tense: "Add feature" not "Added feature"
- First line: brief summary (50 chars or less)
- Blank line, then detailed explanation if needed
- Reference issue numbers when applicable

### 3. Keep History Clean
- Use meaningful branch names
- Rebase feature branches before merging
- Squash commits when appropriate
- Avoid merge commits in feature branches

## Common Workflows

### Workflow 1: Feature Development

**Goal:** Develop a new feature with clean history

**Steps:**
```bash
# 1. Create feature branch from main
git checkout main
git pull origin main
git checkout -b feature/user-authentication

# 2. Make changes and commit
git add src/auth/
git commit -m "Add user authentication module"

# 3. Keep branch updated with main
git fetch origin
git rebase origin/main

# 4. Push to remote
git push origin feature/user-authentication

# 5. Create pull request (via GitHub/GitLab UI)
```

### Workflow 2: Fixing Mistakes

**Undo last commit (keep changes):**
```bash
git reset --soft HEAD~1
```

**Undo last commit (discard changes):**
```bash
git reset --hard HEAD~1
```

**Fix last commit message:**
```bash
git commit --amend -m "New commit message"
```

**Unstage files:**
```bash
git reset HEAD <file>
```

### Workflow 3: Clean Up Before Merge

**Goal:** Squash multiple commits into one clean commit

```bash
# Interactive rebase last 3 commits
git rebase -i HEAD~3

# In the editor, change 'pick' to 'squash' for commits to combine
# Save and close editor
# Edit the combined commit message
# Save and close

# Force push (only if branch not shared)
git push --force-with-lease origin feature/my-feature
```

## Best Practices by Category

### Commit Messages
✅ **Good:**
```
Add user authentication with JWT

- Implement login endpoint
- Add token validation middleware
- Create user session management

Fixes #123
```

❌ **Bad:**
```
fixed stuff
```

### Branch Naming
✅ **Good:**
- `feature/user-authentication`
- `bugfix/login-error`
- `hotfix/security-patch`
- `refactor/database-layer`

❌ **Bad:**
- `my-branch`
- `test`
- `new-stuff`

### When to Commit
✅ **Commit when:**
- Feature is complete and tested
- Bug fix is verified
- Refactoring is done and tests pass
- Before switching tasks

❌ **Don't commit:**
- Broken code
- Debug statements
- Commented-out code
- Temporary files

## Troubleshooting

### Problem: Merge Conflicts

**Symptoms:**
- Git reports conflicts during merge/rebase
- Files marked with conflict markers

**Solution:**
```bash
# 1. See conflicted files
git status

# 2. Open each file and resolve conflicts
# Look for <<<<<<, ======, >>>>>> markers
# Edit to keep desired changes

# 3. Mark as resolved
git add <resolved-file>

# 4. Continue merge/rebase
git rebase --continue
# or
git merge --continue
```

### Problem: Accidentally Committed to Wrong Branch

**Solution:**
```bash
# 1. Note the commit hash
git log -1

# 2. Undo the commit
git reset --hard HEAD~1

# 3. Switch to correct branch
git checkout correct-branch

# 4. Cherry-pick the commit
git cherry-pick <commit-hash>
```

### Problem: Need to Undo Pushed Commits

**Solution (if safe to rewrite history):**
```bash
# Reset to previous commit
git reset --hard <commit-hash>

# Force push
git push --force-with-lease origin branch-name
```

**Solution (if history must be preserved):**
```bash
# Create revert commit
git revert <commit-hash>

# Push normally
git push origin branch-name
```

## Quick Reference

### Essential Commands
| Command | Description |
|---------|-------------|
| `git status` | Check working directory status |
| `git log --oneline` | View commit history |
| `git diff` | See unstaged changes |
| `git diff --staged` | See staged changes |
| `git branch -a` | List all branches |
| `git fetch --prune` | Update remote tracking branches |

### Useful Aliases
Add to your `~/.gitconfig`:
```ini
[alias]
    st = status
    co = checkout
    br = branch
    ci = commit
    unstage = reset HEAD --
    last = log -1 HEAD
    visual = log --graph --oneline --all
```

## Additional Resources

- [Git Official Documentation](https://git-scm.com/doc)
- [Pro Git Book](https://git-scm.com/book/en/v2)
- [GitHub Flow Guide](https://guides.github.com/introduction/flow/)

---

**This is a Knowledge Base Power** - No MCP server required, pure documentation for better Git workflows.
