---
title: "Bash Debugging"
description: "Debug bash scripts with set options, traps, and shellcheck."
date: "2025-10-29"
tags: ["bash", "debugging", "scripting"]
category: "Tools"
---

## Enable trace mode

```bash
set -x  # Print commands as they execute
```

## Debug specific section

```bash
set -x
# Code to debug
set +x
```

## Run script in debug mode

```bash
bash -x script.sh
```

## Verbose mode

```bash
set -v  # Print shell input lines
bash -v script.sh
```

## Exit on error

```bash
set -e
```

## Exit on undefined variable

```bash
set -u
```

## Pipe fail

```bash
set -o pipefail
```

## Combined safety settings

```bash
#!/bin/bash
set -euo pipefail
```

## Custom PS4 prompt

```bash
export PS4='+(${BASH_SOURCE}:${LINENO}): ${FUNCNAME[0]:+${FUNCNAME[0]}(): }'
set -x
```

## Trap errors

```bash
#!/bin/bash

error_handler() {
    echo "Error occurred in script at line: ${1}" >&2
    exit 1
}

trap 'error_handler ${LINENO}' ERR
```

## Trap exit

```bash
cleanup() {
    echo "Cleaning up..."
    rm -f /tmp/tempfile
}

trap cleanup EXIT
```

## Trap signals

```bash
trap 'echo "Interrupted"; exit 1' INT TERM
```

## Debug function

```bash
debug() {
    if [ "$DEBUG" = "true" ]; then
        echo "DEBUG: $*" >&2
    fi
}

export DEBUG=true
debug "This is a debug message"
```

## Check syntax without running

```bash
bash -n script.sh
```

## Shellcheck

```bash
# Install
sudo apt install shellcheck

# Check script
shellcheck script.sh
```

## Common shellcheck fixes

```bash
# Quote variables
echo "$VAR" # Not: echo $VAR

# Use [[ ]] instead of [ ]
if [[ $VAR = "value" ]]; then

# Check command existence
if command -v docker &>/dev/null; then

# Use $() instead of backticks
result=$(command) # Not: result=`command`
```

## Assert function

```bash
assert() {
    if ! "$@"; then
        echo "Assertion failed: $*" >&2
        exit 1
    fi
}

assert [ -f "important-file.txt" ]
```

## Profiling script

```bash
#!/bin/bash

TIMEFORMAT='%R seconds'

time {
    # Code to profile
    sleep 2
    echo "Done"
}
```

## Xtrace to file

```bash
exec 5> debug.log
BASH_XTRACEFD="5"
set -x

# Your script here
```

## Conditional debugging

```bash
#!/bin/bash

if [ "${DEBUG:-0}" = "1" ]; then
    set -x
fi

# Run with: DEBUG=1 ./script.sh
```

## Function call stack

```bash
print_stack() {
    local i=0
    local FRAMES=${#BASH_SOURCE[@]}

    echo "Traceback (most recent call last):" >&2
    
    for ((i=FRAMES-1; i>=0; i--)); do
        echo "  File \"${BASH_SOURCE[i]}\", line ${BASH_LINENO[i-1]}, in ${FUNCNAME[i]}" >&2
    done
}

trap print_stack ERR
```

## Variable inspection

```bash
inspect_vars() {
    echo "=== Variable Inspection ===" >&2
    echo "PWD: $PWD" >&2
    echo "ARGS: $*" >&2
    env | grep "^MY_" >&2
}

trap inspect_vars DEBUG
```

## Dry run mode

```bash
DRY_RUN=${DRY_RUN:-false}

run() {
    if [ "$DRY_RUN" = "true" ]; then
        echo "Would run: $*"
    else
        "$@"
    fi
}

run rm -rf /tmp/test
```

## Log levels

```bash
LOG_LEVEL=${LOG_LEVEL:-INFO}

log_debug() { [ "$LOG_LEVEL" = "DEBUG" ] && echo "DEBUG: $*" >&2; }
log_info() { echo "INFO: $*"; }
log_warn() { echo "WARN: $*" >&2; }
log_error() { echo "ERROR: $*" >&2; }
```

## Breakpoint function

```bash
breakpoint() {
    echo "=== Breakpoint at line $BASH_LINENO ===" >&2
    echo "Variables:" >&2
    set | grep "^[A-Z]" >&2
    read -p "Press Enter to continue..." >&2
}

# Use in script
breakpoint
```

## Interactive debugger

```bash
debug_shell() {
    echo "Entering debug shell (type 'exit' to continue)" >&2
    bash
}

trap 'debug_shell' DEBUG
```

## Checkpoint logging

```bash
checkpoint() {
    echo "[$(date +'%T')] CHECKPOINT: $1" >&2
}

checkpoint "Starting processing"
# ... code ...
checkpoint "Processing complete"
```

## Execution timer

```bash
#!/bin/bash

START_TIME=$(date +%s)

cleanup() {
    END_TIME=$(date +%s)
    ELAPSED=$((END_TIME - START_TIME))
    echo "Script ran for $ELAPSED seconds"
}

trap cleanup EXIT
```

## Common debugging patterns

```bash
#!/bin/bash

# Function arguments
myfunc() {
    echo "Called with $# arguments: $*" >&2
    # ... function code ...
}

# Check if variable is set
: "${REQUIRED_VAR:?Variable REQUIRED_VAR must be set}"

# Default values
VAR=${VAR:-default_value}

# Readonly variables
readonly CONFIG_FILE="/etc/app.conf"
```

## Debugging script template

```bash
#!/bin/bash

# Debugging flags
set -euo pipefail
IFS=$'\n\t'

# Debug mode
DEBUG=${DEBUG:-0}
if [ "$DEBUG" = "1" ]; then
    set -x
    export PS4='+(${BASH_SOURCE}:${LINENO}): ${FUNCNAME[0]:+${FUNCNAME[0]}(): }'
fi

# Error handling
error_exit() {
    echo "Error: $1" >&2
    exit 1
}

trap 'error_exit "Script failed at line $LINENO"' ERR

# Cleanup
cleanup() {
    echo "Cleaning up..."
}

trap cleanup EXIT

# Main script
main() {
    echo "Script started"
    # Your code here
}

main "$@"
```

## bashdb debugger

```bash
# Install
sudo apt install bashdb

# Run with debugger
bashdb script.sh

# Commands:
# s - step
# n - next
# c - continue
# p $var - print variable
# b 20 - breakpoint at line 20
# l - list code
# q - quit
```
