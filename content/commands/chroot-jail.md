---
title: "Chroot Jail Environment"
description: "Create isolated chroot environments for testing and security."
date: "2025-11-03"
tags: ["chroot", "security", "isolation"]
category: "System"
---

## What is chroot?

Chroot changes the apparent root directory for a process, creating an isolated environment.

## Basic chroot

```bash
sudo chroot /path/to/new/root /bin/bash
```

## Create chroot environment

```bash
# Create directory structure
sudo mkdir -p /mychroot/{bin,lib,lib64,etc,dev,proc,sys}

# Copy bash
sudo cp /bin/bash /mychroot/bin/

# Copy required libraries
ldd /bin/bash
sudo cp /lib/x86_64-linux-gnu/libtinfo.so.6 /mychroot/lib/
sudo cp /lib/x86_64-linux-gnu/libdl.so.2 /mychroot/lib/
sudo cp /lib/x86_64-linux-gnu/libc.so.6 /mychroot/lib/
sudo cp /lib64/ld-linux-x86-64.so.2 /mychroot/lib64/
```

## Automated setup script

```bash
#!/bin/bash

CHROOT_DIR="/mychroot"
mkdir -p $CHROOT_DIR/{bin,lib,lib64,usr/bin}

# Copy binary and dependencies
copy_with_deps() {
    binary=$1
    cp $binary $CHROOT_DIR/$binary
    
    ldd $binary | grep -o '/lib.*\.[0-9]' | while read lib; do
        mkdir -p $CHROOT_DIR/$(dirname $lib)
        cp $lib $CHROOT_DIR/$lib
    done
}

copy_with_deps /bin/bash
copy_with_deps /bin/ls
copy_with_deps /bin/cat
```

## Mount special filesystems

```bash
sudo mount -t proc proc /mychroot/proc
sudo mount -t sysfs sys /mychroot/sys
sudo mount -o bind /dev /mychroot/dev
sudo mount -t devpts devpts /mychroot/dev/pts
```

## Enter chroot

```bash
sudo chroot /mychroot /bin/bash
```

## Exit chroot

```bash
exit
```

## Unmount chroot

```bash
sudo umount /mychroot/dev/pts
sudo umount /mychroot/dev
sudo umount /mychroot/proc
sudo umount /mychroot/sys
```

## Debian/Ubuntu chroot (debootstrap)

```bash
# Install debootstrap
sudo apt install debootstrap

# Create Debian chroot
sudo debootstrap bionic /ubuntu-chroot http://archive.ubuntu.com/ubuntu/

# Enter chroot
sudo chroot /ubuntu-chroot /bin/bash
```

## Arch Linux chroot

```bash
# Install arch-install-scripts
sudo pacman -S arch-install-scripts

# Enter existing Arch system
sudo arch-chroot /mnt
```

## Schroot (recommended)

```bash
# Install
sudo apt install schroot debootstrap

# Create chroot
sudo mkdir /srv/chroot/focal
sudo debootstrap focal /srv/chroot/focal http://archive.ubuntu.com/ubuntu/
```

Configure `/etc/schroot/chroot.d/focal.conf`:
```ini
[focal]
description=Ubuntu 20.04 Focal
directory=/srv/chroot/focal
users=yourusername
root-groups=root
type=directory
```

## Enter schroot

```bash
schroot -c focal
```

## Chroot for recovery

```bash
# Boot from live USB
# Mount root partition
sudo mount /dev/sda1 /mnt

# Mount other required filesystems
sudo mount -t proc proc /mnt/proc
sudo mount -t sysfs sys /mnt/sys
sudo mount -o bind /dev /mnt/dev
sudo mount -t devpts devpts /mnt/dev/pts

# Chroot
sudo chroot /mnt /bin/bash

# Now you can repair system, update grub, etc.
```

## Testing software in chroot

```bash
# Create test environment
sudo debootstrap --variant=buildd focal /srv/chroot/test-env

# Enter
sudo chroot /srv/chroot/test-env

# Install test software
apt update
apt install your-package
```

## Build packages in chroot

```bash
# Ubuntu
sudo apt install pbuilder

# Create base
sudo pbuilder --create

# Build package
sudo pbuilder --build package.dsc
```

## Docker vs Chroot

```
Chroot:
- Simpler, lighter
- Shares kernel
- Less isolation
- Good for recovery, testing

Docker:
- Complete isolation
- Own network stack
- Better for apps
- Easier management
```

## Systemd-nspawn (modern chroot)

```bash
# Create container
sudo debootstrap focal /var/lib/machines/mycontainer

# Boot container
sudo systemd-nspawn -b -D /var/lib/machines/mycontainer

# Login (from another terminal)
sudo machinectl login mycontainer
```

## Chroot with networking

```bash
# Copy resolv.conf
sudo cp /etc/resolv.conf /mychroot/etc/

# Mount proc/sys
sudo mount -t proc proc /mychroot/proc
sudo mount -t sysfs sys /mychroot/sys

# Enter chroot
sudo chroot /mychroot /bin/bash
```

## Security considerations

```bash
# Chroot is NOT a security feature
# It can be escaped with root access
# Use for isolation, not security

# Better alternatives:
# - Docker/Podman
# - systemd-nspawn
# - LXC containers
# - Virtual machines
```

## Cleanup script

```bash
#!/bin/bash

CHROOT_DIR=$1

if [ -z "$CHROOT_DIR" ]; then
    echo "Usage: $0 /path/to/chroot"
    exit 1
fi

# Unmount
for mount in dev/pts dev proc sys; do
    if mountpoint -q "$CHROOT_DIR/$mount"; then
        sudo umount "$CHROOT_DIR/$mount"
    fi
done

# Remove
sudo rm -rf "$CHROOT_DIR"
```

## FHS structure for chroot

```
/mychroot/
├── bin/
├── boot/
├── dev/
├── etc/
├── home/
├── lib/
├── lib64/
├── media/
├── mnt/
├── opt/
├── proc/
├── root/
├── run/
├── sbin/
├── srv/
├── sys/
├── tmp/
├── usr/
└── var/
```

## Useful commands in chroot

```bash
# Update package lists
apt update

# Install sudo
apt install sudo

# Create user
useradd -m -s /bin/bash username

# Set password
passwd username

# Install common tools
apt install vim wget curl git
```
