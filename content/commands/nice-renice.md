---
title: "Nice & Renice Process Priority"
description: "Manage process priority and CPU scheduling with nice and renice."
date: "2025-11-14"
tags: ["nice", "renice", "priority"]
category: "System"
---

## Understanding priority

- **Nice values**: -20 (highest) to 19 (lowest)
- **Default**: 0
- **Root only**: Can set negative values
- **Higher nice** = Lower priority = Less CPU time

## Check current nice value

```bash
# For current shell
nice

# For specific process
ps -l -p PID
ps -eo pid,ni,comm | grep process-name
```

## Start with nice

```bash
# Default (+10)
nice command

# Custom nice value
nice -n 10 command
nice --adjustment=10 command

# Highest priority (root only)
sudo nice -n -20 command

# Lowest priority
nice -n 19 command
```

## Renice running process

```bash
# By PID
renice -n 10 -p 1234

# By user (all processes)
sudo renice -n 5 -u username

# By group
sudo renice -n 5 -g groupname
```

## Common use cases

### Background jobs

```bash
# CPU-intensive task
nice -n 19 ./heavy-computation.sh &

# Backup with low priority
nice -n 15 tar -czf backup.tar.gz /data
```

### Increase priority

```bash
# Root only
sudo renice -n -10 -p $(pgrep important-app)
```

### Batch processing

```bash
# Low priority batch job
nice -n 19 for file in *.mp4; do
    ffmpeg -i "$file" "converted_$file"
done
```

## Find processes by priority

```bash
# Show all nice values
ps -eo pid,ni,comm --sort=-ni

# High priority processes
ps -eo pid,ni,comm | awk '$2 < 0'

# Low priority processes
ps -eo pid,ni,comm | awk '$2 > 10'
```

## Script with nice

```bash
#!/bin/bash

# Run entire script with nice
if [ "$(nice)" != "10" ]; then
    exec nice -n 10 "$0" "$@"
fi

# Rest of script runs at nice 10
echo "Running at nice level: $(nice)"
```

## Ionice (I/O priority)

```bash
# Install ionice (part of util-linux)
which ionice

# Classes:
# 0 - None
# 1 - Real-time (root only)
# 2 - Best-effort (default)
# 3 - Idle

# Set I/O priority
ionice -c 3 cp large-file.iso /backup/

# Both CPU and I/O priority
nice -n 19 ionice -c 3 dd if=/dev/zero of=test bs=1M count=1000
```

## Priority classes

```bash
# Best effort with level 7 (lowest)
ionice -c 2 -n 7 command

# Idle I/O
ionice -c 3 command

# Real-time (careful!)
sudo ionice -c 1 -n 0 command
```

## Check ionice

```bash
# View I/O priority
ionice -p PID

# View for all processes
ps -eo pid,class,ni,comm
```

## Monitoring

```bash
# Watch priorities
watch -n 1 'ps -eo pid,ni,comm --sort=-ni | head -20'

# With htop
htop
# Press F7/F8 to change nice value
```

## Permanent nice values

### Using systemd

```ini
[Service]
Nice=10
IOSchedulingClass=idle
```

### Using /etc/security/limits.conf

```conf
username  hard  priority  10
username  soft  priority  5
```

## CPU affinity (taskset)

```bash
# Run on specific CPUs
taskset -c 0,1 command

# Set affinity for running process
taskset -p -c 0,1 PID

# Check affinity
taskset -p PID
```

## Combine techniques

```bash
# Low priority, specific CPU, idle I/O
nice -n 19 ionice -c 3 taskset -c 0 ./backup.sh
```

## Cgroups (advanced)

```bash
# Create cgroup
sudo cgcreate -g cpu:/lowpri

# Set CPU shares
echo 256 | sudo tee /sys/fs/cgroup/cpu/lowpri/cpu.shares

# Run in cgroup
sudo cgexec -g cpu:lowpri nice -n 19 command
```

## Best practices

```bash
# 1. Compression (low priority)
nice -n 15 gzip large-file.txt

# 2. Backups (low priority, idle I/O)
nice -n 19 ionice -c 3 rsync -av /data /backup

# 3. Compilations (medium-low)
nice -n 10 make -j$(nproc)

# 4. Database (high priority - careful!)
sudo renice -n -5 -p $(pgrep postgres)

# 5. Web server (slightly elevated)
sudo renice -n -2 -p $(pgrep nginx)
```

## Monitoring script

```bash
#!/bin/bash

echo "Top 10 processes by nice value:"
ps -eo pid,ni,pmem,pcpu,comm --sort=-ni | head -11

echo -e "\nHigh priority (nice < 0):"
ps -eo pid,ni,comm | awk '$2 < 0 {print}'

echo -e "\nLow priority (nice > 15):"
ps -eo pid,ni,comm | awk '$2 > 15 {print}'
```

## Permissions

```bash
# Regular users can:
# - Increase nice (decrease priority)
# - Not decrease nice (increase priority)

# Root can:
# - Set any nice value
# - Use negative nice values
```

## Real-world examples

### Video encoding

```bash
nice -n 19 ionice -c 3 ffmpeg -i input.mp4 output.mp4
```

### Database vacuum

```bash
nice -n 10 ionice -c 2 -n 7 vacuumdb -a
```

### Log rotation

```bash
nice -n 15 logrotate /etc/logrotate.conf
```

### Scientific computing

```bash
# Dedicated CPU cores at high priority
sudo nice -n -10 taskset -c 0-3 ./simulation
```

## Troubleshooting

```bash
# Why isn't nice working?
# Check if process is I/O bound (use ionice)
# Check CPU affinity
# Check cgroups

# Monitor actual CPU usage
top -p PID
# Compare CPU% with nice value
```

## chrt (Real-time priority)

```bash
# View scheduling policy
chrt -p PID

# Set real-time priority (careful!)
sudo chrt -f -p 50 PID

# Policies:
# -f SCHED_FIFO
# -r SCHED_RR
# -o SCHED_OTHER (normal)
# -b SCHED_BATCH
# -i SCHED_IDLE
```
