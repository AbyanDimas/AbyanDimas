---
title: "Iostat & SAR System Statistics"
description: "Monitor CPU, disk I/O, and system performance metrics."
date: "2025-10-17"
tags: ["iostat", "sar", "performance"]
category: "System"
---

## Iostat - Install

```bash
# Ubuntu/Debian
sudo apt install sysstat

# Enable data collection
sudo systemctl enable sysstat
sudo systemctl start sysstat
```

## Basic iostat

```bash
iostat
```

## Extended statistics

```bash
iostat -x
```

## Show in MB/s

```bash
iostat -m
```

## Specific device

```bash
iostat -x sda
```

## Continuous monitoring (every 2s)

```bash
iostat -x 2
```

## Monitor 5 times, every 2s

```bash
iostat -x 2 5
```

## CPU statistics only

```bash
iostat -c
```

## Disk statistics only

```bash
iostat -d
```

## Human readable

```bash
iostat -h
```

## Include partition stats

```bash
iostat -p sda
```

## NFS statistics

```bash
iostat -n
```

## Important iostat metrics

```
%util     # Device utilization (100% = saturated)
await     # Average wait time (ms)
svctm     # Service time (deprecated)
r/s       # Reads per second
w/s       # Writes per second
rkB/s     # KB read per second
wkB/s     # KB written per second
```

## SAR - Basic usage

```bash
sar
```

## CPU usage (current)

```bash
sar -u 1 5
```

## CPU usage (all cores)

```bash
sar -P ALL 1 5
```

## Memory usage

```bash
sar -r 1 5
```

## Swap usage

```bash
sar -S 1 5
```

## Disk I/O

```bash
sar -d 1 5
```

## Network statistics

```bash
sar -n DEV 1 5
```

## Network errors

```bash
sar -n EDEV 1 5
```

## Load average

```bash
sar -q 1 5
```

## Context switches

```bash
sar -w 1 5
```

## Paging statistics

```bash
sar -B 1 5
```

## View historical data

```bash
sar -f /var/log/sysstat/sa$(date +%d)
```

## Historical CPU

```bash
sar -u -f /var/log/sysstat/sa15
```

## Historical for specific time

```bash
sar -u -s 10:00:00 -e 11:00:00
```

## Historical for date

```bash
sar -u -f /var/log/sysstat/sa15 -s 14:00:00 -e 15:00:00
```

## All statistics

```bash
sar -A
```

## Export to file

```bash
sar -u 1 10 -o /tmp/sar_data
```

## Read from file

```bash
sar -u -f /tmp/sar_data
```

## Network device stats

```bash
sar -n DEV,EDEV 1 5
```

## TCP statistics

```bash
sar -n TCP 1 5
```

## Socket statistics

```bash
sar -n SOCK 1 5
```

## Important SAR metrics

```
%user     # User CPU time
%system   # System CPU time
%iowait   # Waiting for I/O
%idle     # Idle CPU time
kbmemfree # Free memory
kbswpfree # Free swap
tps       # Transfers per second
rxkB/s    # KB received per second
txkB/s    # KB transmitted per second
```

## Analyze high I/O wait

```bash
# Check overall CPU
sar -u 1 5

# Check disk I/O
sar -d 1 5

# Check individual disks
iostat -x 1 5

# Find processes
iotop
```

## SAR report for yesterday

```bash
sar -u -f /var/log/sysstat/sa$(date -d yesterday +%d)
```

## Generate daily report

```bash
# Ubuntu/Debian
/usr/lib/sysstat/sa2
```

## SAR configuration

Edit `/etc/default/sysstat`:

```
ENABLED="true"
```

## SAR data retention

Edit `/etc/sysstat/sysstat`:

```
HISTORY=30
```

## Cron schedule

```bash
cat /etc/cron.d/sysstat
```

## Real-time monitoring script

```bash
#!/bin/bash
while true; do
    clear
    echo "=== CPU ==="
    sar -u 1 1 | tail -1
    echo ""
    echo "=== Memory ==="
    sar -r 1 1 | tail -1
    echo ""
    echo "=== Disk I/O ==="
    iostat -x 1 1 | grep -E "sda|nvme"
    sleep 2
done
```
