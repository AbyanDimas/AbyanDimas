---
title: "Crontab Advanced"
description: "Advanced cron job scheduling, debugging, and best practices."
date: "2025-11-08"
tags: ["cron", "scheduling", "automation"]
category: "System"
---

## Edit crontab

```bash
crontab -e
```

## List cron jobs

```bash
crontab -l
```

## Remove all cron jobs

```bash
crontab -r
```

## Edit other user's crontab

```bash
sudo crontab -u username -e
```

## Crontab syntax

```
* * * * * command
│ │ │ │ │
│ │ │ │ └─ Day of week (0-7, 0 and 7 = Sunday)
│ │ │ └─── Month (1-12)
│ │ └───── Day of month (1-31)
│ └─────── Hour (0-23)
└───────── Minute (0-59)
```

## Common schedules

```cron
# Every minute
* * * * * command

# Every 5 minutes
*/5 * * * * command

# Every hour at minute 0
0 * * * * command

# Every day at midnight
0 0 * * * command

# Every day at 2:30 AM
30 2 * * * command

# Every Sunday at midnight
0 0 * * 0 command

# Every weekday at 6 PM
0 18 * * 1-5 command

# First day of month at midnight
0 0 1 * * command

# Every quarter (Jan, Apr, Jul, Oct)
0 0 1 */3 * command

# Twice a day (8 AM and 8 PM)
0 8,20 * * * command
```

## Special strings

```cron
@reboot       # Run at startup
@yearly       # Run once a year (0 0 1 1 *)
@annually     # Same as @yearly
@monthly      # Run once a month (0 0 1 * *)
@weekly       # Run once a week (0 0 * * 0)
@daily        # Run once a day (0 0 * * *)
@midnight     # Same as @daily
@hourly       # Run once an hour (0 * * * *)
```

## Environment variables

```cron
SHELL=/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin
MAILTO=admin@example.com
HOME=/home/user

0 2 * * * /path/to/script.sh
```

## Logging output

```cron
# Redirect to file
0 2 * * * /path/to/script.sh >> /var/log/script.log 2>&1

# Redirect stdout and stderr separately
0 2 * * * /path/to/script.sh >> /var/log/script.log 2>> /var/log/script.error

# Suppress output
0 2 * * * /path/to/script.sh > /dev/null 2>&1

# Email on error only
0 2 * * * /path/to/script.sh > /dev/null
```

## Prevent overlapping

```cron
# Using flock
* * * * * flock -n /tmp/script.lock -c '/path/to/script.sh'

# Using lockfile
* * * * * lockfile -r 0 /tmp/script.lock && /path/to/script.sh; rm -f /tmp/script.lock
```

## Script wrapper for cron

```bash
#!/bin/bash

LOCK_FILE="/tmp/backup.lock"

# Check if already running
if [ -f "$LOCK_FILE" ]; then
    echo "Script is already running"
    exit 1
fi

# Create lock file
touch "$LOCK_FILE"

# Cleanup on exit
trap "rm -f $LOCK_FILE" EXIT

# Your actual script
/path/to/actual/script.sh
```

## Debugging cron jobs

```bash
# Check cron service
sudo systemctl status cron
sudo systemctl status crond  # RHEL/CentOS

# Check cron logs
sudo tail -f /var/log/syslog | grep CRON
sudo tail -f /var/log/cron

# Enable cron logging (if not enabled)
# Edit /etc/rsyslog.conf or /etc/rsyslog.d/50-default.conf
# Uncomment: cron.*                          /var/log/cron.log

# Restart syslog
sudo systemctl restart rsyslog
```

## Test cron job

```cron
# Run every minute for testing
* * * * * echo "Test at $(date)" >> /tmp/crontest.log 2>&1

# Check output
tail -f /tmp/crontest.log

# Remove after testing
crontab -e  # Delete the test line
```

## System-wide crontabs

```bash
# System cron directories
/etc/cron.hourly/
/etc/cron.daily/
/etc/cron.weekly/
/etc/cron.monthly/

# Direct file edits
/etc/crontab
/etc/cron.d/

# Example /etc/crontab entry
0 2 * * * root /path/to/script.sh
```

## Run-parts

```bash
# /etc/crontab uses run-parts
0 2 * * * root run-parts /etc/cron.daily

# Script in /etc/cron.daily/ must be:
# - Executable (chmod +x)
# - No file extension
# - Not contain dots in name
```

## Anacron (for desktop/laptop)

```bash
# /etc/anacrontab
# period  delay  job-identifier  command
1         5      cron.daily      run-parts /etc/cron.daily
7         10     cron.weekly     run-parts /etc/cron.weekly
30        15     cron.monthly    run-parts /etc/cron.monthly
```

## User cron permissions

```bash
# Allow specific users
# Add to /etc/cron.allow
username

# Deny specific users
# Add to /etc/cron.deny
baduser

# If neither file exists, only root can use crontab
```

## Environment in cron

```bash
# Cron has minimal environment
# Always use absolute paths

# Bad
* * * * * script.sh

# Good
* * * * * /usr/local/bin/script.sh

# Set PATH
PATH=/usr/local/bin:/usr/bin:/bin
* * * * * script.sh
```

## Complex schedule examples

```cron
# Every 15 minutes during business hours
*/15 9-17 * * 1-5 /path/to/script.sh

# Every 2 hours
0 */2 * * * /path/to/script.sh

# At 4:30 AM on 1st and 15th
30 4 1,15 * * /path/to/script.sh

# Monday through Friday at 7 PM
0 19 * * 1-5 /path/to/script.sh

# Every 10 minutes between 9 AM - 5 PM
*/10 9-17 * * * /path/to/script.sh

# Last day of month (requires workaround)
0 0 28-31 * * [ $(date -d tomorrow +\%d) -eq 1 ] && /path/to/script.sh
```

## Backup crontab

```bash
# Backup
crontab -l > ~/crontab_backup.txt

# Restore
crontab ~/crontab_backup.txt

# Backup all users
for user in $(cut -f1 -d: /etc/passwd); do
    sudo crontab -l -u $user > crontab_${user}.bak 2>/dev/null
done
```

## Monitor cron jobs

```bash
# List all user crontabs
for user in $(cut -f1 -d: /etc/passwd); do
    echo "=== $user ==="
    sudo crontab -l -u $user 2>/dev/null
done

# Check last execution
grep CRON /var/log/syslog | tail -20
```

## Best practices

```bash
# 1. Always use absolute paths
0 2 * * * /usr/bin/python3 /home/user/script.py

# 2. Set email for errors
MAILTO=admin@example.com

# 3. Log everything
0 2 * * * /path/to/script.sh >> /var/log/script.log 2>&1

# 4. Use locking to prevent overlap
0 2 * * * flock -n /tmp/script.lock -c '/path/to/script.sh'

# 5. Set environment
SHELL=/bin/bash
PATH=/usr/local/bin:/usr/bin:/bin
HOME=/home/user

# 6. Test manually first
/path/to/script.sh

# 7. Start with frequent runs for testing
* * * * * /path/to/script.sh

# 8. Add comments
# Daily backup at 2 AM
0 2 * * * /usr/local/bin/backup.sh
```

## Cron alternatives

```bash
# Systemd timers (modern alternative)
sudo systemctl list-timers

# At (one-time jobs)
echo "/path/to/script.sh" | at 2:00 AM tomorrow

# Jenkins (for complex workflows)
# Airflow (for data pipelines)
```
