---
title: "Disk Space Management"
description: "df, du, and ncdu commands to analyze and free up disk space."
date: "2025-08-28"
tags: ["linux", "disk", "storage"]
category: "System"
---

## Check disk usage (human-readable)

```bash
df -h
```

## Check specific filesystem

```bash
df -h /
```

## Find directory sizes

```bash
du -sh /var/*
```

## Top 10 largest directories

```bash
du -h /var | sort -rh | head -n 10
```

## Disk usage of current directory

```bash
du -sh .
```

## Interactive disk analyzer (ncdu)

```bash
ncdu /var
```

Navigate with arrows, press `d` to delete files.

## Find largest files

```bash
find / -type f -size +1G -exec ls -lh {} \;
```

## Check inode usage

```bash
df -i
```

## Clear systemd journal logs

```bash
journalctl --vacuum-size=100M
```

## Find old log files

```bash
find /var/log -name "*.log" -mtime +30
```

## Remove old Docker images

```bash
docker image prune -a
```
