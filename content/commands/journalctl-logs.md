---
title: "Journalctl Log Viewing"
description: "Query and analyze systemd journal logs with journalctl."
date: "2025-09-08"
tags: ["journalctl", "logs", "linux"]
category: "System"
---

## View all logs

```bash
sudo journalctl
```

## Follow logs (real-time)

```bash
sudo journalctl -f
```

## View logs for specific service

```bash
sudo journalctl -u nginx
```

## Follow service logs

```bash
sudo journalctl -u nginx -f
```

## View logs since boot

```bash
sudo journalctl -b
```

## View previous boot logs

```bash
sudo journalctl -b -1
```

## Show last N lines

```bash
sudo journalctl -n 50
```

## Show logs since specific time

```bash
sudo journalctl --since "2024-01-01 10:00:00"
```

## Show logs for last hour

```bash
sudo journalctl --since "1 hour ago"
```

## Show logs for today

```bash
sudo journalctl --since today
```

## Show logs between times

```bash
sudo journalctl --since "2024-01-01" --until "2024-01-02"
```

## Filter by priority (error level)

```bash
sudo journalctl -p err
```

Levels: `emerg`, `alert`, `crit`, `err`, `warning`, `notice`, `info`, `debug`

## Show kernel messages

```bash
sudo journalctl -k
```

## Show logs from specific user

```bash
sudo journalctl _UID=1000
```

## Check disk usage

```bash
sudo journalctl --disk-usage
```

## Vacuum logs (keep only 100MB)

```bash
sudo journalctl --vacuum-size=100M
```

## Vacuum by time (keep only 2 days)

```bash
sudo journalctl --vacuum-time=2d
```

## Export logs to file

```bash
sudo journalctl -u nginx > nginx-logs.txt
```
