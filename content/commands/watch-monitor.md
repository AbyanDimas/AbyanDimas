---
title: "Watch Command Monitor"
description: "Execute commands repeatedly and watch output changes with watch."
date: "2025-11-26"
tags: ["watch", "monitoring", "periodic"]
category: "Tools"
---

## Basic usage

```bash
watch command
watch ls -la
```

## Update interval

```bash
# Every 2 seconds (default)
watch -n 2 command

# Every 5 seconds
watch -n 5 df -h

# Every 0.1 seconds
watch -n 0.1 command
```

## Highlight differences

```bash
watch -d command
watch --differences command
```

## Cumulative highlights

```bash
watch -d=cumulative command
```

## Precise interval

```bash
watch -p -n 1 command
```

## No title

```bash
watch -t command
```

## Exit on change

```bash
watch -g command
# Exits when output changes
```

## Common use cases

### Monitor disk space

```bash
watch -n 5 df -h
```

### Watch processes

```bash
watch -n 1 'ps aux | grep process'
watch -n 1 'ps aux --sort=-%mem | head -20'
```

### Monitor network

```bash
watch -n 1 ss -tuln
watch -n 1 'netstat -tuln | grep LISTEN'
```

### System resources

```bash
watch -n 1 free -h
watch -n 1 'cat /proc/loadavg'
```

### File changes

```bash
watch -n 1 ls -lh file.txt
watch -n 1 'wc -l logfile.log'
```

### Docker containers

```bash
watch -n 2 docker ps
watch -n 1 'docker stats --no-stream'
```

### Git status

```bash
watch -n 5 git status
watch -n 10 'git log --oneline -5'
```

### Kubernetes

```bash
watch -n 2 kubectl get pods
watch -n 1 'kubectl top nodes'
```

## Advanced examples

### Multiple commands

```bash
watch 'uptime; free -h; df -h /'
```

### With pipes

```bash
watch 'ps aux | grep nginx | wc -l'
```

### Colored output

```bash
watch --color 'ls --color=always'
```

### Beep on change

```bash
watch -b -n 1 command
```

### Monitor log file

```bash
watch -n 1 'tail -20 /var/log/app.log'
```

## Comparison with alternatives

```bash
# watch (periodic execution)
watch -n 1 command

# while loop (shell script)
while true; do clear; command; sleep 1; done

# tail -f (for log files)
tail -f file.log
```

## Tips

```bash
# Use quotes for complex commands
watch 'ps aux | grep nginx'

# Clear screen between runs (alternative)
while sleep 1; do clear; date; ps aux | grep nginx; done

# Save to log
watch -n 60 'date >> /tmp/watch.log; df -h >> /tmp/watch.log'
```
