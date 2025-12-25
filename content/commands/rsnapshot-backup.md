---
title: "Rsnapshot Incremental Backups"
description: "Automated filesystem snapshots with rsnapshot using rsync."
date: "2025-11-21"
tags: ["rsnapshot", "backup", "rsync"]
category: "System"
---

## Install rsnapshot

```bash
sudo apt install rsnapshot
```

## Configuration

Edit `/etc/rsnapshot.conf`:

```conf
# Snapshot root (where backups are stored)
snapshot_root	/backup/

# Intervals (how many to keep)
retain		hourly	24
retain		daily	7
retain		weekly	4
retain		monthly	12

# Backup points
backup		/home/		localhost/
backup		/etc/		localhost/
backup		/var/log/	localhost/

# Exclude patterns
exclude		*.tmp
exclude		.cache/
exclude		.Trash/
```

## Test configuration

```bash
sudo rsnapshot configtest
```

## Manual backup

```bash
# Hourly backup
sudo rsnapshot hourly

# Daily backup
sudo rsnapshot daily

# Weekly backup
sudo rsnapshot weekly

# Monthly backup
sudo rsnapshot monthly
```

## Cron automation

Edit `/etc/cron.d/rsnapshot`:

```cron
# Hourly at minute 0
0 */1 * * * root /usr/bin/rsnapshot hourly

# Daily at 3:30 AM
30 3 * * * root /usr/bin/rsnapshot daily

# Weekly on Sunday at 3:00 AM
0 3 * * 0 root /usr/bin/rsnapshot weekly

# Monthly on 1st at 2:30 AM
30 2 1 * * root /usr/bin/rsnapshot monthly
```

## Remote backups

```conf
# SSH backup
backup		user@remote:/home/		remote/
backup_script	/usr/bin/ssh user@remote 'mysqldump -u root database' > database.sql
```

## Pre/Post scripts

```conf
cmd_preexec		/usr/local/bin/pre-backup.sh
cmd_postexec	/usr/local/bin/post-backup.sh
```

## Restore files

```bash
# Backups are in snapshot_root
ls /backup/

# Structure:
# /backup/hourly.0/  <- Latest
# /backup/hourly.1/  
# /backup/daily.0/
# /backup/weekly.0/

# Restore file
cp /backup/hourly.0/localhost/home/user/file.txt /home/user/
```

## Check disk usage

```bash
du -sh /backup/*
```

## Common options

```conf
verbose		2           # Verbosity level
loglevel	3           # Log level
logfile		/var/log/rsnapshot.log
lockfile	/var/run/rsnapshot.pid
rsync_short_args	-a  # Archive mode
rsync_long_args	--delete --numeric-ids --relative --delete-excluded
```

## Troubleshooting

```bash
# Test mode (don't actually backup)
sudo rsnapshot -t hourly

# Debug output
sudo rsnapshot -v -D hourly

# Check logs
sudo tail -f /var/log/rsnapshot.log
```
