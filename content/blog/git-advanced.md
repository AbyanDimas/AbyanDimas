---
title: "Advanced Git: Rebase vs. Merge"
date: "2025-04-15"
author: "Abyan Dimas"
excerpt: "Keep your history clean. Understanding when to use `git merge` and when to reach for `git rebase`."
coverImage: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?q=80&w=1200&auto=format&fit=crop"
---

![Git Graph](https://images.unsplash.com/photo-1556075798-4825dfaaf498?q=80&w=1200&auto=format&fit=crop)

Git is more than just `commit` and `push`. As projects grow, history management becomes vital.

## The Merge Strategy

`git merge feature-branch`

*   **Pros**: Non-destructive. Preserves true history.
*   **Cons**: Creates "merge commits" that clutter the logs.

## The Rebase Strategy

`git rebase main`

*   **Pros**: Linear history. Looks like you coded everything sequentially. Easier to read.
*   **Cons**: destructive. Rewrites history. **NEVER rebase a public branch.**

## Cherry Picking

Sometimes you need just *one* specific commit from another branch, not the whole thing.

```bash
git cherry-pick <commit-hash>
```

This applies that specific change to your current branch. Useful for hotfixes.

## Interactive Rebase

The ultimate cleanup tool.

```bash
git rebase -i HEAD~3
```

This lets you squash typos, reorder commits, and edit messages before pushing.
