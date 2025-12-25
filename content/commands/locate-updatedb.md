---
title: "Locate & UpdateDB File Search"
description: "Fast file searching with locate database and updatedb."
date: "2025-11-13"
tags: ["locate", "updatedb", "search"]
category: "Tools"
---

## Install mlocate

```bash
# Ubuntu/Debian
sudo apt install mlocate

# RHEL/CentOS
sudo yum install mlocate

# macOS
brew install mlocate
```

## Basic locate usage

```bash
# Find files
locate filename

# Case insensitive
locate -i filename

# Count results
locate -c filename

# Show only existing files
locate -e filename
```

## Update database

```bash
# Manual update
sudo updatedb

# Update specific paths
sudo updatedb --prunepaths='/tmp /var/tmp'
```

## Search patterns

```bash
# Exact filename
locate -b '\filename.txt'

# Files ending with .conf
locate '*.conf'

# Files in specific directory
locate '/etc/*.conf'

# Multiple patterns (OR)
locate -i  'readme' | grep -i 'docker'
```

## Limit results

```bash
# First 10 results
locate -l 10 filename

# Stop after N matches
locate -n 10 filename
```

## Regular expressions

```bash
# Regex search
locate -r '.*/config.*\.xml$'

# Case insensitive regex
locate -ri 'readme'
```

## Statistics

```bash
# Show database statistics
locate -S
```

Output example:
```
Database /var/lib/mlocate/mlocate.db:
    58,102 directories
    682,394 files
    35,901,384 bytes in file names
    16,306,432 bytes used to store database
```

## Database location

```bash
# Default database
/var/lib/mlocate/mlocate.db

# Custom database
locate -d /path/to/custom.db pattern
```

## Create custom database

```bash
# Create database for specific directory
updatedb -l 0 -o ~/myfiles.db -U /path/to/dir

# Use custom database
locate -d ~/myfiles.db filename
```

## Configuration

Edit `/etc/updatedb.conf`:

```conf
PRUNE_BIND_MOUNTS="yes"  
PRUNENAMES=".git .svn .hg"
PRUNEPATHS="/tmp /var/spool /media"
PRUNEFS="NFS nfs nfs4 rpc_pipefs afs binfmt_misc"
```

## Exclude directories

```bash
# Skip specific paths
PRUNEPATHS="/tmp /var/tmp /mnt /media"
```

## Auto-update schedule

Check cron:

```bash
# Ubuntu/Debian
cat /etc/cron.daily/mlocate

# RHEL/CentOS
cat /etc/cron.daily/mlocate.cron
```

## Find recently modified files

```bash
# Combine locate with find
locate filename | xargs ls -lt | head
```

## Common use cases

### Find config files

```bash
locate -i '*.conf' | grep nginx
```

### Find log files

```bash
locate -r '\.log$' | grep -v '/var/log'
```

### Find executables

```bash
locate -b '\command' | grep bin
```

### Find documentation

```bash
locate -i readme | grep -i docker
```

## Performance comparison

```bash
# locate (very fast, uses database)
time locate filename

# find (slow, searches filesystem)
time find / -name filename 2>/dev/null
```

## Locate vs Find

```
locate:
+ Much faster (uses database)
+ Lower system load
- Requires updatedb
- May show deleted files
- Database must be current

find:
+ Real-time search
+ More search options
+ Accurate results
- Slower
- Higher I/O
```

## Verify file exists

```bash
# locate might show deleted files
locate filename | while read file; do
    [ -e "$file" ] && echo "$file"
done

# Or use -e flag
locate -e filename
```

## Search in specific directory

```bash
# Pipe to grep
locate filename | grep '^/home/'

# Or with regex
locate -r '^/home/.*filename'
 ```

## Count files by type

```bash
#!/bin/bash
for ext in txt pdf doc jpg png; do
    count=$(locate "*.$ext" | wc -l)
    echo "$ext: $count"
done
```

## Find duplicates by name

```bash
locate filename | \
  rev | cut -d'/' -f1 | rev | \
  sort | uniq -d
```

## Exclude patterns

```bash
# Find .conf but exclude /etc
locate -i '*.conf' | grep -v '^/etc/'
```

## Interactive search

```bash
#!/bin/bash
read -p "Search for: " query
results=$(locate -i "$query")

if [ -z "$results" ]; then
    echo "No results found"
else
    echo "$results" | nl
    read -p "Open file number: " num
    file=$(echo "$results" | sed -n "${num}p")
    xdg-open "$file"
fi
```

## Find and open

```bash
# Find and edit
locate vimrc | head -1 | xargs vim

# Find and view
locate readme.md | fzf | xargs cat
```

## Troubleshooting

### Database not found

```bash
# Create database
sudo updatedb
```

### Permission denied

```bash
# Some files require root
sudo locate filename
```

### Old results

```bash
# Update database
sudo updatedb

# Force full update
sudo updatedb -U /
```

## Automation

### Daily update script

```bash
#!/bin/bash
# /etc/cron.daily/updatedb-custom

# Update main database
/usr/bin/updatedb

# Update custom database
/usr/bin/updatedb -l 0 -o /home/user/mydb.db -U /home/user
```

### Monitor new files

```bash
#!/bin/bash
before=$(mktemp)
after=$(mktemp)

locate '*.log' | sort > "$before"
sleep 60
sudo updatedb
locate '*.log' | sort > "$after"

echo "New log files:"
comm -13 "$before" "$after"

rm "$before" "$after"
```

## mlocate vs plocate

```bash
# plocate (faster alternative)
sudo apt install plocate

# Same syntax
plocate filename
```

## Best practices

```bash
# 1. Update database regularly
sudo updatedb

# 2. Use -e for existing files
locate -e filename

# 3. Combine with other tools
locate '*.log' | xargs wc -l

# 4. Use basename search
locate -b '\exact-name'

# 5. Create custom databases for large dirs
updatedb -o ~/projects.db -U ~/Projects
```

## Alternatives

```bash
# fd (modern alternative)
fd filename

# ripgrep (content search)
rg "pattern"

# fzf (fuzzy finder)
find . | fzf

# Everything (Windows)
# Similar concept to locate
```
