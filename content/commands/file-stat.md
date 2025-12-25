---
title: "File & Stat Commands"
description: "Determine file types and view detailed file information with file and stat."
date: "2025-12-10"
tags: ["file", "stat", "metadata"]
category: "Tools"
---

## FILE - Determine file type

```bash
# Basic usage
file filename

# Multiple files
file file1 file2 file3

# All files in directory
file *

# Brief output
file -b filename

# MIME type
file --mime-type filename
file -i filename
```

## File type detection

```bash
# Text file
file document.txt
# document.txt: ASCII text

# Binary
file /bin/ls
# /bin/ls: ELF 64-bit LSB executable

# Image
file photo.jpg
# photo.jpg: JPEG image data

# Archive
file archive.tar.gz
# archive.tar.gz: gzip compressed data

# Script
file script.sh
# script.sh: Bourne-Again shell script
```

## MIME types

```bash
# Get MIME type
file --mime-type file.pdf
# file.pdf: application/pdf

# MIME type and encoding
file --mime file.txt
# file.txt: text/plain; charset=us-ascii

# Brief MIME
file -b --mime-type image.png
# image/png
```

## Recursive file search

```bash
# Find all JPEG files
find . -type f -exec file {} \; | grep JPEG

# Count file types
find . -type f -exec file --mime-type {} \; | cut -d: -f2 | sort | uniq -c
```

## STAT - File statistics

```bash
# Full file information
stat filename

# Format output
stat -c '%n %s' filename  # Name and size
stat -c '%U %G' filename  # Owner and group

# Access/modify times
stat -c '%x %y %z' filename
```

## Stat format specifiers

```bash
%a    # Access rights in octal
%A    # Access rights in human-readable form
%b    # Number of blocks allocated
%B    # Size in bytes of each block
%d    # Device number in decimal
%D    # Device number in hex
%f    # Raw mode in hex
%F    # File type
%g    # Group ID
%G    # Group name
%h    # Number of hard links
%i    # Inode number
%n    # File name
%N    # Quoted file name with dereference
%o    # I/O block size
%s    # Total size in bytes
%u    # User ID
%U    # User name
%x    # Time of last access
%y    # Time of last modification
%z    # Time of last change
```

## Practical stat examples

```bash
# File size
stat -c '%s' file.txt

# Permissions (octal)
stat -c '%a' file.txt

# Owner
stat -c '%U' file.txt

# Modified time
stat -c '%y' file.txt

# Inode
stat -c '%i' file.txt
```

## File age

```bash
# Modification time (seconds since epoch)
stat -c '%Y' file.txt

# Calculate age
NOW=$(date +%s)
MTIME=$(stat -c '%Y' file.txt)
AGE=$((NOW - MTIME))
echo "File is $AGE seconds old"

# In days
DAYS=$((AGE / 86400))
echo "File is $DAYS days old"
```

## Compare files

```bash
# Check if files are the same (by inode)
if [ $(stat -c '%i' file1) -eq $(stat -c '%i' file2) ]; then
    echo "Same file (hard link)"
fi

# Check if different
if [ $(stat -c '%Y' file1) -gt $(stat -c '%Y' file2) ]; then
    echo "file1 is newer"
fi
```

## File type checking in scripts

```bash
#!/bin/bash

FILE=$1
TYPE=$(file -b --mime-type "$FILE")

case "$TYPE" in
    text/*)
        echo "Text file"
        cat "$FILE"
        ;;
    image/*)
        echo "Image file"
        ;;
    application/pdf)
        echo "PDF document"
        ;;
    *)
        echo "Unknown type: $TYPE"
        ;;
esac
```

## Verify file integrity

```bash
# Check if file is corrupted
file image.jpg
# If corrupted: image.jpg: data

# Proper format
# image.jpg: JPEG image data, JFIF standard
```

## Find files by type

```bash
# Find all images
find . -type f -exec file --mime-type {} \; | grep image

# Find all PDFs
find . -type f -exec file --mime-type {} \; | grep 'application/pdf'

# Find all text files
find . -type f -exec file --mime-type {} \; | grep 'text/'
```

## File command debugging

```bash
# Debug mode
file -v filename

# Use magic file
file -m /path/to/magic filename

# List magic file locations
file --help | grep "magic"
```

## Stat for directories

```bash
# Directory stats
stat dirname/

# Directory size (not contents)
stat -c '%s' dirname/

# Contents size
du -sh dirname/
```

## Permission analysis

```bash
# Get permissions
PERMS=$(stat -c '%a' file.txt)

# Check if executable
if [ $((PERMS & 0111)) -ne 0 ]; then
    echo "Executable"
fi

# Check if world-writable
if [ $((PERMS & 0002)) -ne 0 ]; then
    echo "World-writable (dangerous!)"
fi
```

## Time comparisons

```bash
# Which file is newer?
if [ $(stat -c '%Y' file1) -gt $(stat -c '%Y' file2) ]; then
    echo "file1 is newer"
else
    echo "file2 is newer"
fi

# Files modified in last 24 hours
find . -type f -mtime -1 -exec stat -c '%n %y' {} \;
```

## Complete file information

```bash
#!/bin/bash

FILE=$1

echo "=== File Information: $FILE ==="
echo "Type:        $(file -b "$FILE")"
echo "MIME:        $(file -b --mime-type "$FILE")"
echo "Size:        $(stat -c '%s' "$FILE") bytes"
echo "Permissions: $(stat -c '%A (%a)' "$FILE")"
echo "Owner:       $(stat -c '%U:%G' "$FILE")"
echo "Inode:       $(stat -c '%i' "$FILE")"
echo "Links:       $(stat -c '%h' "$FILE")"
echo "Modified:    $(stat -c '%y' "$FILE")"
echo "Accessed:    $(stat -c '%x' "$FILE")"
```

## Batch operations

```bash
# Convert file types report
for file in *; do
    echo "$file: $(file -b --mime-type "$file")"
done > file-types.txt

# Find suspicious files
find . -type f -size +100M -exec sh -c '
    echo "Large file: $1 ($(file -b "$1"))"
' _ {} \;
```

## macOS differences

```bash
# macOS stat uses different format
# Linux: stat -c '%Y' file
# macOS: stat -f '%m' file

# Portable script
if stat -c '%Y' file 2>/dev/null; then
    # GNU stat (Linux)
    MTIME=$(stat -c '%Y' file)
else
    # BSD stat (macOS)
    MTIME=$(stat -f '%m' file)
fi
```

## Quick reference

```bash
# File type
file filename                  # Type description
file -b filename               # Brief
file --mime-type filename      # MIME type
file -i filename               # MIME with encoding

# Stat
stat filename                  # All info
stat -c '%s' file             # Size
stat -c '%a' file             # Permissions (octal)
stat -c '%U' file             # Owner
stat -c '%y' file             # Modified time
stat -c '%i' file             # Inode

# Practical
file -b --mime-type file      # Just MIME type
stat -c '%s' file             # Just size in bytes
stat -c '%Y' file             # Timestamp (seconds)
```
