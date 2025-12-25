---
title: "Bash Environment & Aliases"
description: "Manage environment variables, PATH, and create useful bash aliases."
date: "2025-09-11"
tags: ["bash", "shell", "productivity"]
category: "Tools"
---

## View all environment variables

```bash
printenv
```

Or:

```bash
env
```

## View specific variable

```bash
echo $PATH
```

## Set environment variable (current session)

```bash
export MY_VAR="value"
```

## Add to PATH

```bash
export PATH="$PATH:/new/directory"
```

## Make permanent (add to ~/.bashrc)

```bash
echo 'export PATH="$PATH:/new/directory"' >> ~/.bashrc
```

## Reload .bashrc

```bash
source ~/.bashrc
```

## Create alias

Add to `~/.bashrc` or `~/.bash_aliases`:

```bash
alias ll='ls -lah'
alias gs='git status'
alias gp='git pull'
alias dc='docker-compose'
```

## Useful aliases

```bash
# Navigation
alias ..='cd ..'
alias ...='cd ../..'

# Safety
alias rm='rm -i'
alias cp='cp -i'
alias mv='mv -i'

# Quick edits
alias bashrc='vim ~/.bashrc'
alias reload='source ~/.bashrc'

# System
alias ports='netstat -tuln'
alias df='df -h'
alias free='free -h'

# Docker shortcuts
alias dps='docker ps'
alias dlog='docker logs -f'
alias dexec='docker exec -it'
```

## Function example

Add to `~/.bashrc`:

```bash
# Create directory and cd into it
mkcd() {
    mkdir -p "$1" && cd "$1"
}

# Git commit and push
gcp() {
    git add .
    git commit -m "$1"
    git push
}
```

## Check if command exists

```bash
command -v docker >/dev/null 2>&1 && echo "Docker installed" || echo "Docker not found"
```

## List all aliases

```bash
alias
```

## Remove alias (current session)

```bash
unalias ll
```
