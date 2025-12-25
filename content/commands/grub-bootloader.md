---
title: "GRUB Bootloader Management"
description: "Configure and troubleshoot GRUB bootloader."
date: "2025-11-20"
tags: ["grub", "boot", "bootloader"]
category: "System"
---

## GRUB configuration file

```bash
# Main config (don't edit directly)
/boot/grub/grub.cfg

# Settings to edit
/etc/default/grub

# Custom entries
/etc/grub.d/40_custom
```

## Update GRUB

```bash
# Ubuntu/Debian
sudo update-grub

# RHEL/CentOS/Fedora
sudo grub2-mkconfig -o /boot/grub2/grub.cfg

# UEFI systems
sudo grub2-mkconfig -o /boot/efi/EFI/fedora/grub.cfg
```

## Common settings in `/etc/default/grub`

```bash
# Default boot entry (0-based)
GRUB_DEFAULT=0
GRUB_DEFAULT=saved  # Remember last choice

# Timeout (seconds)
GRUB_TIMEOUT=5
GRUB_TIMEOUT=0  # Boot immediately

# Kernel parameters
GRUB_CMDLINE_LINUX="quiet splash"
GRUB_CMDLINE_LINUX_DEFAULT="quiet"

# Hide GRUB menu
GRUB_TIMEOUT_STYLE=hidden

# Resolution
GRUB_GFXMODE=1024x768
```

## Install GRUB

```bash
# BIOS
sudo grub-install /dev/sda

# UEFI
sudo grub-install --target=x86_64-efi --efi-directory=/boot/efi --bootloader-id=GRUB

# Specific partition
sudo grub-install --root-directory=/mnt /dev/sda
```

## Rescue from Live USB

```bash
# 1. Boot from Live USB

# 2. Mount root partition
sudo mount /dev/sda1 /mnt

# 3. Mount boot (if separate)
sudo mount /dev/sda2 /mnt/boot

# 4. Mount system directories
sudo mount --bind /dev /mnt/dev
sudo mount --bind /dev/pts /mnt/dev/pts
sudo mount --bind /proc /mnt/proc
sudo mount --bind /sys /mnt/sys

# 5. Chroot
sudo chroot /mnt

# 6. Reinstall GRUB
grub-install /dev/sda
update-grub

# 7. Exit and reboot
exit
sudo reboot
```

## Custom menu entry

Edit `/etc/grub.d/40_custom`:

```bash
menuentry "Windows 10" {
    insmod part_msdos
    insmod ntfs
    set root='(hd0,msdos1)'
    chainloader +1
}

menuentry "Ubuntu" {
   set root='(hd0,5)'
    linux /boot/vmlinuz-5.4.0-42-generic root=/dev/sda5 ro quiet splash
    initrd /boot/initrd.img-5.4.0-42-generic
}
```

Then update:
```bash
sudo update-grub
```

## Kernelparameters

### Temporary (at boot)

Press `e` at GRUB menu, edit kernel line, press Ctrl+X or F10 to boot

### Permanent

Edit `/etc/default/grub`:
```bash
GRUB_CMDLINE_LINUX="quiet splash nomodeset"
```

Common parameters:
```
quiet           # Less verbose
splash          # Show splash screen
nomodeset       # Disable GPU drivers
acpi=off        # Disable ACPI
noapic          # Disable APIC
single          # Single-user mode
init=/bin/bash  # Emergency shell
```

## Set default boot entry

```bash
# By number (0-based)
sudo grub-set-default 0

# By menu entry name
sudo grub-set-default "Ubuntu, with Linux 5.4.0-42-generic"

# Remember last choice
# In /etc/default/grub:
GRUB_DEFAULT=saved
GRUB_SAVEDEFAULT=true
```

## List menu entries

```bash
grep menuentry /boot/grub/grub.cfg
```

## Password protect GRUB

```bash
# Generate password hash
grub-mkpasswd-pbkdf2

# Add to /etc/grub.d/40_custom:
set superusers="admin"
password_pbkdf2 admin grub.pbkdf2.sha512.10000.HASH_HERE
```

## GRUB rescue mode

If you see `grub rescue>`:

```bash
# List partitions
ls

# Find root partition
ls (hd0,1)/
ls (hd0,2)/

# Set root
set root=(hd0,1)
set prefix=(hd0,1)/boot/grub

# Load normal mode
insmod normal
normal
```

Then boot into OS and reinstall GRUB.

## Disable graphical boot

```bash
# In /etc/default/grub:
#GRUB_CMDLINE_LINUX_DEFAULT="quiet splash"
GRUB_CMDLINE_LINUX_DEFAULT=""
GRUB_TERMINAL=console
```

## Troubleshooting

### GRUB not showing

```bash
# Increase timeout
GRUB_TIMEOUT=10

# Press Shift during boot (BIOS)
# Press Esc during boot (UEFI)
```

### Wrong default OS

```bash
sudo grub-set-default 0
sudo update-grub
```

### Error: no such partition

```bash
# Boot from Live USB and reinstall GRUB
sudo grub-install /dev/sda
sudo update-grub
```

## Dual boot with Windows

```bash
# Install os-prober
sudo apt install os-prober

# Enable os-prober in /etc/default/grub:
GRUB_DISABLE_OS_PROBER=false

# Update GRUB
sudo update-grub
```

## UEFI boot order

```bash
# List boot entries
efiboo tmgr

# Change boot order
sudo efibootmgr -o 0003,0001,0002

# Delete entry
sudo efibootmgr -b 0003 -B
```

## Backup GRUB config

```bash
sudo cp /boot/grub/grub.cfg /boot/grub/grub.cfg.backup
```

## Check GRUB version

```bash
grub-install --version
```
