---
title: "LVM Logical Volume Manager"
description: "Manage logical volumes with LVM for flexible disk management."
date: "2025-10-30"
tags: ["lvm", "storage", "disk"]
category: "System"
---

## LVM components

- **PV** (Physical Volume) - Actual disk/partition
- **VG** (Volume Group) - Pool of PVs
- **LV** (Logical Volume) - Virtual partition

## Create physical volume

```bash
sudo pvcreate /dev/sdb
```

## Display physical volumes

```bash
sudo pvdisplay
sudo pvs
```

## Create volume group

```bash
sudo vgcreate vg_data /dev/sdb
```

## Add PV to VG

```bash
sudo vgextend vg_data /dev/sdc
```

## Display volume groups

```bash
sudo vgdisplay
sudo vgs
```

## Create logical volume

```bash
# 10 GB LV
sudo lvcreate -L 10G -n lv_data vg_data

# Use all available space
sudo lvcreate -l 100%FREE -n lv_data vg_data
```

## Display logical volumes

```bash
sudo lvdisplay
sudo lvs
```

## Format LV

```bash
sudo mkfs.ext4 /dev/vg_data/lv_data
```

## Mount LV

```bash
sudo mkdir /mnt/data
sudo mount /dev/vg_data/lv_data /mnt/data
```

## Permanent mount (fstab)

Add to `/etc/fstab`:
```
/dev/vg_data/lv_data  /mnt/data  ext4  defaults  0  2
```

## Extend logical volume

```bash
# Add 5GB
sudo lvextend -L +5G /dev/vg_data/lv_data

# Use all free space
sudo lvextend -l +100%FREE /dev/vg_data/lv_data
```

## Resize filesystem

```bash
# For ext4
sudo resize2fs /dev/vg_data/lv_data

# For XFS
sudo xfs_growfs /mnt/data
```

## Extend LV and filesystem (one command)

```bash
sudo lvextend -L +5G -r /dev/vg_data/lv_data
```

## Reduce logical volume

```bash
# DANGEROUS! Backup first!
# Unmount first
sudo umount /mnt/data

# Check filesystem
sudo e2fsck -f /dev/vg_data/lv_data

# Resize filesystem
sudo resize2fs /dev/vg_data/lv_data 5G

# Reduce LV
sudo lvreduce -L 5G /dev/vg_data/lv_data
```

## Remove logical volume

```bash
sudo umount /mnt/data
sudo lvremove /dev/vg_data/lv_data
```

## Remove volume group

```bash
sudo vgremove vg_data
```

## Remove physical volume

```bash
sudo pvremove /dev/sdb
```

## Move data between PVs

```bash
sudo pvmove /dev/sdb /dev/sdc
```

## Remove PV from VG

```bash
# Move data first
sudo pvmove /dev/sdc

# Remove from VG
sudo vgreduce vg_data /dev/sdc
```

## Create snapshot

```bash
sudo lvcreate -L 1G -s -n lv_data_snapshot /dev/vg_data/lv_data
```

## Mount snapshot

```bash
sudo mkdir /mnt/snapshot
sudo mount /dev/vg_data/lv_data_snapshot /mnt/snapshot
```

## Merge snapshot

```bash
sudo umount /mnt/data
sudo lvconvert --merge /dev/vg_data/lv_data_snapshot
```

## Remove snapshot

```bash
sudo lvremove /dev/vg_data/lv_data_snapshot
```

## Rename LV

```bash
sudo lvrename vg_data old_name new_name
```

## Rename VG

```bash
sudo vgrename old_vg new_vg
```

## Scan for new volumes

```bash
sudo pvscan
sudo vgscan
sudo lvscan
```

## Activate volume group

```bash
sudo vgchange -ay vg_data
```

## Deactivate volume group

```bash
sudo vgchange -an vg_data
```

## Check VG for errors

```bash
sudo vgck vg_data
```

## Backup LVM metadata

```bash
sudo vgcfgbackup vg_data
```

## Restore LVM metadata

```bash
sudo vgcfgrestore vg_data
```

## Display VG usage

```bash
sudo vgdisplay -v vg_data
```

## Thin provisioning

```bash
# Create thin pool
sudo lvcreate -L 100G --thinpool thin_pool vg_data

# Create thin volume
sudo lvcreate -V 50G --thin vg_data/thin_pool -n thin_lv
```

## Striped LV (RAID 0)

```bash
sudo lvcreate -L 10G -i 2 -n lv_striped vg_data
```

## Mirrored LV (RAID 1)

```bash
sudo lvcreate -L 10G -m 1 -n lv_mirror vg_data
```

## Monitor LVM events

```bash
sudo lvmdump
```

## Complete workflow example

```bash
# 1. Prepare disks
sudo pvcreate /dev/sdb /dev/sdc

# 2. Create volume group
sudo vgcreate vg_data /dev/sdb /dev/sdc

# 3. Create logical volume
sudo lvcreate -L 20G -n lv_data vg_data

# 4. Format with ext4
sudo mkfs.ext4 /dev/vg_data/lv_data

# 5. Mount
sudo mkdir /mnt/data
sudo mount /dev/vg_data/lv_data /mnt/data

# 6. Add to fstab
echo "/dev/vg_data/lv_data /mnt/data ext4 defaults 0 2" | sudo tee -a /etc/fstab
```

## Troubleshooting

```bash
# Volume group not found
sudo vgscan
sudo vgchange -ay

# Can't extend (no space)
sudo vgs  # Check free space
sudo pvs  # Check PV space

# LV inactive
sudo lvchange -ay /dev/vg_data/lv_data

# Check filesystem
sudo e2fsck -f /dev/vg_data/lv_data
```
