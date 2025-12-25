---
title: "Free & VM Memory Analysis"
description: "Analyze system memory usage with free, vmstat, and memory tools."
date: "2025-11-15"
tags: ["memory", "free", "vmstat"]
category: "System"
---

## FREE - Memory overview

### Basic usage

```bash
free
free -h  # Human readable
free -m  # In MB
free -g  # In GB
```

### Continuous monitoring

```bash
free -s 5  # Update every 5 seconds
watch -n 1 free -h
```

### Output explained

```
              total        used        free      shared  buff/cache   available
Mem:           15Gi       8.2Gi       1.3Gi       492Mi       5.8Gi       6.4Gi
Swap:         2.0Gi          0B       2.0Gi
```

- **total**: Total RAM
- **used**: Used by processes
- **free**: Completely unused
- **shared**: Tmpfs/sh mem
- **buff/cache**: Kernel buffers/cache
- **available**: Available for apps

### Key metric

**Available** is most important - shows memory available for new apps without swapping.

## VMSTAT - Virtual memory stats

### Basic usage

```bash
vmstat
vmstat 5      # Update every 5 seconds
vmstat 5 10   # 10 updates, 5 seconds apart
```

### Output columns

```
procs -----------memory---------- ---swap-- -----io---- -system-- ------cpu-----
 r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st
 2  0      0 1358636 248572 5959248    0    0    15    47  156  276  8  2 90  0  0
```

Key columns:
- **r**: Processes waiting for CPU
- **b**: Blocked processes
- **swpd**: Swap used
- **free**: Free memory
- **si**: Swap in (from disk)
- **so**: Swap out (to disk)
- **bi**: Blocks in (disk read)
- **bo**: Blocks out (disk write)
- **us**: User CPU time
- **sy**: System CPU time
- **id**: Idle CPU time
- **wa**: I/O wait time

### Disk stats

```bash
vmstat -d  # Disk statistics
```

### Active/Inactive memory

```bash
vmstat -a 5
```

## SMEM - Per-process memory

```bash
# Install
sudo apt install smem

# Show all processes
smem

# Sort by PSS
smem -s pss

# Show as percentage
smem -p

# Totals by user
smem -u

# Totals by mapping
smem -m
```

## Memory types explained

- **RSS** (Resident Set Size): Physical memory used
- **PSS** (Proportonal Set Size): Fair share of shared memory
- **USS** (Unique Set Size): Memory unique to process

## Check swap usage

```bash
# Overall swap
free -h | grep Swap

# Per-process swap
for file in /proc/*/status ; do
    awk '/VmSwap|Name/{printf $2 " " $3}END{ print ""}' $file
done | sort -k 2 -n -r | head

# Using smem
sudo smem -t | tail -1
```

## Memory pressure

```bash
# Check if swapping
vmstat 1 10 | awk 'NR>2 {if($7>0 || $8>0) print "Swapping detected"}'

# I/O wait high?
vmstat 1 10 | awk 'NR>2 {if($16>10) print "High I/O wait:", $16"%"}'
```

## OOM Killer logs

```bash
# Check if OOM killed processes
dmesg | grep -i "out of memory"
dmesg | grep -i "kill"

# Journalctl
journalctl -k | grep -i "out of memory"
```

## Memory limits per process

```bash
# Current limits
prlimit --pid=$$

# Set memory limit for command
prlimit --as=1000000000 command  # 1GB virtual memory
```

## CGroups memory

```bash
# Check cgroup memory
cat /sys/fs/cgroup/memory/memory.usage_in_bytes

# Memory limit
cat /sys/fs/cgroup/memory/memory.limit_in_bytes
```

## Page cache

```bash
# Drop caches (free up memory)
sudo sync
sudo sysctl -w vm.drop_caches=3

# 1 = pagecache
# 2 = dentries and inodes  
# 3 = both
```

## Huge pages

```bash
# Check huge pages
grep Huge /proc/meminfo

# Configure
sudo sysctl -w vm.nr_hugepages=128
```

## Memory bandwidth

```bash
# Install mbw
sudo apt install mbw

# Test memory bandwidth
mbw 100  # Test 100MB
```

## Memory debugging

```bash
# Memory map of process
pmap -x PID

# Detailed memory
cat /proc/PID/smaps

# Summary
cat /proc/PID/status | grep -i mem
```

## Monitoring script

```bash
#!/bin/bash

while true; do
    clear
    echo "=== Memory Status ==="
    free -h
    
    echo -e "\n=== Swap Activity ==="
    vmstat 1 2 | tail -1
    
    echo -e "\n=== Top Memory Users ==="
    ps aux --sort=-%mem | head -6
    
    sleep 5
done
```

## Troubleshooting high memory

```bash
# 1. Find culprit
ps aux --sort=-%mem | head -10

# 2. Check for memory leaks
watch -n 1 'ps aux --sort=-%mem | head -3'

# 3. Check swap activity
vmstat 5

# 4. Review OOM logs
dmesg | grep -i kill
```

## Memory tunables

```bash
# Swappiness (0-100, default 60)
sudo sysctl vm.swappiness=10

# Make permanent
echo "vm.swappiness=10" | sudo tee -a /etc/sysctl.conf

# Cache pressure
sudo sysctl vm.vfs_cache_pressure=50
```

## Alternative tools

```bash
# htop (interactive)
htop

# atop (advanced)
sudo apt install atop
atop

# glances (all-in-one)
sudo apt install glances
glances
```
