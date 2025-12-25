---
title: "Git Rebase Interactive"
description: "Rewrite Git history with interactive rebase."
date: "2025-10-26"
tags: ["git", "rebase", "workflow"]
category: "Git"
---

## Basic rebase

```bash
git rebase main
```

## Interactive rebase (last 5 commits)

```bash
git rebase -i HEAD~5
```

## Interactive rebase from branch point

```bash
git rebase -i main
```

## Rebase commands

In the interactive editor:

```
pick   = use commit
reword = use commit, edit message
edit   = use commit, stop for amending
squash = use commit, meld into previous
fixup  = like squash, discard message
drop   = remove commit
```

## Squash commits

```bash
# Interactive rebase
git rebase -i HEAD~3
```

Change `pick` to `squash` or `s`:
```
pick abc123 First commit
squash def456 Second commit
squash ghi789 Third commit
```

## Fixup commits (no message edit)

```
pick abc123 Add feature
fixup def456 Fix typo
fixup ghi789 Fix another typo
```

## Reword commit message

```bash
git rebase -i HEAD~1
```

Change `pick` to `reword`:
```
reword abc123 Old message
```

## Edit commit

```bash
git rebase -i HEAD~2
```

Change `pick` to `edit`:
```
edit abc123 Commit to modify
pick def456 Next commit
```

Then make changes:
```bash
# Make your changes
git add .
git commit --amend
git rebase --continue
```

## Reorder commits

Simply reorder lines in interactive editor:
```
pick def456 Second commit
pick abc123 First commit
pick ghi789 Third commit
```

## Drop/delete commits

Change `pick` to `drop` or delete the line:
```
pick abc123 Keep this
drop def456 Remove this
pick ghi789 Keep this
```

## Abort rebase

```bash
git rebase --abort
```

## Continue after resolving conflicts

```bash
# Fix conflicts
git add <resolved-files>
git rebase --continue
```

## Skip commit during rebase

```bash
git rebase --skip
```

## Rebase onto different base

```bash
git rebase --onto new-base old-base feature-branch
```

## Autosquash

Create fixup commits:
```bash
git commit --fixup abc123
```

Then rebase with autosquash:
```bash
git rebase -i --autosquash main
```

## Preserve merge commits

```bash
git rebase -p main
```

Or in newer Git:
```bash
git rebase --rebase-merges main
```

## Interactive rebase script

```bash
#!/bin/bash
# Automatically squash last N commits

N=${1:-5}
GIT_SEQUENCE_EDITOR="sed -i '2,\$s/^pick/squash/'" git rebase -i HEAD~$N
```

## Split a commit

```bash
git rebase -i HEAD~1
```

Mark as `edit`, then:
```bash
git reset HEAD^
git add file1.txt
git commit -m "First part"
git add file2.txt
git commit -m "Second part"
git rebase --continue
```

## Rebase current branch onto main

```bash
# Update main
git checkout main
git pull

# Rebase feature branch
git checkout feature-branch
git rebase main
```

## Handle conflicts

```bash
# During rebase, conflicts occur
git status

# Fix conflicts in files
vim conflicted-file.txt

# Mark as resolved
git add conflicted-file.txt

# Continue rebase
git rebase --continue
```

## Rebase vs merge

```bash
# Merge (preserves history)
git merge feature-branch

# Rebase (clean linear history)
git rebase feature-branch
```

## Force push after rebase

```bash
# WARNING: Rewrites history
git push --force-with-lease
```

## Safer force push

```bash
git push --force-with-lease origin feature-branch
```

## Rebase strategy options

```bash
# Use specific strategy
git rebase -s recursive -X theirs main

# Strategies:
# -X ours    = prefer current branch
# -X theirs  = prefer other branch
```

## Rebase with gpg signing

```bash
git rebase -i --gpg-sign HEAD~5
```

## View rebase in progress

```bash
cat .git/rebase-merge/git-rebase-todo
```

## Common workflow: Clean up before PR

```bash
# You have messy commits
git log --oneline -10

# Interactive rebase
git rebase -i HEAD~10

# Squash WIP commits
# Reword unclear messages
# Drop debugging commits

# Force push to PR branch
git push --force-with-lease
```

## Rebase entire branch

```bash
# Rebase all commits since branching from main
git rebase -i $(git merge-base HEAD main)
```

## Best practices

```bash
# 1. Never rebase public/shared branches
# 2. Always use --force-with-lease
# 3. Test after interactive rebase
# 4. Keep atomic commits
# 5. Write clear commit messages

# Good commit history
git log --oneline
# abc123 Add user authentication
# def456 Add password validation
# ghi789 Add email verification

# Bad commit history (needs rebase)
git log --oneline
# abc123 WIP
# def456 Fix typo
# ghi789 More fixes
# jkl012 Actually working now
```

## Emergency: Recover from bad rebase

```bash
# Find previous state
git reflog

# Reset to before rebase
git reset --hard HEAD@{5}
```

## Rebase hook

Create `.git/hooks/pre-rebase`:
```bash
#!/bin/bash
BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [ "$BRANCH" = "main" ] || [ "$BRANCH" = "master" ]; then
    echo "ERROR: Never rebase main/master branch!"
    exit 1
fi
```

```bash
chmod +x .git/hooks/pre-rebase
```
