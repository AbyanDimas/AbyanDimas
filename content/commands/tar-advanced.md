---
title: "Advanced Tar Operations"
description: "Advanced tar archive operations, compression, and extraction techniques."
date: "2025-12-12"
tags: ["tar", "archive", "compression", "backup"]
category: "Tools"
---

## Create archives

```bash
# Create tar (uncompressed)
tar -cf archive.tar files/

# Create with gzip
tar -czf archive.tar.gz files/

# Create with bzip2
tar -cjf archive.tar.bz2 files/

# Create with xz
tar -cJf archive.tar.xz files/
```

## Extract archives

```bash
# Auto-detect compression
tar -xf archive.tar.gz

# Specific compression
tar -xzf archive.tar.gz    # gzip
tar -xjf archive.tar.bz2   # bzip2
tar -xJf archive.tar.xz    # xz

# Extract to specific directory
tar -xf archive.tar -C /destination/
```

## List contents

```bash
# List files in archive
tar -tf archive.tar.gz

# Verbose listing
tar -tvf archive.tar.gz

# Search for file
tar -tf archive.tar.gz | grep filename
```

## Append to archive

```bash
# Add files (uncompressed tar only)
tar -rf archive.tar newfile.txt

# Can't append to compressed archives
# Must extract, add files, and recreate
```

## Exclude files

```bash
# Exclude pattern
tar -czf backup.tar.gz --exclude='*.log' directory/

# Exclude multiple
tar -czf backup.tar.gz --exclude='*.log' --exclude='*.tmp' directory/

# Exclude from file
tar -czf backup.tar.gz --exclude-from=exclude-list.txt directory/
```

### exclude-list.txt example

```
*.log
*.tmp
.git
node_modules
__pycache__
```

## Incremental backups

```bash
# Full backup
tar -czf full-backup.tar.gz -g snapshot.snar directory/

# Incremental backup (changes since last)
tar -czf incremental.tar.gz -g snapshot.snar directory/

# Restore full + incrementals in order
tar -xzf full-backup.tar.gz -g /dev/null
tar -xzf incremental.tar.gz -g /dev/null
```

## Compression comparison

```bash
# gzip (fast, moderate compression)
tar -czf file.tar.gz directory/

# bzip2 (slower, better compression)
tar -cjf file.tar.bz2 directory/

# xz (slowest, best compression)
tar -cJf file.tar.xz directory/

# Check sizes
ls -lh file.tar.*
```

## Preserve permissions

```bash
# Preserve all attributes
tar -czpf archive.tar.gz directory/

# Extract preserving permissions
tar -xzpf archive.tar.gz
```

## Verbose output

```bash
# Show files being archived
tar -czvf archive.tar.gz directory/

# Show progress (GNU tar)
tar -czf archive.tar.gz --checkpoint=1000 --checkpoint-action=dot directory/
```

## Split large archives

```bash
# Create multi-volume archive
tar -czf - largedir/ | split -b 1G - archive.tar.gz.

# Restore
cat archive.tar.gz.* | tar -xzf -
```

## Pipe operations

```bash
# Archive and transfer over SSH
tar -czf - directory/ | ssh user@server 'tar -xzf - -C /destination'

# Create and encrypt
tar -czf - files/ | gpg -c > encrypted.tar.gz.gpg

# Decrypt and extract
gpg -d encrypted.tar.gz.gpg | tar -xzf -
```

## Differential backup

```bash
# Backup only files newer than timestamp
touch -t 202512010000 timestamp
tar -czf incremental.tar.gz --newer-mtime=timestamp directory/

# Or newer than file
tar -czf incremental.tar.gz --newer=timestamp directory/
```

## Extract specific files

```bash
# Extract one file
tar -xzf archive.tar.gz path/to/file.txt

# Extract multiple files
tar -xzf archive.tar.gz file1 file2 dir/

# Extract by pattern
tar -xzf archive.tar.gz --wildcards '*.txt'
```

## Update archive

```bash
# Update changed files (uncompressed only)
tar -uf archive.tar changed-file.txt

# Or use:
tar -czf archive-new.tar.gz directory/
mv archive-new.tar.gz archive.tar.gz
```

## Verify archive

```bash
# Test archive integrity
tar -tzf archive.tar.gz > /dev/null

# Compare with filesystem
tar -df archive.tar.gz

# Verify after creation
tar -czf backup.tar.gz directory/ && tar -tzf backup.tar.gz > /dev/null && echo "OK"
```

## Dereference symbolic links

```bash
# Follow symlinks (archive target, not link)
tar -czfh archive.tar.gz directory/
```

## Ownership handling

```bash
# Change ownership during extraction
sudo tar -xzf archive.tar.gz --same-owner

# Extract as current user
tar -xzf archive.tar.gz --no-same-owner

# Numeric IDs (useful across systems)
tar -czf archive.tar.gz --numeric-owner directory/
```

## Custom compression

```bash
# Use pigz (parallel gzip)
tar -cf - directory/ | pigz > archive.tar.gz

# Use lz4 (fast)
tar -cf - directory/ | lz4 > archive.tar.lz4

# Use zstd (good balance)
tar -cf - directory/ | zstd > archive.tar.zst
```

## Progress bar

```bash
# With pv
tar -czf - directory/ | pv > archive.tar.gz

# During extraction
pv archive.tar.gz | tar -xzf -
```

## Automated backup script

```bash
#!/bin/bash

BACKUP_DIR="/backup"
DATE=$(date +%Y%m%d)
SOURCE="/data"

# Create backup
tar -czf "$BACKUP_DIR/backup-$DATE.tar.gz" \
    --exclude='*.tmp' \
    --exclude='*.log' \
    "$SOURCE"

# Keep only last 7 days
find "$BACKUP_DIR" -name "backup-*.tar.gz" -mtime +7 -delete

# Verify
tar -tzf "$BACKUP_DIR/backup-$DATE.tar.gz" > /dev/null && \
    echo "Backup successful" || \
    echo "Backup failed!"
```

## Performance tips

```bash
# Faster compression (level 1)
tar -czf archive.tar.gz --gzip --best=1 directory/

# Use multiple cores (pigz)
tar -cf - directory/ | pigz -p 4 > archive.tar.gz

# Exclude unnecessary files
tar -czf backup.tar.gz --exclude-caches --exclude-vcs directory/
```

## Remote backup

```bash
# Backup to remote server
tar -czf - /data | ssh backup-server 'cat > /backups/data.tar.gz'

# Backup from remote
ssh remote-server 'tar -czf - /data' > remote-backup.tar.gz
```

## Security considerations

```bash
# Encrypt while archiving
tar -czf - sensitive/ | gpg --encrypt -r user@email.com > secure.tar.gz.gpg

# Decrypt and extract
gpg --decrypt secure.tar.gz.gpg | tar -xzf -

# Set umask before extraction
umask 077
tar -xzf archive.tar.gz
```

## Quick reference

```bash
# Create
tar -czf archive.tar.gz directory/      # gzip
tar -cjf archive.tar.bz2 directory/     # bzip2
tar -cJf archive.tar.xz directory/      # xz

# Extract
tar -xzf archive.tar.gz                 # gzip
tar -xf archive.tar.gz -C /dest/        # to directory

# List
tar -tzf archive.tar.gz                 # list files
tar -tvzf archive.tar.gz                # verbose list

# Exclude
tar -czf backup.tar.gz --exclude='*.log' dir/

# Preserve permissions
tar -czpf archive.tar.gz directory/

# Incremental
tar -czf backup.tar.gz -g snapshot.snar directory/
```
