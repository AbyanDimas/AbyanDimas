---
title: "Find & Grep Power User Guide"
description: "Advanced find and grep commands for searching files and content like a pro."
date: "2025-08-24"
tags: ["linux", "cli", "search"]
category: "System"
---

## Find files by name

```bash
find /path/to/search -name "*.log"
```

## Find files modified in last 7 days

```bash
find /var/log -type f -mtime -7
```

## Find and delete files

**Dangerous**: Always test without `-delete` first!

```bash
find /tmp -name "*.tmp" -type f -delete
```

## Find large files (> 100MB)

```bash
find / -type f -size +100M
```

## Grep with line numbers

```bash
grep -n "error" app.log
```

## Grep recursively in directory

```bash
grep -r "TODO" /project/src/
```

## Grep with context (3 lines before/after)

```bash
grep -C 3 "exception" app.log
```

## Case-insensitive grep

```bash
grep -i "warning" app.log
```

## Grep for multiple patterns

```bash
grep -E "error|fatal|critical" app.log
```

## Find + Grep combo

Search for "database" inside all `.js` files.

```bash
find . -name "*.js" -exec grep -l "database" {} \;
```
