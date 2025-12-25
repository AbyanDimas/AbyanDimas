---
title: "Killall & Pkill Process Control"
description: "Kill processes by name with killall and pkill commands."
date: "2025-12-02"
tags: ["killall", "pkill", "process", "kill"]
category: "System"
---

## KILLALL - Kill by name

```bash
# Kill all processes by name
killall firefox
killall -9 firefox  # Force kill

# Kill user's processes only
killall -u username process-name

# Interactive confirmation
killall -i nginx

# Verbose output
killall -v apache2
```

### Signals

```bash
# Graceful shutdown (default: SIGTERM)
killall process-name

# Force kill (SIGKILL)
killall -9 process-name
killall -KILL process-name

# Reload configuration (SIGHUP)
killall -HUP nginx

# Stop process (SIGSTOP)
killall -STOP process-name

# Continue process (SIGCONT)
killall -CONT process-name
```

### Common signals

```
SIGTERM (15) - Graceful shutdown (default)
SIGKILL (9)  - Force kill (cannot be caught)
SIGHUP (1)   - Reload configuration
SIGINT (2)   - Interrupt (Ctrl+C)
SIGSTOP (19) - Pause process
SIGCONT (18) - Resume process
```

## PKILL - Kill by pattern

```bash
# Kill by partial name
pkill firefox
pkill -9 firefox

# Kill by pattern
pkill ^ssh
pkill 'python.*script'

# Kill by user
pkill -u username

# Kill by group
pkill -g groupname

# Kill by terminal
pkill -t pts/0
```

### Advanced filtering

```bash
# By parent process
pkill -P 1234  # Kill children of PID 1234

# By process group
pkill -g 5678

# Newest process
pkill -n firefox

# Oldest process
pkill -o firefox

# Exact match
pkill -x firefox

# Case insensitive
pkill -i FIREFOX
```

## List before killing (pgrep)

```bash
# List matching processes
pgrep firefox
pgrep -l firefox  # With process name
pgrep -a firefox  # With full command

# Count processes
pgrep -c firefox

# Then kill
pkill firefox
```

## KILLALL vs PKILL

```bash
# killall: Exact name match
killall firefox

# pkill: Pattern match
pkill fire  # Matches firefox, firebird, etc.

# killall: Process name only
killall python  # Kills any "python"

# pkill: Can match full command line
pkill -f "python script.py"  # Kills specific script
```

## Common use cases

### Restart service

```bash
killall -HUP nginx
# Or
pkill -HUP nginx
```

### Kill zombie processes

```bash
# Find zombies
ps aux | grep Z

# Kill parent (zombies can't be killed directly)
pkill -P parent_pid
```

### Kill all user sessions

```bash
killall -u username
pkill -u username

# Kill user's bash sessions
killall -u username bash
```

### Emergency kill

```bash
# Kill all Firefox
killall -9 firefox

# Kill all Chrome
pkill -9 chrome
```

### Kill by full command

```bash
# Specific Python script
pkill -f "python /path/to/script.py"

# Node.js app
pkill -f "node app.js"
```

## Safe killing script

```bash
#!/bin/bash

PROCESS=$1

if [ -z "$PROCESS" ]; then
    echo "Usage: $0 <process-name>"
    exit 1
fi

# Show what will be killed
echo "Processes to be killed:"
pgrep -a "$PROCESS"

# Confirm
read -p "Kill these processes? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    pkill "$PROCESS"
    echo "Processes killed"
else
    echo "Cancelled"
fi
```

## Troubleshooting

### Nothing killed

```bash
# Check if process exists
pgrep process-name
ps aux | grep process-name

# Check permissions
sudo killall process-name

# Check exact name
ps aux | grep process-name
# Use exact name shown
```

### "No such process"

```bash
# Process already terminated
# Or name mismatch
pgrep -l process  # List to verify name
```

### Permission denied

```bash
# Use sudo for other users' processes
sudo killall process-name
sudo pkill -u username
```

## Best practices

```bash
# 1. Always try graceful shutdown first
killall process-name
sleep 2
# Then force if needed
killall -9 process-name

# 2. Check what you're killing
pgrep -a pattern

# 3. Be specific
pkill -f "full/path/to/command"
# Instead of
pkill command

# 4. Use signals appropriately
killall -HUP nginx  # Reload config
killall nginx       # Graceful stop
killall -9 nginx    # Force kill (last resort)

# 5. Log before mass killing
pgrep -a pattern > /tmp/killed_processes.log
pkill pattern
```

## Alternatives

```bash
# Traditional kill
kill PID
kill -9 PID

# With process substitution
kill $(pgrep firefox)

# Using xargs
pgrep firefox | xargs kill

# Systemd
systemctl stop service-name
```

## Quick reference

```bash
# Kill by exact name
killall process-name

# Kill by pattern
pkill pattern

# Kill specific user's processes
killall -u username process
pkill -u username

# Kill with confirmation
killall -i process-name

# List before killing
pgrep -a pattern

# Force kill
killall -9 process-name
pkill -9 pattern

# Reload configuration
killall -HUP daemon-name
pkill -HUP daemon-name
```
