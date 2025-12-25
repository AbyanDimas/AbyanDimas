---
title: "Git Stash Management"
description: "Save and manage uncommitted changes with git stash."
date: "2025-10-25"
tags: ["git", "stash", "workflow"]
category: "Git"
---

## Stash current changes

```bash
git stash
```

## Stash with message

```bash
git stash save "Work in progress on feature X"
```

## Stash including untracked files

```bash
git stash -u
```

## Stash including ignored files

```bash
git stash -a
```

## Stash only staged changes

```bash
git stash --staged
```

## List stashes

```bash
git stash list
```

## Show stash contents

```bash
git stash show
```

## Show stash diff

```bash
git stash show -p
```

## Show specific stash

```bash
git stash show stash@{1}
```

## Apply latest stash

```bash
git stash apply
```

## Apply specific stash

```bash
git stash apply stash@{2}
```

## Apply and remove stash (pop)

```bash
git stash pop
```

## Pop specific stash

```bash
git stash pop stash@{1}
```

## Create branch from stash

```bash
git stash branch new-branch-name
```

## Drop specific stash

```bash
git stash drop stash@{1}
```

## Clear all stashes

```bash
git stash clear
```

## Stash partial changes

```bash
git stash -p
```

Interactive mode - choose hunks to stash:
- `y` - stash this hunk
- `n` - don't stash
- `q` - quit
- `a` - stash this and all remaining
- `s` - split hunk

## Apply stash to different branch

```bash
# Create new branch
git checkout -b new-feature

# Apply stash
git stash apply stash@{0}
```

## Stash with keep index

```bash
git stash --keep-index
```

## View stash as patch

```bash
git stash show -p stash@{0} > stash.patch
```

## Apply patch

```bash
git apply stash.patch
```

## Stash specific files

```bash
git stash push -m "message" file1.txt file2.txt
```

## Stash everything except specific files

```bash
git stash push --all -- ':!file-to-keep.txt'
```

## Check if stash is needed

```bash
git diff-index --quiet HEAD || echo "You have uncommitted changes"
```

## View stash stats

```bash
git stash show --stat
```

## Common workflow

```bash
# Working on feature, need to switch to hotfix
git stash save "WIP: feature X"

# Switch to main branch
git checkout main

# Create hotfix branch
git checkout -b hotfix

# ... make hotfix ...

# Back to feature
git checkout feature-branch
git stash pop
```

## Stash automation script

```bash
#!/bin/bash
# Auto-stash before checkout

BRANCH=$1
if [ -n "$(git status --porcelain)" ]; then
    echo "Stashing changes..."
    git stash save "Auto-stash before switching to $BRANCH"
    git checkout $BRANCH
    echo "To restore: git stash pop"
else
    git checkout $BRANCH
fi
```

## Interactive stash selection

```bash
# Using fzf (if installed)
git stash list | fzf | cut -d: -f1 | xargs git stash show -p
```

## Recover dropped stash

```bash
# List all unreachable commits
git fsck --unreachable | grep commit

# View commit
git show <commit-hash>

# Recover as stash
git stash apply <commit-hash>
```

## Stash naming convention

```bash
git stash save "feature/login: WIP on OAuth integration"
git stash save "bugfix/user-api: Testing DB connection"
git stash save "chore/docs: Update README"
```

## Compare stashes

```bash
git diff stash@{0} stash@{1}
```

## Stash in script

```bash
#!/bin/bash
# Safely stash, run command, then restore

STASH_NAME="auto-stash-$$"

# Stash if there are changes
if ! git diff-index --quiet HEAD; then
    git stash save "$STASH_NAME"
    STASHED=1
fi

# Run your command
./run-tests.sh

# Restore if we stashed
if [ "$STASHED" = "1" ]; then
    git stash pop
fi
```

## Best practices

```bash
# Always use descriptive messages
git stash save "Detailed description of what's stashed"

# Review stash before popping
git stash show -p

# Clean up old stashes
git stash list
git stash drop stash@{5}

# Use stash for quick experiments
git stash
# try something
git stash pop
```
