---
title: "NFS Mount & Share"
description: "Configure and mount NFS network file shares."
date: "2025-11-17"
tags: ["nfs", "mount", "network"]
category: "Network"
---

## Install NFS

### Server (Ubuntu/Debian)

```bash
sudo apt install nfs-kernel-server
sudo systemctl start nfs-server
sudo systemctl enable nfs-server
```

### Client

```bash
sudo apt install nfs-common
```

## Server: Export directory

Edit `/etc/exports`:

```
/data 192.168.1.0/24(rw,sync,no_subtree_check)
/home 192.168.1.100(rw,sync,no_root_squash)
/public *(ro,sync,no_subtree_check)
```

### Export options

```
rw              # Read-write
ro              # Read-only
sync            # Synchronous writes
async           # Asynchronous writes
no_subtree_check  # Disable subtree checking
no_root_squash  # Don't map root to nobody
root_squash     # Map root to nobody (default)
all_squash      # Map all users to nobody
```

### Apply exports

```bash
sudo exportfs -a     # Export all
sudo exportfs -r     # Re-export
sudo exportfs -v     # Verbose list
```

## Client: Mount NFS

### Temporary mount

```bash
sudo mount -t nfs server:/data /mnt/data
sudo mount -t nfs 192.168.1.100:/data /mnt/data
```

### Permanent mount (fstab)

Add to `/etc/fstab`:

```
server:/data  /mnt/data  nfs  defaults  0  0
192.168.1.100:/data  /mnt/data  nfs  defaults,_netdev  0  0
```

### Mount options

```
rw,relatime         # Read-write, update access time
soft                # Soft mount (timeout) 
hard                # Hard mount (keep trying)
intr                # Interruptible
timeo=600           # Timeout (0.1s units)
retrans=2           # Retransmissions
rsize=8192          # Read buffer size
wsize=8192          # Write buffer size
_netdev             # Wait for network
```

## Check NFS mounts

```bash
# Client side
mount | grep nfs
df -hT | grep nfs

# Server side - show active connections
sudo showmount -a

# Show exports
showmount -e server
showmount -e 192.168.1.100
```

## Unmount

```bash
sudo umount /mnt/data

#Force unmount
sudo umount -f /mnt/data
sudo umount -l /mnt/data  # Lazy unmount
```

## NFSv4 specific

### Server configuration

Edit `/etc/default/nfs-kernel-server`:
```bash
RPCNFSDCOUNT=8
```

### NFSv4 root

```
/export          192.168.1.0/24(rw,fsid=0,no_subtree_check)
/export/data     192.168.1.0/24(rw,nohide,insecure,no_subtree_check)
```

### Client mount (NFSv4)

```bash
sudo mount -t nfs4 server:/data /mnt/data
```

## Performance tuning

```bash
 # Large rsize/wsize
sudo mount -t nfs -o rsize=131072,wsize=131072 server:/data /mnt/data

# Async (faster, less safe)
sudo mount -t nfs -o async server:/data /mnt/data

# No access time updates
sudo mount -t nfs -o noatime server:/data /mnt/data
```

## Security

### Use Kerberos

Server `/etc/exports`:
```
/data  *(rw,sync,sec=krb5)
```

Client mount:
```bash
sudo mount -t nfs -o sec=krb5 server:/data /mnt/data
```

### Firewall (server)

```bash
# NFSv4 only needs port 2049
sudo ufw allow from 192.168.1.0/24 to any port 2049

# NFSv3 also needs:
sudo ufw allow from 192.168.1.0/24 to any port 111   # portmapper
sudo ufw allow from 192.168.1.0/24 to any port 2049  # nfs
```

## Troubleshooting

### Check NFS service

```bash
sudo systemctl status nfs-server
sudo rpcinfo -p
```

### Test from client

```bash
showmount -e server
rpcinfo -p server
```

### Connection issues

```bash
# Check firewall
sudo iptables -L | grep 2049

# Check network
ping server
telnet server 2049
```

### Permission denied

```bash
# Check export options
sudo exportfs -v

# Check file permissions
ls -ld /data

# Check SELinux (if enabled)
sudo setenforce 0  # Temporary disable
```

## AutoFS (auto-mount)

### Install

```bash
sudo apt install autofs
```

### Configure `/etc/auto.master`

```
/mnt/nfs  /etc/auto.nfs  --timeout=60
```

### Create `/etc/auto.nfs`

```
data  -fstype=nfs,rw  server:/data
share -fstype=nfs,ro  server:/share
```

### Restart

```bash
sudo systemctl restart autofs
```

### Access

```bash
ls /mnt/nfs/data  # Auto-mounts on access
```

## Monitoring

```bash
# NFS statistics
nfsstat

# Client stats
nfsstat -c

# Server stats
nfsstat -s

# Watch NFS activity
watch -n 1 nfsstat
```

## Common use cases

### Home directories

Server:
```
/home  192.168.1.0/24(rw,sync,no_root_squash)
```

Client fstab:
```
server:/home  /home  nfs  defaults,_netdev  0  0
```

### Shared storage

```
/shared  *(rw,sync,no_subtree_check)
```

### Backup destination

```
/backup  backup-server(rw,sync,no_subtree_check)
```
