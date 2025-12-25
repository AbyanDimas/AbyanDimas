---
title: "How to Fix Common Git Errors: Permission Denied, Push Rejected, Merge Conflicts"
date: "2025-08-14"
author: "Abyan Dimas"
excerpt: "Complete guide to fixing Git errors in production. Solve permission denied, push rejected, detached HEAD, and merge conflicts with proven solutions."
coverImage: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?q=80&w=1200&auto=format&fit=crop"
---

![Git Version Control](https://images.unsplash.com/photo-1556075798-4825dfaaf498?q=80&w=1200&auto=format&fit=crop)

## The Problem: Git Operations Failing

You're deploying code, pulling updates, or pushing commits and Git throws errors that block your workflow.

Common scenarios:
- Can't clone a repository
- Push rejected despite having commits
- In detached HEAD state and don't know how to recover
- Merge conflicts preventing deployment

**This guide solves them all.**

---

## Error #1: Permission Denied (publickey)

### Symptom

```bash
$ git clone git@github.com:user/repo.git
Cloning into 'repo'...
git@github.com: Permission denied (publickey).
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.
```

### Root Cause

Git is trying to authenticate via SSH but:
1. SSH key doesn't exist on your machine
2. SSH key exists but not added to GitHub/GitLab
3. SSH key exists but not loaded in SSH agent

### Step 1: Check if SSH Key Exists

```bash
ls -la ~/.ssh/
```

Look for:
- `id_rsa` and `id_rsa.pub` (RSA key)
- `id_ed25519` and `id_ed25519.pub` (Ed25519 key, recommended)

If missing, create one:

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
# Press Enter to accept defaults
```

### Step 2: Add SSH Key to SSH Agent

```bash
# Start SSH agent
eval "$(ssh-agent -s)"

# Add key
ssh-add ~/.ssh/id_ed25519
```

### Step 3: Add Public Key to GitHub/GitLab

Copy your public key:

```bash
cat ~/.ssh/id_ed25519.pub
```

Output:
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIAbcdef... your_email@example.com
```

**GitHub:**
1. Go to Settings → SSH and GPG keys
2. Click "New SSH key"
3. Paste the public key
4. Save

**GitLab:**
Same process, but in GitLab settings.

### Step 4: Test Connection

```bash
# GitHub
ssh -T git@github.com

# GitLab
ssh -T git@gitlab.com
```

**Success output:**
```
Hi username! You've successfully authenticated, but GitHub does not provide shell access.
```

### Step 5: Clone Again

```bash
git clone git@github.com:user/repo.git
```

### Alternative: Use HTTPS Instead

If SSH is problematic (firewalls, etc.), use HTTPS:

```bash
git clone https://github.com/user/repo.git
```

You'll be prompted for username/password (or personal access token).

---

## Error #2: Git Push Rejected

### Symptom

```bash
$ git push origin main
To github.com:user/repo.git
 ! [rejected]        main -> main (fetch first)
error: failed to push some refs to 'github.com:user/repo.git'
hint: Updates were rejected because the remote contains work that you do
hint: not have locally. This is usually caused by another repository pushing
hint: to the same ref. You may want to first integrate the remote changes
hint: (e.g., 'git pull ...') before pushing again.
```

### Root Cause

Someone else pushed commits to the remote branch **after** you pulled. Your local branch is behind.

### Step 1: Check Status

```bash
git status
```

Output:
```
On branch main
Your branch and 'origin/main' have diverged,
and have 2 and 3 different commits each, respectively.
```

### Step 2: Fetch Remote Changes

```bash
git fetch origin
```

This downloads commits from remote without merging.

### Step 3: Check What You'd Be Merging

```bash
git log HEAD..origin/main --oneline
```

This shows commits on remote that you don't have locally.

### Step 4: Merge or Rebase

**Option A: Merge** (Preserves history, creates merge commit)

```bash
git pull origin main
# or explicitly
git merge origin/main
```

If there are conflicts, see "Error #5" below.

**Option B: Rebase** (Linear history, cleaner but rewrites commits)

```bash
git pull --rebase origin main
# or explicitly
git rebase origin/main
```

**When to use what?**
- **Merge**: Default, safe, preserves full history
- **Rebase**: If you want clean linear history and your commits are not yet pushed

### Step 5: Push

```bash
git push origin main
```

### Force Push (Dangerous!)

If you're **absolutely sure** you want to overwrite remote:

```bash
# DANGER: This deletes other people's commits
git push --force origin main

# Safer alternative (rejects if remote has unexpected commits)
git push --force-with-lease origin main
```

**Never force push to shared branches (main, develop) in team environments.**

---

## Error #3: Fatal: Not a Git Repository

### Symptom

```bash
$ git status
fatal: not a git repository (or any of the parent directories): .git
```

### Root Cause

You're not inside a Git repository. The `.git` directory is missing or you're in the wrong folder.

### Step 1: Check Current Directory

```bash
pwd
ls -la
```

Look for `.git` directory. If missing, you're not in a repo.

### Step 2: Navigate to Repository

```bash
cd /path/to/your/repo
git status
```

### Step 3: Or Initialize New Repo

If this is a new project:

```bash
git init
git add .
git commit -m "Initial commit"
```

### Step 4: Connect to Remote

```bash
git remote add origin git@github.com:user/repo.git
git push -u origin main
```

### Common Mistake: Nested Repositories

You might have accidentally run `git init` in a parent directory of an existing repo, creating nested Git repositories.

**Check:**
```bash
find . -name ".git" -type d
```

If you see multiple `.git` directories, you have nested repos. Remove the unwanted one:

```bash
rm -rf /path/to/unwanted/.git
```

---

## Error #4: Detached HEAD State

### Symptom

```bash
$ git status
HEAD detached at abc1234
nothing to commit, working tree clean
```

Or:

```bash
$ git checkout abc1234
Note: switching to 'abc1234'.

You are in 'detached HEAD' state.
```

### What is Detached HEAD?

Normally, HEAD points to a **branch** (like `main`). In detached HEAD, HEAD points directly to a **commit** (not a branch).

This happens when you:
- `git checkout <commit-hash>`
- `git checkout <tag>`
- Rebase operations gone wrong

**Problem**: Commits made in this state are "orphaned" and will be lost if you switch branches without creating a reference.

### Step 1: Check Status

```bash
git status
```

Output shows:
```
HEAD detached at abc1234
```

### Step 2: Decide What to Do

**Scenario A: You haven't made commits, just switch back**

```bash
git checkout main
```

**Scenario B: You made commits and want to keep them**

Create a branch from current position:

```bash
git branch temp-branch
git checkout temp-branch
# or combine both
git switch -c temp-branch
```

Now merge into main:

```bash
git checkout main
git merge temp-branch
git branch -d temp-branch  # Delete temp branch
```

**Scenario C: You made commits but want to discard them**

Just switch back:

```bash
git checkout main
# Commits in detached HEAD are abandoned (they'll be garbage collected eventually)
```

### Step 3: Verify

```bash
git status
# On branch main
# nothing to commit, working tree clean
```

### Prevention

Avoid checking out commit hashes directly. If you need to inspect old code:

```bash
# Instead of:
git checkout abc1234

# Do:
git checkout -b temp-inspect abc1234
# Now you're on a branch, not detached
```

---

## Error #5: Merge Conflict

### Symptom

```bash
$ git merge feature-branch
Auto-merging src/app.js
CONFLICT (content): Merge conflict in src/app.js
Automatic merge failed; fix conflicts and then commit the result.
```

### Root Cause

Git can't automatically merge because the same lines were modified in both branches differently.

### Step 1: Identify Conflicted Files

```bash
git status
```

Output:
```
On branch main
You have unmerged paths.
  (fix conflicts and run "git commit")

Unmerged paths:
  (use "git add <file>..." to mark resolution)
        both modified:   src/app.js
```

### Step 2: Open Conflicted File

```bash
cat src/app.js
```

You'll see conflict markers:

```javascript
function greet() {
<<<<<<< HEAD
    console.log("Hello from main");
=======
    console.log("Hello from feature");
>>>>>>> feature-branch
}
```

**Explanation:**
- `<<<<<<< HEAD` - Your current branch version
- `=======` - Separator
- `>>>>>>> feature-branch` - Incoming changes

### Step 3: Resolve Conflict Manually

Edit the file, decide which version to keep (or combine both):

**Option A: Keep main version**
```javascript
function greet() {
    console.log("Hello from main");
}
```

**Option B: Keep feature version**
```javascript
function greet() {
    console.log("Hello from feature");
}
```

**Option C: Combine both**
```javascript
function greet() {
    console.log("Hello from main and feature");
}
```

**Remove conflict markers** (`<<<<<<<`, `=======`, `>>>>>>>`).

### Step 4: Mark as Resolved

```bash
git add src/app.js
```

### Step 5: Complete Merge

```bash
git commit
# Git will open editor with pre-filled merge commit message
# Save and exit
```

Or provide message directly:

```bash
git commit -m "Merge feature-branch, resolved conflicts in app.js"
```

### Step 6: Verify

```bash
git status
# On branch main
# nothing to commit, working tree clean

git log --oneline -5
# Shows merge commit
```

### Using Merge Tools

Instead of manual editing, use a visual merge tool:

```bash
# Configure merge tool (one-time setup)
git config --global merge.tool vimdiff

# Resolve conflicts
git mergetool
```

Other tools: `meld`, `kdiff3`, `Beyond Compare`, VS Code.

### Aborting Merge

If you want to cancel the merge:

```bash
git merge --abort
```

This returns you to pre-merge state.

---

## Error #6: Push Rejected (Non-Fast-Forward)

### Symptom

```bash
$ git push origin main
To github.com:user/repo.git
 ! [rejected]        main -> main (non-fast-forward)
error: failed to push some refs to 'github.com:user/repo.git'
hint: Updates were rejected because the tip of your current branch is behind
hint: its remote counterpart.
```

### Root Cause

Similar to Error #2, but specifically means you need to incorporate remote changes first.

### Solution

```bash
# Fetch and merge
git pull origin main

# Resolve conflicts if any (see Error #5)

# Push again
git push origin main
```

---

## Error #7: Authentication Failed (HTTPS)

### Symptom

```bash
$ git push origin main
Username for 'https://github.com': yourname
Password for 'https://yourname@github.com':
remote: Support for password authentication was removed on August 13, 2021.
fatal: Authentication failed
```

### Root Cause

GitHub (and GitLab) no longer accept passwords for HTTPS. You need a **Personal Access Token** (PAT).

### Step 1: Create Personal Access Token

**GitHub:**
1. Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token
3. Select scopes: `repo` (full control of private repositories)
4. Copy token (save it somewhere, you won't see it again)

### Step 2: Use Token as Password

```bash
git push origin main
# Username: yourname
# Password: <paste-token-here>
```

### Step 3: Cache Credentials

To avoid re-entering token:

```bash
# Cache for 1 hour (3600 seconds)
git config --global credential.helper 'cache --timeout=3600'

# Or store permanently (less secure)
git config --global credential.helper store
```

### Alternative: Switch to SSH

```bash
# Check current remote
git remote -v
# origin  https://github.com/user/repo.git (fetch)

# Change to SSH
git remote set-url origin git@github.com:user/repo.git

# Verify
git remote -v
# origin  git@github.com:user/repo.git (fetch)
```

---

## Common Mistakes and Best Practices

### Mistake #1: Force Pushing to Shared Branches

**Never do:**
```bash
git push --force origin main
```

On team projects, this **deletes other people's work**.

**Correct approach:**
```bash
# Always pull first
git pull origin main

# Then push
git push origin main
```

### Mistake #2: Committing Secrets

```bash
# Accidentally committed .env file with API keys
git add .env
git commit -m "Add env"
```

**Damage control:**

```bash
# Remove from last commit (if not yet pushed)
git rm --cached .env
git commit --amend --no-edit

# Add to .gitignore
echo ".env" >> .gitignore
git add .gitignore
git commit -m "Ignore .env"
```

If already pushed, the secret is compromised. **Rotate the key immediately.**

### Mistake #3: Not Using `.gitignore`

Always ignore:
- Dependencies (`node_modules/`, `vendor/`)
- Build artifacts (`dist/`, `build/`, `*.o`)
- Environment files (`.env`)
- IDE files (`.vscode/`, `.idea/`)

**Create `.gitignore`:**
```bash
# .gitignore
node_modules/
.env
dist/
*.log
.DS_Store
```

### Mistake #4: Huge Commits

**Bad:**
```bash
git add .
git commit -m "stuff"
```

**Good:**
```bash
# Commit logical chunks
git add src/feature-a.js
git commit -m "feat: implement feature A"

git add src/feature-b.js
git commit -m "feat: implement feature B"
```

---

## Git Workflow Best Practices

### 1. Feature Branch Workflow

```bash
# Create feature branch
git checkout -b feature/user-auth

# Make commits
git add .
git commit -m "feat: add user authentication"

# Before merging, update from main
git checkout main
git pull origin main
git checkout feature/user-auth
git rebase main

# Merge
git checkout main
git merge feature/user-auth
git push origin main

# Delete feature branch
git branch -d feature/user-auth
```

### 2. Commit Message Convention

Use conventional commits:

```bash
feat: add new feature
fix: fix bug
docs: update documentation
style: code formatting
refactor: code refactoring
test: add tests
chore: maintenance tasks
```

### 3. Always Pull Before Push

```bash
# Good habit
git pull origin main
git push origin main
```

### 4. Use `git status` Frequently

Before committing:

```bash
git status
# Check what you're about to commit

git diff
# See exact changes
```

### 5. Protect Main Branch

On GitHub/GitLab, enable **branch protection**:
- Require pull request reviews
- Require status checks to pass
- Prevent force push

---

## Quick Reference: Git Recovery Commands

```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Undo changes to a file
git checkout -- filename

# Revert a pushed commit (safe, creates new commit)
git revert <commit-hash>

# Recover deleted branch
git reflog
git checkout -b recovered-branch <commit-hash>

# Clean untracked files
git clean -fd

# Stash current changes
git stash
git stash pop

# View commit history
git log --oneline --graph --all
```

---

## Troubleshooting Workflow

When Git operation fails:

1. Read the error message carefully
2. Run `git status` to understand current state
3. Check remote status: `git fetch && git status`
4. If authentication issue: check SSH keys or tokens
5. If merge issue: read conflict markers, resolve manually
6. If push rejected: pull first, then push
7. Always test on a backup branch if unsure

---

## Conclusion

Git errors are **fixable** once you understand what they mean:

- **Permission denied**: SSH key or token issue
- **Push rejected**: Need to pull remote changes first
- **Detached HEAD**: Create a branch from current position
- **Merge conflict**: Manually edit, remove markers, commit

**Master these patterns and Git becomes a reliable tool, not a source of panic.**

> **Pro Tip**: Before any destructive operation (`reset --hard`, `force push`), create a backup branch: `git branch backup`. You can always recover from backup if things go wrong.
