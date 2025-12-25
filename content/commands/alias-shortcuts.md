---
title: "Alias Custom Commands"
description: "Create command shortcuts and aliases in bash and zsh."
date: "2025-11-30"
tags: ["alias", "bash", "zsh"]
category: "Tools"
---

## Create alias

```bash
alias name='command'
alias ll='ls -lah'
alias update='sudo apt update && sudo apt upgrade'
```

## List aliases

```bash
alias
alias -p
```

## Remove alias

```bash
unalias name
unalias ll
```

## Remove all aliases

```bash
unalias -a
```

## Common aliases

### Navigation

```bash
alias ..='cd ..'
alias ...='cd ../..'
alias ....='cd ../../..'
alias ~='cd ~'
alias -- -='cd -'
```

### Listing

```bash
alias ls='ls --color=auto'
alias ll='ls -lh'
alias la='ls -lah'
alias l='ls -CF'
alias lt='ls -lhtr'  # Sort by time
alias lS='ls -lhSr'  # Sort by size
```

### Safety

```bash
alias rm='rm -i'
alias cp='cp -i'
alias mv='mv -i'
alias mkdir='mkdir -p'
```

### Git

```bash
alias g='git'
alias gs='git status'
alias ga='git add'
alias gc='git commit'
alias gp='git push'
alias gl='git log --oneline'
alias gd='git diff'
alias gco='git checkout'
alias gb='git branch'
```

### Docker

```bash
alias d='docker'
alias dc='docker-compose'
alias dps='docker ps'
alias di='docker images'
alias dex='docker exec -it'
alias dlog='docker logs -f'
```

### System

```bash
alias df='df -h'
alias du='du -h'
alias free='free -h'
alias top='htop'
alias ports='netstat -tuln'
```

## Make aliases permanent

### Bash

Add to `~/.bashrc`:
```bash
alias ll='ls -lah'
```

Then:
```bash
source ~/.bashrc
```

### Zsh

Add to `~/.zshrc`:
```bash
alias ll='ls -lah'
```

### Separate file

Create `~/.bash_aliases`:
```bash
# Navigation
alias ..='cd ..'

# Git
alias gs='git status'
```

Include in `~/.bashrc`:
```bash
if [ -f ~/.bash_aliases ]; then
    . ~/.bash_aliases
fi
```

## Aliases with arguments

```bash
# Wrong - arguments not supported directly
alias greet='echo Hello'  # Can't do: greet name

# Right - use function
greet() {
    echo "Hello $1"
}
```

## Functions (advanced aliases)

```bash
# In ~/.bashrc
mkcd() {
    mkdir -p "$1" && cd "$1"
}

extract() {
    if [ -f "$1" ]; then
        case "$1" in
            *.tar.gz) tar -xzf "$1" ;;
            *.zip) unzip "$1" ;;
            *.tar) tar -xf "$1" ;;
            *) echo "Unknown format" ;;
        esac
    fi
}

backup() {
    cp "$1" "$1.backup-$(date +%Y%m%d-%H%M%S)"
}
```

## Check if alias exists

```bash
alias name >/dev/null 2>&1 && echo "Exists" || echo "Not found"
```

## Temporarily bypass alias

```bash
# Use backslash
\ls  # Runs original ls, not alias

# Or full path
/bin/ls

# Or command
command ls
```

## Advanced aliases

### Conditional

```bash
# Different color for root
if [ "$UID" -eq 0 ]; then
    alias rm='rm -i'  # Force interactive for root
fi
```

### Platform-specific

```bash
case "$(uname)" in
    Linux*)  alias ls='ls --color=auto' ;;
   Darwin*) alias ls='ls -G' ;;
esac
```

### Colored output

```bash
alias grep='grep --color=auto'
alias fgrep='fgrep --color=auto'
alias egrep='egrep --color=auto'
alias diff='diff --color=auto'
```

## Productivity aliases

```bash
# Quick edit
alias bashrc='vim ~/.bashrc'
alias vimrc='vim ~/.vimrc'

# Reload shell 
alias reload='source ~/.bashrc'

# Clear screen
alias c='clear'
alias cls='clear'

# History
alias h='history'
alias hg='history | grep'

# Network
alias myip='curl ifconfig.me'
alias ports='netstat -tulanp'

# Processes
alias psg='ps aux | grep -v grep | grep -i -e VSZ -e'
```

## Best practices

```bash
# 1. Don't override system commands
# Bad: alias cd='cd && ls'
# Good: alias ll='cd && ls'

# 2. Use meaningful names
# Bad: alias a='git add .'
# Good: alias gaa='git add .'

# 3. Document complex aliases
# ~/.bash_aliases
# PDF viewer
alias pdf='evince'

# 4. Group by category
# === Git Aliases ===
alias gs='git status'
alias gp='git push'

# === Docker Aliases ===
alias dc='docker-compose'
```

## Example `.bash_aliases` file

```bash
# Navigation
alias ..='cd ..'
alias ...='cd ../..'
alias ~='cd ~'

# Listing
alias ll='ls -lah'
alias la='ls -A'
alias l='ls -CF'

# Safety
alias rm='rm -i'
alias cp='cp -i'
alias mv='mv -i'

# Git
alias gs='git status'
alias ga='git add'
alias gc='git commit'
alias gp='git push'
alias gl='git log --oneline'

# System
alias update='sudo apt update && sudo apt upgrade'
alias install='sudo apt install'
alias ports='netstat -tuln'

# Utilities
alias please='sudo'
alias week='date +%V'
alias timer='echo "Timer started. Stop with Ctrl-D." && date && time cat && date'
```

## Troubleshooting

### Alias not found

```bash
# Check if defined
type aliasname

# Reload bashrc
source ~/.bashrc

# Check syntax
# Ensure quotes match
alias name='command'  # Good
alias name=command    # May work but not recommended
```

### Alias not permanent

```bash
# Added to wrong file?
echo $SHELL  # Check your shell

# Bash: use ~/.bashrc
# Zsh: use ~/.zshrc

# Not sourced?
source ~/.bashrc
```
