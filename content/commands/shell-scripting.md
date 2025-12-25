---
title: "Shell Scripting Basics"
description: "Essential bash scripting syntax, variables, and control structures."
date: "2025-10-28"
tags: ["bash", "scripting", "shell"]
category: "Tools"
---

## Shebang

```bash
#!/bin/bash
```

## Make script executable

```bash
chmod +x script.sh
```

## Run script

```bash
./script.sh
bash script.sh
```

## Variables

```bash
NAME="John"
AGE=30
echo "Name: $NAME, Age: $AGE"
```

## Command substitution

```bash
CURRENT_DATE=$(date)
FILES=$(ls -1)
USER=`whoami`  # Old style
```

## Read user input

```bash
read -p "Enter your name: " NAME
echo "Hello, $NAME"
```

## Command line arguments

```bash
#!/bin/bash
echo "Script name: $0"
echo "First argument: $1"
echo "Second argument: $2"
echo "All arguments: $@"
echo "Number of arguments: $#"
```

## If statement

```bash
if [ "$AGE" -gt 18 ]; then
    echo "Adult"
elif [ "$AGE" -eq 18 ]; then
    echo "Just turned adult"
else
    echo "Minor"
fi
```

## String comparison

```bash
if [ "$NAME" = "John" ]; then
    echo "Hello John"
fi

if [ "$NAME" != "Jane" ]; then
    echo "Not Jane"
fi

if [ -z "$VAR" ]; then
    echo "Variable is empty"
fi

if [ -n "$VAR" ]; then
    echo "Variable is not empty"
fi
```

## Numeric comparison

```bash
if [ "$AGE" -eq 30 ]; then echo "Equal"; fi
if [ "$AGE" -ne 30 ]; then echo "Not equal"; fi
if [ "$AGE" -gt 30 ]; then echo "Greater"; fi
if [ "$AGE" -lt 30 ]; then echo "Less"; fi
if [ "$AGE" -ge 30 ]; then echo "Greater or equal"; fi
if [ "$AGE" -le 30 ]; then echo "Less or equal"; fi
```

## File tests

```bash
if [ -f "file.txt" ]; then echo "File exists"; fi
if [ -d "directory" ]; then echo "Directory exists"; fi
if [ -r "file.txt" ]; then echo "File is readable"; fi
if [ -w "file.txt" ]; then echo "File is writable"; fi
if [ -x "script.sh" ]; then echo "File is executable"; fi
if [ -s "file.txt" ]; then echo "File is not empty"; fi
```

## Logical operators

```bash
if [ "$AGE" -gt 18 ] && [ "$AGE" -lt 65 ]; then
    echo "Working age"
fi

if [ "$NAME" = "John" ] || [ "$NAME" = "Jane" ]; then
    echo "Known person"
fi

if [ ! -f "file.txt" ]; then
    echo "File does not exist"
fi
```

## Case statement

```bash
case "$1" in
    start)
        echo "Starting service"
        ;;
    stop)
        echo "Stopping service"
        ;;
    restart)
        echo "Restarting service"
        ;;
    *)
        echo "Usage: $0 {start|stop|restart}"
        exit 1
        ;;
esac
```

## For loop

```bash
for i in 1 2 3 4 5; do
    echo "Number: $i"
done

for file in *.txt; do
    echo "Processing $file"
done

for ((i=1; i<=10; i++)); do
    echo "Count: $i"
done
```

## While loop

```bash
COUNT=1
while [ $COUNT -le 5 ]; do
    echo "Count: $COUNT"
    ((COUNT++))
done
```

## Until loop

```bash
COUNT=1
until [ $COUNT -gt 5 ]; do
    echo "Count: $COUNT"
    ((COUNT++))
done
```

## Functions

```bash
greet() {
    echo "Hello, $1!"
}

greet "World"

# With return value
add() {
    local result=$(( $1 + $2 ))
    echo $result
}

sum=$(add 5 3)
echo "Sum: $sum"
```

## Arrays

```bash
FRUITS=("Apple" "Banana" "Orange")

echo "${FRUITS[0]}"  # First element
echo "${FRUITS[@]}"  # All elements
echo "${#FRUITS[@]}" # Array length

# Loop through array
for fruit in "${FRUITS[@]}"; do
    echo "$fruit"
done
```

## String manipulation

```bash
STRING="Hello World"

echo "${#STRING}"          # Length
echo "${STRING:0:5}"       # Substring
echo "${STRING/World/Bash}" # Replace
echo "${STRING,,}"         # Lowercase
echo "${STRING^^}"         # Uppercase
```

## Exit codes

```bash
command
if [ $? -eq 0 ]; then
    echo "Success"
else
    echo "Failed"
fi

# Or use &&  and ||
command && echo "Success" || echo "Failed"
```

## Error handling

```bash
set -e  # Exit on error
set -u  # Exit on undefined variable
set -o pipefail  # Exit if any command in pipe fails

# Combined
set -euo pipefail
```

## Redirect output

```bash
echo "text" > file.txt      # Overwrite
echo "text" >> file.txt     # Append
command 2> error.log        # Redirect stderr
command &> output.log       # Redirect both
command 2>&1               # Redirect stderr to stdout
```

## Here document

```bash
cat << EOF
Line 1
Line 2
Variable: $VAR
EOF
```

## Arithmetic

```bash
result=$((5 + 3))
result=$((10 - 2))
result=$((4 * 2))
result=$((10 / 2))
result=$((10 % 3))  # Modulo

# Increment/Decrement
((COUNT++))
((COUNT--))
((COUNT += 5))
```

## Complete script example

```bash
#!/bin/bash
set -euo pipefail

# Configuration
LOG_FILE="/var/log/backup.log"
BACKUP_DIR="/backup"

# Function to log messages
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"
}

# Function to backup directory
backup_directory() {
    local source=$1
    local dest=$2
    
    if [ ! -d "$source" ]; then
        log "ERROR: Source directory $source does not exist"
        return 1
    fi
    
    mkdir -p "$dest"
    tar -czf "$dest/backup-$(date +%Y%m%d-%H%M%S).tar.gz" "$source"
    log "Backup completed: $source -> $dest"
}

# Main script
if [ $# -ne 1 ]; then
    echo "Usage: $0 <directory-to-backup>"
    exit 1
fi

log "Starting backup process"
backup_directory "$1" "$BACKUP_DIR"
log "Backup process completed"
```
