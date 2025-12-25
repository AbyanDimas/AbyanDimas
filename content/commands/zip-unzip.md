---
title: "ZIP & Unzip Archives"
description: "Create, extract, and manage ZIP archives."
date: "2025-11-24"
tags: ["zip", "unzip", "compression"]
category: "Tools"
---

## Create ZIP archive

```bash
zip archive.zip file.txt
zip archive.zip file1.txt file2.txt file3.txt
```

## ZIP directory

```bash
zip -r archive.zip directory/
```

## Extract ZIP

```bash
unzip archive.zip
```

## Extract to specific directory

```bash
unzip archive.zip -d /path/to/directory
```

## List contents

```bash
unzip -l archive.zip
```

## Test archive integrity

```bash
unzip -t archive.zip
```

## Compression levels

```bash
# No compression (store only)
zip -0 archive.zip file.txt

# Fast compression
zip -1 archive.zip file.txt

# Maximum compression
zip -9 archive.zip file.txt
```

## Password protection

```bash
#Create encrypted
zip -e archive.zip file.txt
# Will prompt for password

# Extract encrypted
unzip archive.zip
# Will prompt for password
```

## Exclude files

```bash
# Exclude pattern
zip -r archive.zip directory/ -x "*.log"

# Exclude multiple patterns
zip -r archive.zip directory/ -x "*.log" "*.tmp"

# Exclude directory
zip -r archive.zip directory/ -x "directory/cache/*"
```

## Add files to existing archive

```bash
zip archive.zip newfile.txt
zip -u archive.zip updatedfile.txt  # Update if newer
```

## Delete from archive

```bash
zip -d archive.zip file.txt
```

## Split archives

```bash
# Split into 100MB parts
zip -s 100m archive.zip -r directory/

# Join split archives
zip -F archive.zip --out complete.zip
```

## Update archive

```bash
# Add only new/modified files
zip -u archive.zip -r directory/

# Freshen existing files only
zip -f archive.zip -r directory/
```

## Verbose output

```bash
zip -v archive.zip file.txt
unzip -v archive.zip
```

## Quiet mode

```bash
zip -q archive.zip file.txt
unzip -q archive.zip
```

## Overwrite without prompting

```bash
unzip -o archive.zip
```

## Never overwrite

```bash
unzip -n archive.zip
```

## View specific file

```bash
unzip -p archive.zip file.txt | less
```

## Extract specific files

```bash
unzip archive.zip file1.txt file2.txt
unzip archive.zip "*.txt"
```

## Exclude on extract

```bash
unzip archive.zip -x "*.log"
```

## Sync directories

```bash
# Archive with sync (delete removed files)
zip -FS archive.zip -r directory/
```

## Date filter

```bash
# Archive only files modified after date
zip archive.zip -r directory/ -t 11/20/2025
```

## Recurse symbolic links

```bash
zip -ry archive.zip directory/
```

## Store paths

```bash
# No directory path
zip -j archive.zip directory/*

# With full path
zip archive.zip directory/file.txt
```

## Pipe to ZIP

```bash
echo "content" | zip archive.zip -
tar cf - directory/ | zip archive.tar.zip -
```

## Check if file exists in archive

```bash
unzip -l archive.zip | grep filename
```

## Common scenarios

### Backup directory

```bash
zip -r backup-$(date +%Y%m%d).zip /home/user/
```

### Website deployment

```bash
zip -r website.zip public_html/ -x "*.git*" "*.cache*"
```

### Archive with verification

```bash
zip -r archive.zip directory/ && unzip -t archive.zip
```

### Compress all PDFs

```bash
zip documents.zip *.pdf
```

## Performance comparison

```bash
# Fast (level 1)
time zip -1 -r fast.zip directory/

# Default (level 6)
time zip -r default.zip directory/

# Maximum (level 9)
time zip -9 -r max.zip directory/
```

## Alternatives

```bash
# tar.gz (better compression for many files)
tar -czf archive.tar.gz directory/

# 7zip (best compression)
7z a -t7z archive.7z directory/

# rar (good compression, proprietary)
rar a archive.rar directory/
```
