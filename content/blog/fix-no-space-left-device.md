---
title: "How to Fix 'No Space Left on Device' Error in Linux: Complete Disk Troubleshooting"
date: "2025-08-12"
author: "Abyan Dimas"
excerpt: "Solve Linux disk space issues. Fix 'no space left on device', understand df vs du, handle inode exhaustion, and clean logs properly."
coverImage: "https://images.unsplash.com/photo-1558494949-ef526b0042a0?q=80&w=1200&auto=format&fit=crop"
---

![Hard Disk Storage](https://images.unsplash.com/photo-1558494949-ef526b0042a0?q=80&w=1200&auto=format&fit=crop)

## The Problem: Can't Write to Disk

You try to save a file, deploy an app, or run a script and get:

```bash
$ echo "test" > file.txt
bash: file.txt: No space left on device

$ docker pull nginx
Error: insufficient space on device
```

Or worse, applications crash mysteriously and logs show disk errors.

**Don't panic.** This guide will diagnose and fix it permanently.

---

## Error #1: No Space Left on Device (Disk 100% Full)

### Symptom

```bash
$ touch test.txt
touch: cannot touch 'test.txt': No space left on device
```

### Step 1: Check Disk Space

```bash
df -h
```

**Example Output:**
```
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1        20G   20G     0 100% /
/dev/sdb1       100G   80G   20G  80% /data
tmpfs           2.0G  1.5G  500M  75% /tmp
```

**Interpretation:**
- `Size` - Total capacity
- `Used` - Space occupied
- `Avail` - Space available
- `Use%` - Percentage used
- `Mounted on` - Where filesystem is mounted

**Root Cause**: `/dev/sda1` (root filesystem) is 100% full.

### Step 2: Find What's Using Space

Navigate to root and check directories:

```bash
cd /
sudo du -h --max-depth=1 | sort -hr | head -20
```

**Example Output:**
```
18G     .
12G     ./var
3.5G    ./usr
1.2G    ./home
800M    ./boot
...
```

**Culprit**: `/var` is using 12GB. Dig deeper:

```bash
cd /var
sudo du -h --max-depth=1 | sort -hr | head -20
```

Output:
```
12G     .
10G     ./log
1.5G    ./lib
...
```

**Found it**: `/var/log` has 10GB of logs!

### Step 3: Investigate Large Log Files

```bash
sudo du -h /var/log/* | sort -hr | head -20
```

Output:
```
8.5G    /var/log/syslog
1.2G    /var/log/nginx/access.log
300M    /var/log/mysql/error.log
```

`syslog` is the problem.

### Step 4: Clean Up Safely

**Option 1: Delete Old Logs (Safe)**

```bash
# Delete logs older than 7 days
sudo find /var/log -name "*.log" -type f -mtime +7 -delete

# Or compress them first
sudo find /var/log -name "*.log" -type f -mtime +7 -exec gzip {} \;
```

**Option 2: Truncate Large Log Files**

```bash
# DON'T DELETE active log files - truncate instead
sudo truncate -s 0 /var/log/syslog
sudo truncate -s 0 /var/log/nginx/access.log
```

**Why truncate instead of delete?**
If a process has the file open, deleting it won't free space until the process restarts. Truncating empties it immediately.

**Option 3: Use journalctl for Systemd Logs**

```bash
# Check journal size
sudo journalctl --disk-usage
# Output: Archived and active journals take up 8.0G in the file system.

# Clean journals older than 7 days
sudo journalctl --vacuum-time=7d

# Or keep max size
sudo journalctl --vacuum-size=500M
```

### Step 5: Verify Space Freed

```bash
df -h /
```

Output:
```
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1        20G   12G   8G  60% /
```

**Success!** 8GB freed.

---

## Error #2: Disk Shows Free Space But Can't Write

### Symptom

```bash
$ df -h
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1        20G   15G   5G  75% /

$ touch test.txt
touch: cannot touch 'test.txt': No space left on device
```

**Paradox**: `df` shows 5GB available, but system says no space!

### Root Cause: Inode Exhaustion

Linux filesystems have two limits:
1. **Disk space** (measured in bytes)
2. **Inodes** (metadata for each file/directory)

You can run out of inodes while having disk space available.

### Step 1: Check Inode Usage

```bash
df -i
```

**Example Output:**
```
Filesystem      Inodes  IUsed   IFree IUse% Mounted on
/dev/sda1      1310720 1310720     0  100% /
```

**Diagnosis**: 100% inode usage! You have too many small files.

### Step 2: Find Directory with Most Files

```bash
# Count files in each directory
sudo find / -xdev -type f | cut -d "/" -f 2 | sort | uniq -c | sort -nr | head -10
```

Or more specifically:

```bash
# Count files in /var subdirectories
for dir in /var/*; do 
    echo -n "$dir: "
    sudo find "$dir" -type f | wc -l
done
```

**Example Output:**
```
/var/spool/postfix: 850000
/var/log: 12000
/var/cache: 5000
```

**Culprit**: `/var/spool/postfix` has 850,000 small email files!

### Step 3: Clean Up

```bash
# Delete old mail queue files (if not using Postfix)
sudo rm -rf /var/spool/postfix/deferred/*
sudo rm -rf /var/spool/postfix/maildrop/*

# Restart service
sudo systemctl restart postfix
```

### Step 4: Verify Inodes Freed

```bash
df -i
```

Output:
```
Filesystem      Inodes  IUsed   IFree IUse% Mounted on
/dev/sda1      1310720 450000  860720  35% /
```

**Fixed!**

---

## Error #3: Docker Filling Disk

### Symptom

```bash
df -h
```

Output shows `/var/lib/docker` using massive space.

### Step 1: Check Docker Disk Usage

```bash
sudo docker system df
```

**Example Output:**
```
TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
Images          15        5         8.5GB     4.2GB (49%)
Containers      20        3         1.2GB     900MB (75%)
Local Volumes   10        2         12GB      10GB (83%)
Build Cache     0         0         0B        0B
```

### Step 2: Clean Up Docker

```bash
# Remove stopped containers
docker container prune

# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Nuclear option: Remove everything not in use
docker system prune -a --volumes
```

**Warning**: This removes ALL unused images and volumes. Make sure you know what you're doing.

### Step 3: Verify Space Freed

```bash
docker system df
df -h /var/lib/docker
```

---

## Understanding `df` vs `du` Difference

### The Difference Explained

**`df` (Disk Free)**:
- Shows **filesystem-level** space
- Reports what the kernel sees
- Includes deleted files still held open by processes

**`du` (Disk Usage)**:
- Shows **actual file sizes** on disk
- Walks the directory tree
- Only sees existing files

### Common Scenario: `df` and `du` Don't Match

```bash
$ df -h /
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1        20G   18G   2G  90% /

$ sudo du -sh /
12G     /
```

**Why?** A deleted file is still open by a running process (like a log file).

### Step 1: Find Deleted But Open Files

```bash
sudo lsof | grep deleted | grep -v '/tmp'
```

**Example Output:**
```
nginx     1234  www-data    3w   REG   8,1  5368709120  deleted /var/log/nginx/access.log (deleted)
```

Nginx has a 5GB deleted log file still open!

### Step 2: Fix It

**Option 1: Restart the Process**

```bash
sudo systemctl restart nginx
```

**Option 2: Truncate via File Descriptor** (Advanced)

```bash
# Find the file descriptor
sudo ls -l /proc/1234/fd | grep deleted

# Truncate it
sudo truncate -s 0 /proc/1234/fd/3
```

---

## Cleaning Logs Properly

### 1. Systemd Journal Logs

```bash
# Check size
sudo journalctl --disk-usage

# Keep last 7 days
sudo journalctl --vacuum-time=7d

# Keep max 500MB
sudo journalctl --vacuum-size=500M

# Make it permanent
sudo nano /etc/systemd/journald.conf
# Add:
SystemMaxUse=500M
MaxRetentionSec=7day

sudo systemctl restart systemd-journald
```

### 2. Application Logs

```bash
# Find large log files
sudo find /var/log -type f -size +100M -exec ls -lh {} \;

# Truncate safely (don't delete!)
sudo truncate -s 0 /var/log/nginx/access.log
```

### 3. Rotate Logs with Logrotate

Create `/etc/logrotate.d/myapp`:

```
/var/log/myapp/*.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
    create 0640 www-data www-data
    sharedscripts
    postrotate
        systemctl reload myapp
    endscript
}
```

Test it:

```bash
sudo logrotate -d /etc/logrotate.d/myapp  # Dry run
sudo logrotate -f /etc/logrotate.d/myapp  # Force rotate
```

### 4. Clean Old Kernels (Ubuntu/Debian)

Old kernels can occupy 500MB+ each.

```bash
# List installed kernels
dpkg --list | grep linux-image

# Remove old kernels (keep current and one previous)
sudo apt autoremove --purge
```

---

## Common Mistakes and Pitfalls

### Mistake #1: Deleting Active Log Files

**Wrong:**
```bash
sudo rm /var/log/nginx/access.log
```

**Problem**: Process still has file open. Space won't be freed until Nginx restarts.

**Correct:**
```bash
sudo truncate -s 0 /var/log/nginx/access.log
# or
sudo systemctl reload nginx  # After deleting
```

### Mistake #2: Using `rm -rf /var/log/*`

**Danger**: You might delete important system logs or socket files.

**Correct Approach**:
```bash
# Target specific patterns
sudo find /var/log -name "*.log" -type f -mtime +30 -delete
```

### Mistake #3: Not Monitoring Disk Space

Set up monitoring **before** it becomes critical.

```bash
# Simple cron alert
#!/bin/bash
USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
if [ $USAGE -gt 80 ]; then
    echo "Disk usage is ${USAGE}%" | mail -s "Disk Alert" admin@example.com
fi
```

Save as `/usr/local/bin/disk-alert.sh`, make executable, add to crontab:

```bash
chmod +x /usr/local/bin/disk-alert.sh
crontab -e
# Add:
0 */6 * * * /usr/local/bin/disk-alert.sh
```

### Mistake #4: Ignoring Inode Usage

Always check **both** disk space and inodes:

```bash
df -h   # Disk space
df -i   # Inodes
```

---

## Prevention: Best Practices

### 1. Set Up Logrotate for All Apps

Every application should have a logrotate config.

### 2. Monitor Disk Usage

Use monitoring tools:
- **Prometheus + Node Exporter**: For metrics
- **Netdata**: Real-time dashboard
- **Simple cron script**: Email alerts

### 3. Use Separate Partitions

Don't put everything on root partition:

```
/           - 20GB  (OS only)
/home       - 50GB  (User data)
/var        - 30GB  (Logs, cache)
/data       - 100GB (Application data)
```

If `/var` fills up, it won't crash your entire system.

### 4. Docker Pruning Automation

Add to crontab:

```bash
# Weekly Docker cleanup
0 3 * * 0 docker system prune -af --volumes
```

### 5. Set Filesystem Reserved Space

Reserve 5% for root user (prevents complete lockout):

```bash
sudo tune2fs -m 5 /dev/sda1
```

---

## Emergency: Disk 100% and Can't Login

If disk is so full you can't login via SSH:

### Step 1: Boot into Single User Mode

At GRUB menu:
1. Press `e` to edit
2. Find line starting with `linux`
3. Add `single` or `emergency` to end
4. Press `Ctrl+X` to boot

### Step 2: Remount Root as Read-Write

```bash
mount -o remount,rw /
```

### Step 3: Free Space

```bash
# Truncate largest log
truncate -s 0 /var/log/syslog

# Or delete old logs
find /var/log -name "*.log" -type f -mtime +7 -delete
```

### Step 4: Reboot

```bash
reboot
```

---

## Quick Reference Commands

```bash
# Check disk space
df -h

# Check inode usage
df -i

# Find large directories
du -h / --max-depth=1 | sort -hr | head -20

# Find large files
find / -type f -size +100M -exec ls -lh {} \;

# Check deleted but open files
lsof | grep deleted

# Clean system logs
journalctl --vacuum-time=7d

# Clean Docker
docker system prune -a

# Truncate log file safely
truncate -s 0 /path/to/logfile

# Check what process is using a file
lsof /path/to/file
```

---

## Troubleshooting Workflow

When you get "No space left on device":

1. Check disk space: `df -h`
2. Check inode usage: `df -i`
3. If disk full: Find large directories with `du`
4. If inodes full: Find directories with many files
5. Clean logs: Use `journalctl --vacuum` or `truncate`
6. Check Docker: `docker system df` and `docker system prune`
7. Check for deleted open files: `lsof | grep deleted`
8. Verify: `df -h` and `df -i` again

---

## Conclusion

Disk space issues are **preventable** with:
- Proper log rotation
- Regular cleanup automation
- Monitoring and alerts
- Understanding both disk space AND inodes

**Master these commands and you'll never panic about "No space left on device" again.**

> **Pro Tip**: Always keep at least 20% free space on production servers. This leaves room for emergency operations and prevents performance degradation.
