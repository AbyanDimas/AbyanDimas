---
title: "Environment Variables Management"
description: "View, set, and manage environment variables with env, printenv, export."
date: "2025-12-05"
tags: ["env", "printenv", "export", "environment"]
category: "Tools"
---

## View all environment variables

```bash
env
printenv
export -p  # With 'declare -x' format
```

## View specific variable

```bash
echo $VARIABLE
printenv VARIABLE
env | grep VARIABLE
```

## Set temporary variable (current shell)

```bash
VARIABLE=value

# Use in command
VARIABLE=value command

# Example
LANG=C ls /nonexistent
```

## Export variable (child processes)

```bash
export VARIABLE=value
export PATH=/new/path:$PATH

# Or two-step
VARIABLE=value
export VARIABLE
```

## Common environment variables

```bash
PATH          # Executable search path
HOME          # User home directory
USER          # Current username
SHELL         # Current shell
PWD           # Present working directory
OLDPWD        # Previous directory
LANG          # Language/locale
TERM          # Terminal type
EDITOR        # Default text editor
PAGER         # Default pager
PS1           # Primary shell prompt
```

## View values

```bash
echo $PATH
echo $HOME
echo $USER
printenv PATH HOME USER
```

## Modify PATH

```bash
# Append to PATH
export PATH=$PATH:/new/directory

# Prepend to PATH
export PATH=/new/directory:$PATH

# Replace PATH
export PATH=/usr/local/bin:/usr/bin:/bin
```

## Unset variable

```bash
unset VARIABLE
unset PATH  # Careful!
```

## Permanent environment variables

### User-specific (~/.bashrc or ~/.profile)

```bash
# Add to ~/.bashrc
export JAVA_HOME=/usr/lib/jvm/java-11
export PATH=$PATH:$JAVA_HOME/bin

# Apply changes
source ~/.bashrc
```

### System-wide (/etc/environment)

```bash
# Edit /etc/environment
sudo vim /etc/environment

# Add lines like:
JAVA_HOME="/usr/lib/jvm/java-11"
CUSTOM_VAR="value"

# Relogin or reboot
```

### Profile scripts

```bash
# /etc/profile.d/custom.sh
export CUSTOM_VAR=value

# Make executable
sudo chmod +x /etc/profile.d/custom.sh
```

## ENV vs PRINTENV

```bash
# printenv: Shows environment variables
printenv

# printenv with argument
printenv PATH

# env: Can run commands with modified environment
env VARIABLE=value command

# env -i: Clear environment
env -i command
```

## Run with clean environment

```bash
# Remove all env vars
env -i bash

# Keep specific vars
env -i HOME=$HOME USER=$USER bash

# Run command
env -i /path/to/command
```

## Set multiple variables

```bash
# For command
VAR1=value1 VAR2=value2 command

# Export multiple
export VAR1=value1 VAR2=value2

# Using env
env VAR1=value1 VAR2=value2 command
```

## Variable expansion

```bash
# Simple
echo $VARIABLE

# Braces (recommended)  
echo ${VARIABLE}

# Default value if unset
echo ${VARIABLE:-default}

# Set if unset
echo ${VARIABLE:=default}

# Error if unset
echo ${VARIABLE:?error message}

# Use alternative if set
echo ${VARIABLE:+alternative}
```

## Check if variable is set

```bash
# In script
if [ -z "$VARIABLE" ]; then
    echo "VARIABLE is not set"
fi

# Or
if [ -n "$VARIABLE" ]; then
    echo "VARIABLE is set"
fi

# Using printenv
if printenv VARIABLE > /dev/null 2>&1; then
    echo "VARIABLE exists"
fi
```

## Process-specific variables

```bash
# Show environment of running process
cat /proc/PID/environ | tr '\0' '\n'

# Using ps
ps auxe | grep process-name
```

## Scripting with environment

```bash
#!/bin/bash

# Check required variables
: ${DATABASE_URL:?DATABASE_URL must be set}
: ${API_KEY:?API_KEY must be set}

# Set defaults
: ${LOG_LEVEL:=INFO}
: ${PORT:=3000}

echo "Starting application on port $PORT"
echo "Log level: $LOG_LEVEL"
```

## Load from .env file

```bash
#!/bin/bash

# Load .env file
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Or
set -a
source .env
set +a
```

### .env file format

```bash
# .env
DATABASE_URL=postgresql://localhost/mydb
API_KEY=secret123
DEBUG=true
PORT=3000
```

## Common patterns

### Java

```bash
export JAVA_HOME=/usr/lib/jvm/java-11
export PATH=$PATH:$JAVA_HOME/bin
export CLASSPATH=.:$JAVA_HOME/lib
```

### Node.js

```bash
export NODE_ENV=production
export NODE_OPTIONS="--max-old-space-size=4096"
```

### Python

```bash
export PYTHONPATH=/path/to/modules:$PYTHONPATH
export VIRTUAL_ENV=/path/to/venv
```

### Go

```bash
export GOPATH=$HOME/go
export GOROOT=/usr/local/go
export PATH=$PATH:$GOROOT/bin:$GOPATH/bin
```

## Security considerations

```bash
# Never store secrets in environment (visible to all processes)
# Better: Use secret management tools

# Avoid in scripts
export PASSWORD=secret123  # BAD

# Instead, read from secure source
read -sp "Enter password: " PASSWORD
export PASSWORD

# Or use credential files
export DB_PASSWORD=$(cat /etc/secrets/db_password)
```

## Debugging

```bash
# Show all exports in current shell
export -p

# Show difference between shells
set | grep -v '^_'

# Trace variable changes
set -x
export VARIABLE=value
set +x
```

## Cleanup script

```bash
#!/bin/bash

# Save current state
env > /tmp/env_before.txt

# Do work...

# Compare
env > /tmp/env_after.txt
diff /tmp/env_before.txt /tmp/env_after.txt
```

## Tips & best practices

```bash
# 1. Always quote variables
echo "$VARIABLE"  # Good
echo $VARIABLE    # Can break with spaces

# 2. Use meaningful names
export DATABASE_URL  # Good
export DB           # Less clear

# 3. Document in scripts
# Required environment variables:
# - DATABASE_URL: PostgreSQL connection string
# - API_KEY: External API key

# 4. Provide defaults
: ${PORT:=3000}

# 5. Validate
if [ -z "$REQUIRED_VAR" ]; then
    echo "Error: REQUIRED_VAR not set"
    exit 1
fi
```

## Quick reference

```bash
# View
env                    # All variables
printenv VARIABLE      # Specific variable
echo $VARIABLE         # Value

# Set
export VAR=value       # This shell + children
VAR=value              # This shell only
VAR=value command      # Command only

# Unset
unset VAR

# Modify PATH
export PATH=$PATH:/new/path

# Permanent (user)
# Add to ~/.bashrc:
export VARIABLE=value

# Permanent (system)
# Add to /etc/environment:
VARIABLE=value
```
