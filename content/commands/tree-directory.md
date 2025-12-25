---
title: "Tree Directory Visualization"
description: "Display directory structure in tree format with tree command."
date: "2025-11-28"
tags: ["tree", "directory", "visualization"]
category: "Tools"
---

## Install

```bash
sudo apt install tree
```

## Basic usage

```bash
tree
tree /path/to/directory
```

## Depth limit

```bash
tree -L 2  # 2 levels deep
tree -L 1  # Only immediate children
```

## Show hidden files

```bash
tree -a
```

## Directories only

```bash
tree -d
```

## Files only (no dirs)

```bash
tree -f
```

## File sizes

```bash
tree -h      # Human readable
tree -s      # Bytes
tree --du    # Disk usage
```

## Show permissions

```bash
tree -p
```

## Show owner/group

```bash
tree -ug
```

## Show full path

```bash
tree -f
```

## Sort output

```bash
tree -v       # Version sort
tree -t       # Modification time
tree -c       # Last status change
tree -r       # Reverse order
tree --dirsfirst  # Directories first
```

## Pattern matching

```bash
# Include pattern
tree -P '*.txt'

# Exclude pattern
tree -I 'node_modules|.git'

# Multiple excludes
tree -I '*.pyc|__pycache__|.git'
```

## Limit files shown

```bash
tree --filelimit 10  # Max 10 files per directory
```

## Output formats

```bash
# JSON
tree -J

# XML
tree -X

# HTML
tree -H baseurl > tree.html
```

## Colorize

```bash
tree -C  # Color (default if terminal supports)
tree -n  # No color
```

## Character set

```bash
tree --charset ascii  # ASCII characters only
```

## Statistics

```bash
tree --du  # Show size summary
```

## Common use cases

### Project structure

```bash
tree -L 2 -I 'node_modules|.git'
```

### Config files

```bash
tree -a /etc/nginx
```

### Find large directories

```bash
tree --du -h | sort -h
```

### Generate documentation

```bash
tree -H '.' -L 2 > project-structure.html
```

### Backup verification

```bash
tree /backup > backup-structure.txt
```

## Advanced examples

### Code project

```bash
tree -L 3 -I 'node_modules|dist|build|.git|__pycache__|*.pyc'
```

### With file count

```bash
tree -L 2 --dirsfirst | head -50
```

### Size sorted

```bash
tree --du -h | grep -v /$  | sort -h
```

## Pipe to file

```bash
tree > directory-structure.txt
tree -J > structure.json
```

## Comparison

```bash
# Before changes
tree > before.txt

# After changes
tree > after.txt

# Compare
diff before.txt after.txt
```

## Shell alternative

```bash
# If tree not available
find . -print | sed -e 's;[^/]*/;|____;g;s;____|; |;g'
```
