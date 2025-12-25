---
title: "DD Disk Operations"
description: "Low-level disk operations, cloning, and imaging with dd command."
date: "2025-10-14"
tags: ["dd", "disk", "backup"]
category: "System"
---

## Basic syntax

```bash
dd if=input_file of=output_file
```

## Create disk image

```bash
sudo dd if=/dev/sda of=disk_image.img bs=4M status=progress
```

## Restore disk image

```bash
sudo dd if=disk_image.img of=/dev/sda bs=4M status=progress
```

## Clone disk to disk

```bash
sudo dd if=/dev/sda of=/dev/sdb bs=4M status=progress conv=fsync
```

## Copy partition

```bash
sudo dd if=/dev/sda1 of=/dev/sdb1 bs=4M status=progress
```

## Create bootable USB

```bash
sudo dd if=ubuntu.iso of=/dev/sdb bs=4M status=progress oflag=sync
```

## Backup MBR

```bash
sudo dd if=/dev/sda of=mbr_backup.img bs=512 count=1
```

## Restore MBR

```bash
sudo dd if=mbr_backup.img of=/dev/sda bs=512 count=1
```

## Wipe disk with zeros

```bash
sudo dd if=/dev/zero of=/dev/sda bs=4M status=progress
```

## Secure wipe with random data

```bash
sudo dd if=/dev/urandom of=/dev/sda bs=4M status=progress
```

## Create encrypted backup

```bash
sudo dd if=/dev/sda bs=4M | gzip -c | openssl enc -aes-256-cbc -salt -out disk_backup.img.gz.enc
```

## Restore encrypted backup

```bash
openssl enc -aes-256-cbc -d -in disk_backup.img.gz.enc | gunzip | sudo dd of=/dev/sda bs=4M
```

## Show progress (older dd versions)

```bash
sudo dd if=/dev/sda of=disk.img bs=4M & 
while true; do sudo kill -USR1 $!; sleep 10; done
```

## Block size options

```bash
bs=512       # 512 bytes
bs=1K        # 1 KB
bs=1M        # 1 MB
bs=4M        # 4 MB (recommended for SSDs)
bs=64K       # Good for HDDs
```

## Count specific bytes

```bash
dd if=/dev/sda of=first_100MB.img bs=1M count=100
```

## Skip bytes

```bash
dd if=/dev/sda of=output.img bs=1M skip=100 count=200
```

## Create file of specific size

```bash
dd if=/dev/zero of=1GB_file bs=1M count=1024
```

## Sparse file

```bash
dd if=/dev/zero of=sparse_file bs=1M seek=1024 count=0
```

## Convert to uppercase

```bash
dd if=input.txt of=output.txt conv=ucase
```

## Conversion options

```bash
conv=sync       # Pad blocks with zeros
conv=noerror    # Continue on read errors
conv=notrunc    # Don't truncate output file
conv=fsync      # Sync after write
```

## Combined conversions

```bash
dd if=/dev/sda of=/dev/sdb bs=64K conv=noerror,sync
```

## Test disk write speed

```bash
dd if=/dev/zero of=testfile bs=1G count=1 oflag=direct
```

## Test disk read speed

```bash
dd if=testfile of=/dev/null bs=1G count=1 iflag=direct
```

## Monitor progress with pv

```bash
sudo dd if=/dev/sda | pv | sudo dd of=/dev/sdb bs=4M
```

## Compress on the fly

```bash
sudo dd if=/dev/sda bs=4M | gzip > disk_image.img.gz
```

## Network transfer

```bash
# On receiver
nc -l 9999 | sudo dd of=/dev/sdb bs=4M

# On sender
sudo dd if=/dev/sda bs=4M | nc receiver-ip 9999
```

## Selective backup (first 10GB)

```bash
sudo dd if=/dev/sda of=first_10GB.img bs=1M count=10240
```

## Important flags

```bash
iflag=direct    # Direct I/O for input
oflag=direct    # Direct I/O for output
oflag=sync      # Synchronized I/O for output
status=progress # Show progress
```

## ⚠️ Warning

**dd is dangerous!** Double-check your if/of parameters:
- `if` = input (source)
- `of` = output (destination)

Wrong parameters can destroy data!
