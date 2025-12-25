---
title: "RAID Management with mdadm"
description: "Manage software RAID arrays with mdadm for data redundancy."
date: "2025-10-31"
tags: ["raid", "mdadm", "storage"]
category: "System"
---

## Install mdadm

```bash
sudo apt install mdadm
```

## RAID levels

- **RAID 0** - Striping (performance, no redundancy)
- **RAID 1** - Mirroring (redundancy)
- **RAID 5** - Striping + parity (min 3 disks)
- **RAID 6** - Double parity (min 4 disks)
- **RAID 10** - Mirror + Stripe (min 4 disks)

## Create RAID 1 array

```bash
sudo mdadm --create /dev/md0 --level=1 --raid-devices=2 /dev/sdb /dev/sdc
```

## Create RAID 5 array

```bash
sudo mdadm --create /dev/md0 --level=5 --raid-devices=3 /dev/sdb /dev/sdc /dev/sdd
```

## Create RAID 10 array

```bash
sudo mdadm --create /dev/md0 --level=10 --raid-devices=4 /dev/sdb /dev/sdc /dev/sdd /dev/sde
```

## View RAID status

```bash
cat /proc/mdstat
```

## Detailed RAID info

```bash
sudo mdadm --detail /dev/md0
```

## Format RAID array

```bash
sudo mkfs.ext4 /dev/md0
```

## Mount RAID array

```bash
sudo mkdir /mnt/raid
sudo mount /dev/md0 /mnt/raid
```

## Save RAID configuration

```bash
sudo mdadm --detail --scan | sudo tee -a /etc/mdadm/mdadm.conf
sudo update-initramfs -u
```

## Add to fstab

```bash
echo "/dev/md0 /mnt/raid ext4 defaults 0 2" | sudo tee -a /etc/fstab
```

## Add disk to array

```bash
sudo mdadm --add /dev/md0 /dev/sde
```

## Mark disk as failed

```bash
sudo mdadm --manage /dev/md0 --fail /dev/sdc
```

## Remove failed disk

```bash
sudo mdadm --manage /dev/md0 --remove /dev/sdc
```

## Replace failed disk

```bash
# 1. Mark as failed
sudo mdadm --manage /dev/md0 --fail /dev/sdc

# 2. Remove from array
sudo mdadm --manage /dev/md0 --remove /dev/sdc

# 3. Add new disk
sudo mdadm --manage /dev/md0 --add /dev/sdf
```

## Check RAID consistency

```bash
echo check > /sys/block/md0/md/sync_action
cat /sys/block/md0/md/mismatch_cnt
```

## Monitor RAID

```bash
sudo mdadm --monitor --scan --daemonise
```

## Stop RAID array

```bash
sudo umount /mnt/raid
sudo mdadm --stop /dev/md0
```

## Start RAID array

```bash
sudo mdadm --assemble /dev/md0 /dev/sdb /dev/sdc
```

## Grow RAID array (add disks)

```bash
# Add disk first
sudo mdadm --add /dev/md0 /dev/sde

# Grow array
sudo mdadm --grow /dev/md0 --raid-devices=4
```

## Convert RAID level

```bash
# Add spare first
sudo mdadm --add /dev/md0 /dev/sde

# Convert RAID 1 to RAID 5
sudo mdadm --grow /dev/md0 --level=5 --raid-devices=3
```

## Examine disk

```bash
sudo mdadm --examine /dev/sdb
```

## Remove RAID array

```bash
# 1. Unmount
sudo umount /mnt/raid

# 2. Stop array
sudo mdadm --stop /dev/md0

# 3. Zero superblocks
sudo mdadm --zero-superblock /dev/sdb /dev/sdc

# 4. Remove from config
sudo vi /etc/mdadm/mdadm.conf
```

## Create RAID with spare

```bash
sudo mdadm --create /dev/md0 --level=5 --raid-devices=3 --spare-devices=1 \
  /dev/sdb /dev/sdc /dev/sdd /dev/sde
```

## Set write-intent bitmap

```bash
sudo mdadm --grow /dev/md0 --bitmap=internal
```

## View resync progress

```bash
watch -n 1 cat /proc/mdstat
```

## Email notifications

Edit `/etc/mdadm/mdadm.conf`:
```
MAILADDR your-email@example.com
```

## Test email notification

```bash
sudo mdadm --monitor --scan --test
```

## Check RAID health

```bash
sudo mdadm --detail /dev/md0 | grep -i state
```

## Recover RAID metadata

```bash
sudo mdadm --assemble --scan
```

## Force assemble

```bash
sudo mdadm --assemble --force /dev/md0 /dev/sdb /dev/sdc
```

## Read performance test

```bash
sudo hdparm -tT /dev/md0
```

## Benchmark with dd

```bash
# Write test
sudo dd if=/dev/zero of=/mnt/raid/testfile bs=1G count=1 oflag=direct

# Read test
sudo dd if=/mnt/raid/testfile of=/dev/null bs=1G count=1 iflag=direct
```

## RAID 0 example (2 disks)

```bash
sudo mdadm --create /dev/md0 --level=0 --raid-devices=2 /dev/sdb /dev/sdc
sudo mkfs.ext4 /dev/md0
sudo mount /dev/md0 /mnt/raid0
```

## RAID 1 example (2 disks)

```bash
sudo mdadm --create /dev/md0 --level=1 --raid-devices=2 /dev/sdb /dev/sdc
sudo mkfs.ext4 /dev/md0
sudo mount /dev/md0 /mnt/raid1
```

## Complete RAID 5 setup

```bash
# Create array
sudo mdadm --create /dev/md0 --level=5 --raid-devices=3 \
  /dev/sdb /dev/sdc /dev/sdd

# Wait for sync
cat /proc/mdstat

# Format
sudo mkfs.ext4 /dev/md0

# Mount
sudo mkdir /mnt/raid5
sudo mount /dev/md0 /mnt/raid5

# Save config
sudo mdadm --detail --scan | sudo tee -a /etc/mdadm/mdadm.conf

# Add to fstab
echo "/dev/md0 /mnt/raid5 ext4 defaults 0 2" | sudo tee -a /etc/fstab

# Update initramfs
sudo update-initramfs -u
```

## Troubleshooting

```bash
# Array won't start
sudo mdadm --assemble --scan --verbose

# Check journal
sudo journalctl -u mdadm

# Examine all disks
sudo mdadm --examine /dev/sd[b-e]

# Reset superblock (DANGEROUS!)
sudo mdadm --zero-superblock /dev/sdb
```
