---
title: "Tar Archiving Masters"
description: "Essential tar commands for compressing and extracting files without looking up the man page."
date: "2025-08-20"
tags: ["linux", "cli", "compression"]
category: "System"
---

## Compress a directory

Create a `.tar.gz` archive from a directory.

```bash
tar -czvf archive_name.tar.gz /path/to/directory
```

*   `-c`: Create archive
*   `-z`: Compress with gzip
*   `-v`: Verbose output
*   `-f`: Filename of the archive

## Extract an archive

Extract to the current directory.

```bash
tar -xzvf archive_name.tar.gz
```

*   `-x`: Extract archive

## List contents

See what's inside without extracting.

```bash
tar -tzvf archive_name.tar.gz
```

## Extract to specific folder

```bash
tar -xzvf archive_name.tar.gz -C /target/directory
```
