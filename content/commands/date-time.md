---
title: "Date & Time Manipulation"
description: "Work with dates, times, and timestamps using date and various utilities."
date: "2025-11-11"
tags: ["date", "time", "datetime"]
category: "Tools"
---

## Current date and time

```bash
date
```

## Custom format

```bash
date +"%Y-%m-%d"           # 2025-11-11
date +"%Y-%m-%d %H:%M:%S"  # 2025-11-11 14:30:00
date +"%d/%m/%Y"           # 11/11/2025
date +"%B %d, %Y"          # November 11, 2025
```

## Common format codes

```bash
%Y  # Year (2025)
%y  # Year (25)
%m  # Month (01-12)
%B  # Month name (January)
%b  # Month abbreviated (Jan)
%d  # Day of month (01-31)
%A  # Weekday name (Monday)
%a  # Weekday abbreviated (Mon)
%H  # Hour 24h (00-23)
%I  # Hour 12h (01-12)
%M  # Minute (00-59)
%S  # Second (00-59)
%p  # AM/PM
%s  # Unix timestamp
%Z  # Timezone
```

## Unix timestamp

```bash
# Current timestamp
date +%s

# From timestamp
date -d @1699660800

# macOS
date -r 1699660800
```

## Date arithmetic

```bash
# Tomorrow
date -d "tomorrow"
date -d "+1 day"

# Yesterday
date -d "yesterday"
date -d "-1 day"

# Next week
date -d "+1 week"

# Last month
date -d "-1 month"

# Specific date
date -d "2025-12-25"

# 30 days from now
date -d "+30 days"
```

## Time calculations

```bash
# 2 hours ago
date -d "2 hours ago"

# 30 minutes from now
date -d "+30 minutes"

# Next Monday
date -d "next Monday"

# Last Friday
date -d "last Friday"
```

## Set system date (requires root)

```bash
sudo date -s "2025-11-11 14:30:00"
```

## ISO 8601 format

```bash
date -I                    # 2025-11-11
date -Iseconds            # 2025-11-11T14:30:00+00:00
date --iso-8601=seconds
```

## RFC format

```bash
date -R                    # Mon, 11 Nov 2025 14:30:00 +0000
date --rfc-3339=seconds
```

## Compare dates

```bash
#!/bin/bash
date1="2025-01-01"
date2="2025-12-31"

timestamp1=$(date -d "$date1" +%s)
timestamp2=$(date -d "$date2" +%s)

if [ $timestamp1 -lt $timestamp2 ]; then
    echo "$date1 is before $date2"
fi
```

## Calculate days between dates

```bash
#!/bin/bash
date1="2025-01-01"
date2="2025-12-31"

days=$(( ($(date -d "$date2" +%s) - $(date -d "$date1" +%s)) / 86400 ))
echo "Days between: $days"
```

## File timestamps

```bash
# Get modification time
stat -c %y file.txt

# Get as timestamp
stat -c %Y file.txt

# Touch with specific time
touch -t 202511111430 file.txt  # YYYYMMDDhhmm
touch -d "2025-11-11 14:30" file.txt
```

## Timezones

```bash
# Show timezone
date +%Z

# Different timezone
TZ="America/New_York" date
TZ="Europe/London" date
TZ="Asia/Tokyo" date

# List timezones
timedatectl list-timezones
```

## Set timezone

```bash
# Temporary
export TZ="America/New_York"

# Permanent
sudo timedatectl set-timezone America/New_York

# Using symlink (alternative)
sudo ln -sf /usr/share/zoneinfo/America/New_York /etc/localtime
```

## NTP sync

```bash
# Check status
timedatectl status

# Enable NTP
sudo timedatectl set-ntp true

# Sync time
sudo ntpdate pool.ntp.org

# Or with chrony
sudo chronyd -q
```

## Week number

```bash
date +%V  # ISO week number
date +%U  # Week number (Sunday start)
date +%W  # Week number (Monday start)
```

## Day of year

```bash
date +%j  # 001-366
```

## Relative dates

```bash
# First day of month
date -d "$(date +%Y-%m-01)"

# Last day of month
date -d "$(date +%Y-%m-01) +1 month -1 day"

# First day of year
date -d "$(date +%Y-01-01)"
```

## Filename timestamps

```bash
# Backup with timestamp
cp file.txt file-$(date +%Y%m%d-%H%M%S).txt

# Log file
echo "Log entry" >> log-$(date +%Y-%m-%d).log

# Directory with date
mkdir backup-$(date +%Y%m%d)
```

## Sleep with duration

```bash
sleep 5       # 5 seconds
sleep 2m      # 2 minutes
sleep 1h      # 1 hour
sleep 1d      # 1 day
```

## Countdown timer

```bash
#!/bin/bash
seconds=10
while [ $seconds -gt 0 ]; do
    echo -ne "$seconds\r"
    sleep 1
    ((seconds--))
done
echo "Time's up!"
```

## Stopwatch

```bash
#!/bin/bash
start=$(date +%s)
read -p "Press Enter to stop"
end=$(date +%s)
elapsed=$((end - start))
echo "Elapsed: $elapsed seconds"
```

## Age of file

```bash
#!/bin/bash
file="test.txt"
file_time=$(stat -c %Y "$file")
current_time=$(date +%s)
age=$((current_time - file_time))
age_days=$((age / 86400))
echo "File is $age_days days old"
```

## Cron-style date

```bash
# Run at specific time
while true; do
    if [ "$(date +%H:%M)" = "02:00" ]; then
        ./backup.sh
        sleep 60
    fi
    sleep 30
done
```

## Parse log timestamps

```bash
# Extract dates from logs
grep "ERROR" app.log | cut -d' ' -f1-2

# Filter by date range
awk '/2025-11-10/,/2025-11-11/' app.log
```

## Calendar

```bash
# Current month
cal

# Specific month
cal 11 2025

# Whole year
cal 2025

# 3 months
cal -3
```

## macOS specific

```bash
# macOS uses different flags
date -v +1d        # Tomorrow
date -v -1d        # Yesterday
date -v +1m        # Next month
date -j -f "%Y-%m-%d" "2025-11-11" "+%s"  # Parse date
```

## Benchmark script

```bash
#!/bin/bash
start=$(date +%s.%N)

# Your code here
sleep 2

end=$(date +%s.%N)
elapsed=$(echo "$end - $start" | bc)
echo "Execution time: $elapsed seconds"
```

## Pretty uptime

```bash
uptime -p
```

## Convert between formats

```bash
# ISO to timestamp
date -d "2025-11-11T14:30:00" +%s

# Timestamp to ISO
date -d @1699660800 -Iseconds

# Parse custom format
date -d "Nov 11, 2025" +%Y-%m-%d
```
