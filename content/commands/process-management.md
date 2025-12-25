---
title: "Process Management Essentials"
description: "Monitor, kill, and manage Linux processes with ps, top, htop, and kill."
date: "2025-08-25"
tags: ["linux", "processes", "monitoring"]
category: "System"
---

## List all running processes

```bash
ps aux
```

## Find process by name

```bash
ps aux | grep nginx
```

Or use `pgrep`:

```bash
pgrep -a nginx
```

## Kill process by PID

```bash
kill 1234
```

## Force kill process

```bash
kill -9 1234
```

## Kill all processes by name

```bash
pkill nginx
```

## Interactive process viewer

```bash
top
```

Press `q` to quit, `k` to kill a process, `M` to sort by memory.

## Better alternative: htop

```bash
htop
```

## Check CPU and memory usage

```bash
top -bn1 | head -20
```

## List processes using a specific port

```bash
lsof -i :8080
```

## Background a running process

`Ctrl+Z` to suspend, then:

```bash
bg
```

## Bring background process to foreground

```bash
fg
```

## Run command in background

```bash
nohup ./long_script.sh &
```
