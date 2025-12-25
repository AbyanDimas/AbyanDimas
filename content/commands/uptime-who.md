---
title: "Uptime, W & Who Commands"
description: "Check system uptime and logged-in users with uptime, w, and who."
date: "2025-12-04"
tags: ["uptime", "w", "who", "users"]
category: "System"
---

## UPTIME - System uptime

```bash
# Basic uptime
uptime

# Pretty format
uptime -p

# Since when
uptime -s
```

### Output explained

```
15:42:37 up 23 days,  4:12,  3 users,  load average: 0.15, 0.20, 0.18
──────── ─────────────────── ──────── ───────────────────────────────
  Time      Uptime           Users          Load averages
                                          1min  5min  15min
```

### Load averages

- **< 1.0** - System idle
- **= CPU cores** - Fully utilized
- **> CPU cores** - Queue building up

Check CPU cores:
```bash
nproc
grep -c processor /proc/cpuinfo
```

## W - Who is logged in (detailed)

```bash
# All logged-in users
w

# Short format
w -s

# No header
w -h

# Specific user
w username

# From host
w -f
```

### Output explained

```
USER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT
john     pts/0    192.168.1.100    14:23    0.00s  0.04s  0.00s w
jane     pts/1    workstation      14:45    5:00   0.12s  0.02s vim file.txt
```

- **TTY**: Terminal type
- **FROM**: Remote host
- **LOGIN@**: Login time
- **IDLE**: Idle time
- **JCPU**: Time used by all processes on TTY
- **PCPU**: Time used by current process
- **WHAT**: Current command

## WHO - Who is logged in (simple)

```bash
# Show logged-in users
who

# Show login time
who -b  # Last boot time
who -r  # Run level

# Show all
who -a

# Only usernames
who -q

# With idle time
who -u

# Heading
who -H
```

### Output formats

```bash
# Basic
who
# user1   pts/0    2025-12-04 14:23 (192.168.1.100)

# With heading
who -H
# NAME     LINE         TIME             COMMENT

# Count users
who -q
# user1 user2 user3
# # users=3
```

## USERS - List usernames

```bash
# Just usernames
users

# With who
who | cut -d' ' -f1 | sort | uniq
```

## LAST - Login history

```bash
# Recent logins
last

# Last 10
last -n 10

# Specific user
last username

# Since date
last -s 2025-12-01

# Show failed logins
lastb

# Show reboot history
last reboot
```

## LASTLOG - Last login per user

```bash
# All users
lastlog

# Specific user
lastlog -u username

# Never logged in
lastlog -t 999999
```

## Check load average

```bash
# Current load
uptime | awk -F'load average:' '{print $2}'

# From /proc
cat /proc/loadavg

# Top (live)
top
# Press '1' to see per-CPU load
```

## Monitor uptime

```bash
# Continuous
watch -n 1 uptime

# Log uptime
while true; do
    echo "$(date): $(uptime)" >> /var/log/uptime.log
    sleep 300  # Every 5 minutes
done
```

## Session management

### List sessions

```bash
# All sessions
who -a

# SSH sessions only
who | grep pts

# Console sessions
who | grep tty
```

### End user session

```bash
# Find session
who

# Kill session
sudo pkill -KILL -t pts/0

# Or kill user's processes
sudo pkill -u username
```

## Practical examples

### Check if server was rebooted

```bash
# Last boot time
who -b
uptime -s
last reboot | head -1
```

### Find idle users

```bash
# Users idle > 1 hour
w | awk '$5 ~ /[0-9]+:[0-9]+/ && $5+0 > 60 {print $1, $5}'
```

### Count active users

```bash
who | wc -l
users | wc -w
w -h | wc -l
```

### Security audit

```bash
#!/bin/bash

echo "=== System Uptime ==="
uptime

echo -e "\n=== Current Users ==="
who -H

echo -e "\n=== Recent Logins ==="
last -n 10

echo -e "\n=== Failed Logins ==="
sudo lastb -n 10

echo -e "\n=== Load Average ==="
cat /proc/loadavg
```

### Alert on high load

```bash
#!/bin/bash

THRESHOLD=2.0
LOAD=$(uptime | awk -F'load average:' '{print $2}' | cut -d',' -f1 | tr -d ' ')

if (( $(echo "$LOAD > $THRESHOLD" | bc -l) )); then
    echo "High load: $LOAD" | mail -s "Server Alert" admin@example.com
fi
```

## Troubleshooting

### No users shown

```bash
# Check wtmp file
ls -lh /var/log/wtmp

# Repair if needed
sudo touch /var/log/wtmp
```

### Wrong boot time

```bash
# Check multiple sources
uptime -s
who -b
last reboot | head -1
cat /proc/uptime  # Seconds since boot
```

### Load average interpretation

```bash
# Get CPU count
CPUS=$(nproc)

# Get current load (1min average)
LOAD=$(uptime | awk -F'load average:' '{print $2}' | cut -d',' -f1 | tr -d ' ')

# Calculate percentage
echo "scale=2; ($LOAD / $CPUS) * 100" | bc
```

## Output parsing

```bash
# Uptime in days
uptime | grep -oP '(?<=up\s)(\d+\sdays)' | cut -d' ' -f1

# Number of users
uptime | grep -oP '\d+(?=\suser)'

# Load average (1 min)
uptime | awk -F'load average:' '{print $2}' | cut -d',' -f1

# All logged-in usernames
who | awk '{print $1}' | sort | uniq
```

## Monitoring

script

```bash
#!/bin/bash

LOG="/var/log/system-monitor.log"

while true; do
    DATE=$(date '+%Y-%m-%d %H:%M:%S')
    UPTIME=$(uptime -p)
    LOAD=$(cat /proc/loadavg | cut -d' ' -f1-3)
    USERS=$(who | wc -l)
    
    echo "$DATE | Uptime: $UPTIME | Load: $LOAD | Users: $USERS" >> "$LOG"
    
    sleep 60
done
```

## Quick reference

```bash
# System uptime
uptime              # Full info
uptime -p           # Pretty format
uptime -s           # Since when

# Logged-in users
w                   # Detailed
who                 # Simple
users               # Just names
who -q              # Count

# Login history
last                # Recent logins
last -n 10          # Last 10
lastlog             # Per-user last login

# Load average
cat /proc/loadavg
uptime | awk -F'load average:' '{print $2}'

# Boot time
who -b
uptime -s
```
