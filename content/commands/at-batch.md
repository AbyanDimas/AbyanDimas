---
title: "At & Batch Job Scheduling"
description: "Schedule one-time tasks with at and batch commands."
date: "202-11-25"
tags: ["at", "batch", "scheduling"]
category: "System"
---

## Install at

```bash
sudo apt install at
sudo systemctl start atd
sudo systemctl enable atd
```

## Schedule commands

### At specific time

```bash
at 10:30
at> command1
at> command2
at> 

Ctrl+D
```

###

 Examples

```bash
# Today at 3:30 PM
at 3:30 PM
at 15:30

# Tomorrow at 9 AM
at 9am tomorrow
at 9:00 tomorrow

# Specific date
at 10:00 AM 12/25/2025
at 2:30 PM Dec 25

# Relative time
at now + 1 hour
at now + 30 minutes
at now + 2 days
at now + 1 week
```

## Interactive input

```bash
$ at 10:00
at> /usr/local/bin/backup.sh
at> echo "Backup complete" | mail root
at> <EOT>
job 1 at Thu Nov 23 10:00:00 2025
```

## Non-interactive

```bash
# Using echo
echo "/usr/local/bin/backup.sh" | at now + 1 hour

# Using here-document
at 10:00 << EOF
/usr/local/bin/backup.sh
echo "Done"
EOF

# From file
at 10:00 < commands.txt
```

## List scheduled jobs

```bash
atq
at -l
```

## View job details

```bash
at -c job_number
```

## Remove job

```bash
atrm job_number
at -r job_number

# Remove all jobs
atrm $(atq | cut -f1)
```

## Batch mode

```bash
# Run when load average is low
batch
at> command
at> <EOT>

# Or non-interactive
echo "command" | batch
```

## Time formats

```bash
# Time only
at 14:30

# Time with period
at 2:30 PM
at 2:30PM

# Midnight
at midnight

# Noon
at noon

# Teatime (4 PM)
at teatime

# Relative
at now + 5 minutes
at now + 2 hours
at now + 3 days
at now + 2 weeks
at now + 1 month

# Combined
at 4pm + 2 days
at  noon tomorrow
at midnight Dec 31
```

## Permissions

### Allow specific users

Edit `/etc/at.allow`:
```
user1
user2
```

### Deny users

Edit `/etc/at.deny`:
```
baduser
```

## Environment

Jobs run with:
- Current working directory
- Environment variables
- Umask

```bash
# Job inherits current environment
cd /path/to/dir
export VAR=value
at now + 1 minute
at> echo $VAR > /tmp/test
at> <EOT>
```

## Mail output

Results are mailed to user by default.

Suppress:
```bash
at 10:00
at> command > /dev/null 2>&1
at> <EOT>
```

## Common use cases

### One-time backup

```bash
echo "/usr/local/bin/backup.sh" | at 2:00 AM tomorrow
```

### Delayed reboot

```bash
echo "reboot" | at now + 10 minutes
```

### Schedule script

```bash
at 11:30 PM
at> /home/user/scripts/cleanup.sh
at> <EOT>
```

### Reminder

```bash
echo 'echo "Meeting in 5 min" | wall' | at now + 55 minutes
```

## Troubleshooting

### Check atd service

```bash
systemctl status atd
```

### Check logs

```bash
sudo journalctl -u atd
tail -f /var/log/syslog | grep atd
```

### Test simple job

```bash
echo "date > /tmp/at-test.txt" | at now + 1 minute
# Wait 1 minute
cat /tmp/at-test.txt
```

## Comparison with cron

```
at/batch:
+ One-time jobs
+ Specific date/time
+ Simple syntax
- Not persistent (lost on reboot before execution)

cron:
+ Recurring jobs
+ Always active
+ Persistent
- More complex syntax
```

## Alternative: systemd timers

For persistent one-time jobs:

```bash
# Create timer and service
systemd-run --on-calendar="2025-12-25 10:00:00" /path/to/script.sh
```
