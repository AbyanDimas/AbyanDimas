---
title: "Which, Whereis & Type Commands"
description: "Locate commands and executables with which, whereis, and type."
date: "2025-12-01"
tags: ["which", "whereis", "type", "locate"]
category: "Tools"
---

## WHICH - Find command in PATH

```bash
# Find executable location
which python
which python3
which node

# All occurrences in PATH
which -a python

# Show all programs
which ls bash vim
```

### Common uses

```bash
# Check if command exists
which docker > /dev/null && echo "Docker installed"

# Get full path for script
#!/bin/$(which bash)

# Compare versions
which python
which python3
```

## WHEREIS - Locate binary, source, man pages

```bash
# Find all related files
whereis python
# python: /usr/bin/python /usr/lib/python2.7 /etc/python /usr/share/man/man1/python.1.gz

# Binary only
whereis -b python

# Manual page only
whereis -m python

# Source code only
whereis -s python
```

### Options

```bash
# Limit search paths
whereis -B /usr/bin -f python

# Unusual entries only
whereis -u python
```

## TYPE - Describe command type

```bash
# Show command type
type ls        # ls is aliased to `ls --color=auto'
type cd        # cd is a shell builtin
type python    # python is /usr/bin/python

# Show all definitions
type -a python

# Only show path
type -p python

# Only show type
type -t ls     # alias
type -t cd     # builtin
type -t python # file
```

### Command types

```
alias     - Command alias
builtin   - Shell builtin
file      - External program
function  - Shell function
keyword   - Shell keyword
```

## COMMAND - Run command directly

```bash
# Bypass alias
command ls

# Check if command exists
command -v python

# Show path
command -V python
```

## Comparison

```bash
# which: Only finds executables in PATH
which ls        # /usr/bin/ls

# whereis: Finds binaries, sources, manuals
whereis ls      # ls: /usr/bin/ls /usr/share/man/man1/ls.1.gz

# type: Shows all command types (alias, builtin, file)
type ls         # ls is aliased to `ls --color=auto'

# command: Bypasses aliases, shows actual command
command -v ls   # /usr/bin/ls
```

## Check if command exists

```bash
# Using which
if which python3 > /dev/null 2>&1; then
    echo "Python 3 is installed"
fi

# Using type
if type python3 > /dev/null 2>&1; then
    echo "Python 3 is available"
fi

# Using command (recommended)
if command -v python3 > /dev/null 2>&1; then
    echo "Python 3 is available"
fi
```

## Find alternative versions

```bash
# All python versions in PATH
which -a python python2 python3

# Using update-alternatives
update-alternatives --list python

# Using ls
ls -l /usr/bin/python*
```

## Script usage

```bash
#!/bin/bash

# Check dependencies
for cmd in git node npm; do
    if ! command -v $cmd > /dev/null; then
        echo "Error: $cmd is not installed"
        exit 1
    fi
done

echo "All dependencies satisfied"
```

## Environment investigation

```bash
# Show PATH
echo $PATH

# Show command location
which python
type -a python

# Show all info
whereis python
type python
ls -l $(which python)
```

## Troubleshooting

```bash
# Command not found?
which command-name
echo $PATH

# Wrong version executing?
type -a command-name
which -a command-name

# Is it an alias?
type command-name
alias | grep command-name

# Which Python/Node/etc?
which python && python --version
which node && node --version
```

## Best practices

```bash
# 1. Check existence before use
command -v docker > /dev/null || exit 1

# 2. Use full path in scripts (optional, for security)
/usr/bin/python3 script.py

# 3. Verify version
python --version

# 4. Document dependencies
# At top of script:
# Requires: git, node, npm

# 5. Use type for interactive debugging
type -a command-name
```
