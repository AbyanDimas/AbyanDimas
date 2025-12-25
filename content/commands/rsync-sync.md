---
title: "Rsync File Sync Mastery"
description: "Efficiently copy and sync files locally or over SSH with rsync."
date: "2025-09-02"
tags: ["rsync", "backup", "linux"]
category: "System"
---

## Basic rsync syntax

```bash
rsync source/ destination/
```

**Note**: Trailing slash matters!
- `source/` copies contents of source
- `source` copies the directory itself

## Sync with progress

```bash
rsync -avh --progress source/ destination/
```

- `-a`: Archive mode (preserves permissions, timestamps)
- `-v`: Verbose
- `-h`: Human-readable sizes

## Sync over SSH

```bash
rsync -avz source/ user@remote:/path/to/destination/
```

- `-z`: Compress during transfer

## Dry run (preview without changes)

```bash
rsync -avhn --delete source/ destination/
```

- `-n`: Dry run
- `--delete`: Remove files in destination not in source

## Exclude files/directories

```bash
rsync -av --exclude='node_modules' --exclude='*.log' source/ destination/
```

## Resume interrupted transfer

```bash
rsync -avP source/ destination/
```

- `-P`: Same as `--partial --progress`

## Sync only specific file types

```bash
rsync -av --include='*.jpg' --exclude='*' source/ destination/
```

## Bandwidth limit (1000 KB/s)

```bash
rsync -av --bwlimit=1000 source/ destination/
```

## Show what would be deleted

```bash
rsync -avn --delete source/ destination/ | grep deleting
```
