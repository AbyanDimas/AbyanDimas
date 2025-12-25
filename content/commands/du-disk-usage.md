---
title: "DU Disk Usage Analysis"
description: "Analyze disk usage with du and ncdu commands."
date: "2025-12-11"
tags: ["du", "ncdu", "disk", "usage"]
category: "System"
---

## DU - Disk usage

```bash
# Current directory
du

# Human-readable
du -h

# Summary of directory
du -sh directory/

# All files and directories
du -ah

# Max depth
du -h --max-depth=1
```

## Size of specific items

```bash
# Single directory
du -sh /var/log

# Multiple items
du -sh /var/log /tmp /home

# Current directory's subdirectories
du -h --max-depth=1 .

# Sort by size
du -h --max-depth=1 | sort -h
```

## Find largest directories

```bash
# Top 10 largest
du -h --max-depth=1 | sort -hr | head -10

# In specific path
du -h /var --max-depth=1 | sort -hr | head -10
```

## Exclude patterns

```bash
# Exclude directory
du -h --exclude=node_modules

# Multiple exclusions
du -h --exclude=*.log --exclude=.git

# Exclude pattern
du -h --exclude='*.tmp'
```

## Apparent vs actual size

```bash
# Apparent size (logical size)
du --apparent-size -h

# Actual size (disk usage - default)
du -h

# Both
du -h --apparent-size && du -h
```

## Total only

```bash
# Just total for multiple items
du -ch dir1 dir2 dir3 | tail -1

# Or
du -csh dir1 dir2 dir3
```

## Include/exclude files

```bash
# Only count files (not directories)
find . -type f -exec du -ch {} + | tail -1

# Specific file types
find . -name '*.log' -exec du -ch {} + | tail -1
```

## Compare directories

```bash
# Size comparison
echo "Dir 1: $(du -sh dir1 | cut -f1)"
echo "Dir 2: $(du -sh dir2 | cut -f1)"
```

## NCDU - Interactive disk usage

```bash
# Install
sudo apt install ncdu

# Analyze directory
ncdu /path/to/directory

# Current directory
ncdu
```

### NCDU keyboard shortcuts

```
up/down  - Navigate
right    - Enter directory
left     - Parent directory
d        - Delete selected
n        - Sort by name
s        - Sort by size
c        - Toggle showing items
g        - Show graph
?        - Help
q        - Quit
```

## Disk usage script

```bash
#!/bin/bash

echo "=== Top 10 Largest Directories ==="
du -h --max-depth=1 2>/dev/null | sort -hr | head -10

echo -e "\n=== Disk Usage Summary ==="
df -h /

echo -e "\n=== Large Files (>100MB) ==="
find / -type f -size +100M -exec ls -lh {} \; 2>/dev/null | awk '{print $5, $9}' | sort -hr | head -10
```

## Find space hogs

```bash
# Directories over 1GB
du -h --max-depth=2 | grep '^[0-9.]*G'

# Files over 100MB
find / -type f -size +100M -exec ls -lh {} \; 2>/dev/null

# Large log files
find /var/log -type f -size +100M -ls
```

## Track changes over time

```bash
# Initial snapshot
du -sh /data > disk-usage-$(date +%Y%m%d).txt

# Compare later
diff disk-usage-20251201.txt disk-usage-20251210.txt
```

## Per-user disk usage

```bash
# All users
for user in $(ls /home); do
    echo "$user: $(du -sh /home/$user 2>/dev/null | cut -f1)"
done

# Or with quota
quota -u username
```

## Exclude mounted filesystems

```bash
# Don't cross filesystem boundaries
du -h --max-depth=1 -x /
```

## Include hidden files

```bash
# Show all including hidden
du -ach .* * | sort -hr | head -20
```

## JSON output (with jq)

```bash
du -b | jq -R 'split("\t") | {size: .[0]|tonumber, path: .[1]}'
```

## Real-time monitoring

```bash
# Watch directory growth
watch -n 5 'du -sh /var/log'

# Alert on size threshold
while true; do
    SIZE=$(du -s /var/log | cut -f1)
    if [ $SIZE -gt 1000000 ]; then
        echo "Alert: /var/log is ${SIZE}KB"
    fi
    sleep 300
done
```

## Clean up recommendations

```bash
#!/bin/bash

echo "=== Cleanup Recommendations ==="

# Old logs
echo "Old logs (>30 days):"
find /var/log -type f -mtime +30 -ls

# Package caches
echo -e "\nPackage cache:"
du -sh /var/cache/apt/archives

# Temp files
echo -e "\nTemp files:"
du -sh /tmp

# Browser cache
echo -e "\nBrowser caches:"
du -sh ~/.cache/
```

## Sparse files

```bash
# Check for sparse files
find / -type f -printf "%S\t%p\n" 2>/dev/null | awk '$1 < 1.0'

# Apparent vs actual for sparse
echo "Apparent: $(du --apparent-size -sh file | cut -f1)"
echo "Actual: $(du -sh file | cut -f1)"
```

## By file type

```bash
#!/bin/bash

echo "=== Disk Usage by File Type ==="

for ext in log txt pdf jpg png mp4; do
    SIZE=$(find . -name "*.$ext" -exec du -ch {} + 2>/dev/null | tail -1 | cut -f1)
    echo ".$ext files: $SIZE"
done
```

## Docker cleanup

```bash
# Docker disk usage
docker system df

# Detailed
docker system df -v

# Cleanup
docker system prune -a
```

## Troubleshooting

### df vs du discrepancy

```bash
# df shows filesystem usage
df -h /

# du shows directory usage
du -sh /

# Difference usually due to deleted but open files
lsof | grep deleted
```

### Permission denied errors

```bash
# Suppress errors
du -sh /var 2>/dev/null

# Or redirect to file
du -sh /var 2>errors.log
```

## Performance optimization

```bash
# Faster on large directories
du --max-depth=1 instead of du -ah

# Cache results
du -h / > disk-usage-cache.txt

# Background job
nohup du -h / > /tmp/du-output.txt 2>&1 &
```

## Quick reference

```bash
# Basic usage
du -sh directory/              # Summary
du -h --max-depth=1           # One level deep
du -ah directory/             # All files

# Sorting
du -h | sort -h               # Sort by size
du -h --max-depth=1 | sort -hr | head -10  # Top 10

# Exclusions
du -h --exclude=node_modules
du -h --exclude='*.log'

# Interactive
ncdu directory/

# Find large files
find . -type f -size +100M -exec ls -lh {} \;

# Total
du -csh dir1 dir2
```
