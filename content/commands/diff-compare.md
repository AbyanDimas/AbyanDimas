---
title: "Diff & File Comparison"
description: "Compare files and directories with diff, comm, and cmp."
date: "2025-10-27"
tags: ["diff", "comparison", "tools"]
category: "Tools"
---

## Basic diff

```bash
diff file1.txt file2.txt
```

## Side-by-side comparison

```bash
diff -y file1.txt file2.txt
```

## Unified diff format

```bash
diff -u file1.txt file2.txt
```

## Context diff

```bash
diff -c file1.txt file2.txt
```

## Ignore whitespace

```bash
diff -w file1.txt file2.txt
```

## Ignore blank lines

```bash
diff -B file1.txt file2.txt
```

## Ignore case

```bash
diff -i file1.txt file2.txt
```

## Brief comparison

```bash
diff -q file1.txt file2.txt
```

## Recursive directory diff

```bash
diff -r dir1/ dir2/
```

## Generate patch file

```bash
diff -u original.txt modified.txt > changes.patch
```

## Apply patch

```bash
patch original.txt < changes.patch
```

## Reverse patch

```bash
patch -R original.txt < changes.patch
```

## Show only differences

```bash
diff --changed-group-format='%<' --unchanged-group-format='' file1 file2
```

## Color output

```bash
diff --color file1.txt file2.txt
```

## Compare three files

```bash
diff3 file1.txt file2.txt file3.txt
```

## COMM - Compare sorted files

```bash
comm file1.txt file2.txt
```

Output columns:
- Column 1: Lines only in file1
- Column 2: Lines only in file2
- Column 3: Lines in both files

## Show only unique to file1

```bash
comm -23 file1.txt file2.txt
```

## Show only unique to file2

```bash
comm -13 file1.txt file2.txt
```

## Show only common lines

```bash
comm -12 file1.txt file2.txt
```

## CMP - Binary comparison

```bash
cmp file1 file2
```

## Verbose cmp

```bash
cmp -l file1 file2
```

## Silent cmp (exit code only)

```bash
cmp -s file1 file2 && echo "Files are identical"
```

## Vimdiff

```bash
vimdiff file1.txt file2.txt
```

Vimdiff commands:
- `]c` - Next difference
- `[c` - Previous difference
- `do` - Diff obtain (get from other)
- `dp` - Diff put (send to other)
- `:diffupdate` - Refresh
- `:qa` - Quit all

## Colordiff

```bash
# Install colordiff first
diff file1.txt file2.txt | colordiff
```

## Git diff

```bash
git diff file1.txt file2.txt
```

## Diff with line numbers

```bash
diff -u file1.txt file2.txt | grep -E "^@@|^\+|^-"
```

## Diff statistics

```bash
diff -u file1.txt file2.txt | diffstat
```

## Ignore specific lines

```bash
diff -I '^#' file1.txt file2.txt
```

## Context lines

```bash
# 3 lines of context
diff -C 3 file1.txt file2.txt

# 5 lines of context
diff -U 5 file1.txt file2.txt
```

## Diff output formats

```bash
# Normal
diff file1 file2

# Context (-c)
diff -c file1 file2

# Unified (-u, most common)
diff -u file1 file2

# Side by side (-y)
diff -y file1 file2

# Brief (-q)
diff -q file1 file2
```

## Directory comparison

```bash
# Recursive with summary
diff -rq dir1/ dir2/

# Show only files that differ
diff -rq dir1/ dir2/ | grep differ

# Show only in dir1
diff -rq dir1/ dir2/ | grep "Only in dir1"
```

## Exclude files from diff

```bash
diff -r --exclude='*.log' dir1/ dir2/
```

## Exclude patterns

```bash
diff -r -x '*.pyc' -x '__pycache__' dir1/ dir2/
```

## Compare with original

```bash
# Backup original
cp file.txt file.txt.orig

# Make changes to file.txt

# Compare
diff -u file.txt.orig file.txt
```

## Batch comparison

```bash
for file in dir1/*; do
    diff "$file" "dir2/$(basename "$file")"
done
```

## Diff with timestamps

```bash
diff -u --label "original $(date)" --label "modified $(date)" file1 file2
```

## Advanced diff script

```bash
#!/bin/bash
# Compare two directories with report

DIR1=$1
DIR2=$2

echo "Files only in $DIR1:"
diff -rq "$DIR1" "$DIR2" | grep "Only in $DIR1"

echo -e "\nFiles only in $DIR2:"
diff -rq "$DIR1" "$DIR2" | grep "Only in $DIR2"

echo -e "\nFiles that differ:"
diff -rq "$DIR1" "$DIR2" | grep differ
```

## Create unified patch

```bash
diff -Naur original/ modified/ > changes.patch
```

Flags:
- `-N` - Treat absent files as empty
- `-a` - Treat all files as text
- `-u` - Unified format
- `-r` - Recursive

## Apply patch with dry run

```bash
patch --dry-run -p1 < changes.patch
```

## Meld (GUI diff tool)

```bash
meld file1.txt file2.txt
meld dir1/ dir2/
```

## Beyond Compare (commercial)

```bash
bcompare file1.txt file2.txt
```

## Diff aliases

Add to `~/.bashrc`:
```bash
alias dif='diff --color=auto'
alias sdiff='diff -y'
alias rdiff='diff -r'
```
