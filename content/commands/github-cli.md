---
title: "GitHub CLI (gh)"
description: "Manage GitHub repositories, issues, and PRs from the command line."
date: "2025-09-27"
tags: ["github", "git", "cli"]
category: "Git"
---

## Install GitHub CLI

```bash
# macOS
brew install gh

# Ubuntu/Debian
sudo apt install gh
```

## Authenticate

```bash
gh auth login
```

## Clone repository

```bash
gh repo clone owner/repo
```

## Create repository

```bash
gh repo create my-new-repo --public
```

## View repository

```bash
gh repo view
```

## List repositories

```bash
gh repo list
```

## Create issue

```bash
gh issue create --title "Bug: Login fails" --body "Description here"
```

## List issues

```bash
gh issue list
```

## View issue

```bash
gh issue view 123
```

## Close issue

```bash
gh issue close 123
```

## Create pull request

```bash
gh pr create --title "Add new feature" --body "Description"
```

## List pull requests

```bash
gh pr list
```

## Checkout PR locally

```bash
gh pr checkout 456
```

## View PR

```bash
gh pr view 456
```

## Merge PR

```bash
gh pr merge 456
```

## Review PR

```bash
gh pr review 456 --approve
```

## List releases

```bash
gh release list
```

## Create release

```bash
gh release create v1.0.0 --title "Version 1.0.0" --notes "Release notes"
```

## Download release asset

```bash
gh release download v1.0.0
```

## View workflow runs

```bash
gh run list
```

## View workflow run

```bash
gh run view 789
```

## Trigger workflow

```bash
gh workflow run deploy.yml
```

## List gists

```bash
gh gist list
```

## Create gist

```bash
gh gist create file.txt
```

## Fork repository

```bash
gh repo fork owner/repo
```

## Browse repository on GitHub

```bash
gh browse
```

## Search repositories

```bash
gh search repos "react hooks"
```

## Search issues

```bash
gh search issues "bug label:frontend"
```
