---
title: "Linux Disk Management: The Power of LVM"
date: "2025-07-13"
author: "Abyan Dimas"
excerpt: "Logical Volume Manager lets you resize partitions on the fly. Physical Volumes, Volume Groups, and Snapshots explained."
coverImage: "https://images.unsplash.com/photo-1558494949-ef526b0042a0?q=80&w=1200&auto=format&fit=crop"
---

![Hard Drives](https://images.unsplash.com/photo-1558494949-ef526b0042a0?q=80&w=1200&auto=format&fit=crop)

In the old days, disk partitions (like `/dev/sda1`) were rigid. If `/var` filled up and `/home` was empty, you had to reformat. **LVM (Logical Volume Manager)** adds a layer of abstraction.

## The Hierarchy

1.  **Physical Volume (PV)**: The actual disk or partition (`/dev/sdb`).
2.  **Volume Group (VG)**: A pool of storage created by combining PVs.
3.  **Logical Volume (LV)**: The virtual partition you actually format and mount (`/dev/mapper/vg-lv_root`).

## Scenario: Expanding Storage

You add a new 100GB hard drive (`/dev/sdc`) and want to add it to your root filesystem.

1.  **Initialize PV**: `pvcreate /dev/sdc`
2.  **Extend VG**: `vgextend ubuntu-vg /dev/sdc` (Adds disk to the pool).
3.  **Extend LV**: `lvextend -l +100%FREE /dev/ubuntu-vg/root` (Give space to partition).
4.  **Resize FS**: `resize2fs /dev/ubuntu-vg/root` (Tell Linux filesystem to use new space).

Done. **Online**. No reboot required.

## Snapshots

LVM allows you to take a "frozen" snapshot of a volume.
Ideal for backups: Take snapshot -> Backup snapshot -> Delete snapshot.
This ensures the backup is consistent even if the live data changes during the copy process.
