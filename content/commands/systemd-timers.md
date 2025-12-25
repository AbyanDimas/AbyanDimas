---
title: "Systemd Timers (Cron Alternative)"
description: "Schedule tasks with systemd timers instead of cron jobs."
date: "2025-09-18"
tags: ["systemd", "timers", "automation"]
category: "System"
---

## List all timers

```bash
systemctl list-timers
```

## List all timers (including inactive)

```bash
systemctl list-timers --all
```

## Check timer status

```bash
systemctl status backup.timer
```

## Create a timer (example)

Create `/etc/systemd/system/backup.timer`:

```ini
[Unit]
Description=Daily Backup Timer

[Timer]
OnCalendar=daily
Persistent=true

[Install]
WantedBy=timers.target
```

## Create corresponding service

Create `/etc/systemd/system/backup.service`:

```ini
[Unit]
Description=Backup Service

[Service]
Type=oneshot
ExecStart=/usr/local/bin/backup.sh
```

## Timer schedules (OnCalendar)

```ini
# Every minute
OnCalendar=*:*

# Every 5 minutes
OnCalendar=*:0/5

# Every hour
OnCalendar=hourly

# Every day at 2:30 AM
OnCalendar=*-*-* 02:30:00

# Every Monday at 9 AM
OnCalendar=Mon *-*-* 09:00:00

# Every weekday at 6 PM
OnCalendar=Mon..Fri *-*-* 18:00:00

# First day of month
OnCalendar=*-*-01 00:00:00
```

## Enable and start timer

```bash
sudo systemctl enable backup.timer
sudo systemctl start backup.timer
```

## Stop timer

```bash
sudo systemctl stop backup.timer
```

## Disable timer

```bash
sudo systemctl disable backup.timer
```

## View timer logs

```bash
sudo journalctl -u backup.timer
```

## View service logs

```bash
sudo journalctl -u backup.service
```

## Reload systemd

After creating/editing timer:

```bash
sudo systemctl daemon-reload
```

## Timer with delay after boot

```ini
[Timer]
OnBootSec=5min
OnUnitActiveSec=1h
```

## Check next trigger time

```bash
systemctl list-timers backup.timer
```
