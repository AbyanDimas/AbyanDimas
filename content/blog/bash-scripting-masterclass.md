---
title: "Bash Scripting Masterclass: Automating the Boring Stuff"
date: "2025-07-05"
author: "Abyan Dimas"
excerpt: "Variables, loops, functions, and error handling. Writing robust scripts that don't break when you look at them funny."
coverImage: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=1200&auto=format&fit=crop"
---

![Code Script](https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=1200&auto=format&fit=crop)

The shell is your home. Bash functions are your furniture. A good DevOps engineer automates everything that needs to be done more than twice.

## The Shebang

Always start with `#!/bin/bash`. This tells the kernel which interpreter to use.

## Strict Mode

Bash is forgiving, which is bad for automation. Add this to the top of every script:

```bash
set -euo pipefail
```

*   `-e`: Exit immediately if a command fails (returns non-zero).
*   `-u`: Treat unset variables as an error (prevents `rm -rf /$UNDEFINED_VAR`).
*   `-o pipefail`: If a command in a pipe fails (`cmd1 | cmd2`), the whole thing fails.

## Variables and Expansion

Always quote your variables.

```bash
FILE="My File.txt"
rm $FILE    # ERROR: Tries to remove "My" and "File.txt"
rm "$FILE"  # CORECT: Removes "My File.txt"
```

## Loops: Iterating Files

Don't parse `ls`. Use globs.

```bash
for file in *.jpg; do
    echo "Processing $file..."
    convert "$file" "${file%.jpg}.png"
done
```

`${file%.jpg}` removes the extension. Bash string manipulation is surprisingly powerful.

## Functions

Modularity makes scripts readable.

```bash
log() {
    local level=$1
    shift
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] [$level] $*"
}

log "INFO" "Backup started"
```

## Trap: Cleaning Up

What if the user hits Ctrl+C? Use `trap` to run cleanup code.

```bash
temp_file=$(mktemp)
trap "rm -f $temp_file" EXIT

echo "Working..." > "$temp_file"
# Even if script errors or exits here, file is deleted.
```

Bash isn't just for glue code. With discipline, it's a powerful programming language.
