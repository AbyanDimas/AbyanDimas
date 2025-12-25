---
title: "WC Word Count"
description: "Count lines, words, and characters with wc command."
date: "2025-12-09"
tags: ["wc", "count", "statistics"]
category: "Tools"
---

## Basic usage

```bash
# All counts (lines, words, bytes)
wc file.txt

# Count lines
wc -l file.txt

# Count words
wc -w file.txt

# Count characters
wc -m file.txt

# Count bytes
wc -c file.txt
```

## Output format

```bash
wc file.txt
# Output: lines words bytes filename
# Example: 100 850 5234 file.txt
```

## Multiple files

```bash
# Count multiple files
wc file1.txt file2.txt

# Shows total at end
wc *.txt
```

## From stdin

```bash
# Count command output
ls -l | wc -l

# Count processes
ps aux | wc -l

# Count files in directory
find . -type f | wc -l
```

## Just the number

```bash
# Lines only (no filename)
wc -l < file.txt

# Or with awk
wc -l file.txt | awk '{print $1}'
```

## Count specific things

### Lines

```bash
# Total lines
wc -l file.txt

# Non-empty lines
grep -c . file.txt

# Lines matching pattern
grep -c "pattern" file.txt
```

### Words

```bash
# Total words
wc -w file.txt

# Unique words
tr -s ' ' '\n' < file.txt | sort | uniq | wc -l
```

### Characters

```bash
# Including newlines
wc -m file.txt

# Excluding newlines
tr -d '\n' < file.txt | wc -m
```

## Practical examples

### Code statistics

```bash
# Lines of code
find . -name '*.py' | xargs wc -l

# Total lines in project
find . -name '*.js' -o -name '*.jsx' | xargs wc -l | tail -1
```

### Log analysis

```bash
# Log entries per day
grep "2025-12-09" app.log | wc -l

# Error count
grep -i error syslog | wc -l
```

### File comparison

```bash
# Compare line counts
echo "File 1: $(wc -l < file1.txt) lines"
echo "File 2: $(wc -l < file2.txt) lines"
```

### Data validation

```bash
# Check if file has expected number of lines
LINES=$(wc -l < data.csv)
if [ $LINES -ne 1000 ]; then
    echo "Error: Expected 1000 lines, got $LINES"
fi
```

## Advanced usage

### Longest line

```bash
wc -L file.txt  # GNU wc only
```

### Count file types

```bash
# Count each file type
find . -type f | sed 's/.*\.//' | sort | uniq -c
```

### Directory statistics

```bash
#!/bin/bash
echo "Files: $(find . -type f | wc -l)"
echo "Directories: $(find . -type d | wc -l)"
echo "Total lines: $(find . -name '*.txt' | xargs wc -l | tail -1)"
```

## Comparison with alternatives

```bash
# wc (standard)
wc -l file.txt

# grep (with null pattern)
grep -c '' file.txt

# awk
awk 'END {print NR}' file.txt

# sed
sed -n '$=' file.txt
```

## Performance

```bash
# For very large files
# wc is optimized and usually fastest

time wc -l huge-file.log
time grep -c '' huge-file.log
time awk 'END {print NR}' huge-file.log
```

## Common patterns

### Progress indicator

```bash
TOTAL=$(wc -l < file.txt)
CURRENT=0
while read line; do
    ((CURRENT++))
    echo "Processing $CURRENT/$TOTAL"
    # Process line
done < file.txt
```

### Split file by line count

```bash
TOTAL=$(wc -l < file.txt)
HALF=$((TOTAL / 2))

head -n $HALF file.txt > first-half.txt
tail -n +$((HALF + 1)) file.txt > second-half.txt
```

### Verify downloads

```bash
# Check if download complete
EXPECTED=10000
ACTUAL=$(wc -l < downloaded-file.csv)

if [ $ACTUAL -eq $EXPECTED ]; then
    echo "Download complete"
else
    echo "Incomplete: $ACTUAL/$EXPECTED lines"
fi
```

## Script examples

### Count summary

```bash
#!/bin/bash
FILE=$1

echo "=== File Statistics: $FILE ==="
echo "Lines:      $(wc -l < "$FILE")"
echo "Words:      $(wc -w < "$FILE")"
echo "Characters: $(wc -m < "$FILE")"
echo "Bytes:      $(wc -c < "$FILE")"
```

### Project statistics

```bash
#!/bin/bash

echo "=== Project Statistics ==="
echo "Total files: $(find . -type f | wc -l)"
echo "Python files: $(find . -name '*.py' | wc -l)"
echo "Python lines: $(find . -name '*.py' | xargs wc -l | tail -1 | awk '{print $1}')"
echo "JavaScript files: $(find . -name '*.js' | wc -l)"
echo "JavaScript lines: $(find . -name '*.js' | xargs wc -l | tail -1 | awk '{print $1}')"
```

## Troubleshooting

### Count doesn't match expected

```bash
# Check for hidden characters
cat -A file.txt | head

# Check line endings
file file.txt

# Convert line endings
dos2unix file.txt  # Windows to Unix
unix2dos file.txt  # Unix to Windows
```

### Large file hangs

```bash
# Sample instead of counting all
head -n 10000 large-file.txt | wc -l

# Estimate from sample
SAMPLE=$(head -n 10000 large-file.txt | wc -l)
SIZE=$(stat -c%s large-file.txt)
SAMPLE_SIZE=$(head -n 10000 large-file.txt | wc -c)
ESTIMATE=$((SAMPLE * SIZE / SAMPLE_SIZE))
echo "Estimated lines: $ESTIMATE"
```

## Tips and tricks

```bash
# 1. Quick line count
wc -l < file.txt

# 2. Count files in directory
ls -1 | wc -l

# 3. Count running processes
ps aux | wc -l

# 4. Count open files by process
lsof -p PID | wc -l

# 5. Count network connections
netstat -an | wc -l

# 6. Count users
who | wc -l

# 7. Count packages (Debian/Ubuntu)
dpkg -l | wc -l

# 8. Count commits
git log --oneline | wc -l
```

## Quick reference

```bash
# Basic counts
wc file.txt           # Lines, words, bytes
wc -l file.txt        # Lines only
wc -w file.txt        # Words only
wc -m file.txt        # Characters
wc -c file.txt        # Bytes

# Just number (no filename)
wc -l < file.txt

# Multiple files with total
wc -l *.txt

# From command output
command | wc -l

# Common uses
find . -name '*.py' | wc -l    # Count Python files
ps aux | wc -l                  # Count processes
grep "error" log | wc -l        # Count errors
```
