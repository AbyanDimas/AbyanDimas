---
title: "Source & Dot Command"
description: "Execute scripts in current shell with source and dot (.) commands."
date: "2025-12-06"
tags: ["source", "dot", "shell", "bash"]
category: "Tools"
---

## Source vs execution

```bash
# Execute in subshell (doesn't affect current shell)
./script.sh
bash script.sh

# Execute in current shell (affects current shell)
source script.sh
. script.sh
```

## Basic usage

```bash
# Both are equivalent
source ~/.bashrc
. ~/.bashrc

# Source with arguments
source script.sh arg1 arg2
. script.sh arg1 arg2
```

## Common use cases

### Reload shell configuration

```bash
# After editing ~/.bashrc
source ~/.bashrc

# Or with dot
. ~/.bashrc

# Zsh
source ~/.zshrc
```

### Load environment variables

```bash
# Load .env file
source .env
. .env

# Load with export
set -a
source .env
set +a
```

### Apply aliases/functions

```bash
# ~/.bash_aliases
alias ll='ls -lah'
alias gs='git status'

# Load
source ~/.bash_aliases
```

## Difference from execution

### Execution (./script.sh)

```bash
# script.sh
export VAR=value
cd /tmp

# Run
./script.sh
echo $VAR      # Empty (subshell)
pwd            # Original directory
```

### Source (source script.sh)

```bash
# script.sh
export VAR=value
cd /tmp

# Run
source script.sh
echo $VAR      # Shows 'value'
pwd            # Shows /tmp
```

## Return vs exit

```bash
# In sourced script
return 0  # Safe in sourced script
exit 0    # Exits shell! Dangerous when sourced
```

### Safe script

```bash
#!/bin/bash

# Check if sourced
if [ "${BASH_SOURCE[0]}" = "${0}" ]; then
    # Executed directly
    exit_cmd="exit"
else
    # Being sourced
    exit_cmd="return"
fi

# Later in script
$exit_cmd 0  # Safe in both cases
```

## Load configuration files

### User profile

```bash
# Login shells read (in order):
# /etc/profile
# ~/.bash_profile or ~/.bash_login or ~/.profile

# Interactive shells read:
# ~/.bashrc

# Force reload all
source /etc/profile
source ~/.bash_profile
source ~/.bashrc
```

### Project configuration

```bash
#!/bin/bash
# project-setup.sh

export PROJECT_ROOT=/path/to/project
export PATH=$PROJECT_ROOT/bin:$PATH
alias build='make -C $PROJECT_ROOT'
cd $PROJECT_ROOT

# Usage:
# source project-setup.sh
```

## Conditional sourcing

```bash
# Only if file exists
[ -f ~/.bash_custom ] && source ~/.bash_custom

# Or with test
if [ -f ~/.bash_aliases ]; then
    source ~/.bash_aliases
fi

# Multiple files
for file in ~/.bash_*; do
    [ -f "$file" ] && source "$file"
done
```

## Source in scripts

```bash
#!/bin/bash

# Load configuration
source /etc/myapp/config.sh

# Load  functions
source ./lib/functions.sh

# Use loaded config
echo "Database: $DB_HOST"

# Use loaded functions
my_function arg1 arg2
```

## Virtual environments

### Python

```bash
# Activate venv
source venv/bin/activate

# Or
. venv/bin/activate

# Deactivate (function loaded by activate)
deactivate
```

### Node.js (nvm)

```bash
# Load nvm
source ~/.nvm/nvm.sh

# Use
nvm use 16
```

## Function libraries

```bash
# lib/functions.sh
log_info() {
    echo "[INFO] $*"
}

log_error() {
    echo "[ERROR] $*" >&2
}

# Usage in script
source lib/functions.sh
log_info "Starting process"
log_error "Something went wrong"
```

## Configuration management

```bash
# config/development.sh
export DB_HOST=localhost
export DB_PORT=5432
export DEBUG=true

# config/production.sh
export DB_HOST=prod-db.example.com
export DB_PORT=5432
export DEBUG=false

# Load based on environment
ENV=${1:-development}
source "config/${ENV}.sh"
```

## Error handling

```bash
# Exit if source fails
source config.sh || exit 1

# With message
source config.sh || {
    echo "Failed to load config"
    exit 1
}

# Continue on error
source optional-config.sh 2>/dev/null || true
```

## Security considerations

```bash
# Always validate before sourcing
CONFIG_FILE="$1"

# Check exists
[ -f "$CONFIG_FILE" ] || {
    echo "Config file not found"
    exit 1
}

# Check ownership
[ "$(stat -c %U "$CONFIG_FILE")" = "root" ] || {
    echo "Config must be owned by root"
    exit 1
}

# Check permissions
[ "$(stat -c %a "$CONFIG_FILE")" = "600" ] || {
    echo "Config must be 600"
    exit 1
}

# Then source
source "$CONFIG_FILE"
```

## Common patterns

### Load all configs

```bash
# Load all .sh files in directory
for config in /etc/myapp/*.sh; do
    [ -f "$config" ] && source "$config"
done
```

### Cascade configuration

```bash
# Load in order (later override earlier)
source /etc/app/defaults.sh
source /etc/app/config.sh
source ~/.apprc
source ./.app-local
```

### Profile snippets

```bash
# ~/.bashrc
if [ -d ~/.bashrc.d ]; then
    for rc in ~/.bashrc.d/*.sh; do
        [ -f "$rc" ] && . "$rc"
    done
fi
unset rc
```

## Troubleshooting

### Variable not set

```bash
# Check if file was actually sourced
source script.sh
echo $?  # 0 = success

# Debug
set -x
source script.sh
set +x
```

### Path issues

```bash
# Use absolute path
source /absolute/path/to/script.sh

# Or relative to script location
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$DIR/lib/functions.sh"
```

### Already sourced check

```bash
# In script
if [ -n "$MYLIB_LOADED" ]; then
    return
fi
export MYLIB_LOADED=1

# Rest of script...
```

## Best practices

```bash
# 1. Use source for configuration
source ~/.bashrc
source .env

# 2. Use execution for actions
./build.sh
bash deploy.sh

# 3. Check before sourcing
[ -f config.sh ] && source config.sh

# 4. Use absolute paths in scripts
source "$(dirname "$0")/lib/functions.sh"

# 5. Document what's loaded
# Load database configuration
source config/database.sh

# 6. Handle errors
source critical-config.sh || exit 1
source optional-config.sh || true
```

## Quick reference

```bash
# Basic usage
source file.sh
. file.sh

# Common files
source ~/.bashrc          # Reload bash config
source ~/.bash_aliases    # Load aliases
source .env              # Load environment
source venv/bin/activate # Python venv

# Conditional  
[ -f file.sh ] && source file.sh

# With error handling
source file.sh || exit 1

# Check if sourced
if [ "${BASH_SOURCE[0]}" != "${0}" ]; then
    echo "Script is being sourced"
fi
```
