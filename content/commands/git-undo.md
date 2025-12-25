---
title: "Git Undo Cheat Sheet"
description: "How to undo mistakes in Git at various stages."
date: "2025-08-22"
tags: ["git", "version-control"]
category: "Git"
---

## Undo 'git add'

Unstage a file but keep changes in working directory.

```bash
git reset HEAD <file>
```

## Undo local changes (Discard file)

Revert file to state in last commit.

```bash
git checkout -- <file>
```

## Undo last commit (Keep changes)

Soft reset moves HEAD back one step but keeps changes staged.

```bash
git reset --soft HEAD~1
```

## Undo last commit (Discard changes)

Hard reset moves HEAD back and deletes changes. **Dangerous.**

```bash
git reset --hard HEAD~1
```

## Change last commit message

```bash
git commit --amend -m "New message"
```
