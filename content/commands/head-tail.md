---
title: "Head & Tail File Viewing"
description: "View beginning and end of files with head and tail commands."
date: "2025-12-07"
tags: ["head", "tail", "viewing"]
category: "Tools"
---

## HEAD - View beginning of file

```bash
# First 10 lines (default)
head file.txt

# First N lines
head -n 20 file.txt
head -20 file.txt

# First N bytes
head -c 100 file.txt

# Multiple files
head file1.txt file2.txt
```

## TAIL - View end of file

```bash
# Last 10 lines (default)
tail file.txt

# Last N lines
tail -n 20 file.txt
tail -20 file.txt

# Last N bytes
tail -c 100 file.txt

# Multiple files
tail file1.txt file2.txt
```

## Follow file (tail -f)

```bash
# Follow file updates (most common use)
tail -f /var/log/syslog

# Follow with retry (recreated files)
tail -F /var/log/app.log

# Follow last N lines
tail -n 50 -f /var/log/nginx/access.log

# Multiple files
tail -f /var/log/nginx/*.log
```

## Skip lines (tail)

```bash
# Skip first N lines, show rest
tail -n +10 file.txt

# Show from line 100 onwards
tail -n +100 file.txt
```

## Skip lines (head)

```bash
# Show all except last N lines
head -n -5 file.txt
```

## Combine head and tail

```bash
# Lines 11-20
head -n 20 file.txt | tail -n 10

# Lines 100-110
tail -n +100 file.txt | head -n 10

# Middle of file
sed -n '100,110p' file.txt  # Alternative
```

## With line numbers

```bash
# Add line numbers
head -n 20 file.txt | nl
tail -n 20 file.txt | cat -n

# Or with awk
head -n 20 file.txt | awk '{print NR": "$0}'
```

## Common use cases

### View log files

```bash
# Latest logs
tail -100 /var/log/syslog

# Follow live logs
tail -f /var/log/apache2/error.log

# Last hour of logs (approximately)
tail -1000 /var/log/app.log
```

### Check file headers

```bash
# CSV header
head -1 data.csv

# First few records
head -5 data.csv
```

### Monitor multiple logs

```bash
# All nginx logs
tail -f /var/log/nginx/*.log

# With labels
tail -f /var/log/nginx/{access,error}.log
```

### Extract data range

```bash
# Lines 50-60
head -60 file.txt | tail -11

# Skip header, show data
tail -n +2 data.csv
```

## Advanced tail options

```bash
# Quiet mode (no headers)
tail -q -f *.log

# Verbose (always show headers)
tail -v file.txt

# Sleep interval
tail -f -s 5 file.txt  # Check every 5 seconds

# PID monitoring
tail -f --pid=1234 file.txt  # Exit when PID dies
```

## Real-time monitoring

```bash
# Apache access log
tail -f /var/log/apache2/access.log | grep "404"

# Filter and colorize
tail -f /var/log/syslog | grep --color=auto "error"

# Multiple patterns
tail -f app.log | grep -E "ERROR|WARN"
```

## Performance

```bash
# For large files, tail is much faster
# head reads from beginning (slow for large files on some filesystems)
# tail reads from end (generally fast)

# Last 100 lines of 10GB file
time tail -100 huge.log  # Fast

# First 100 lines of 10GB file  
time head -100 huge.log  # Can be slower
```

## Alternatives

```bash
# less (interactive)
less +G file.txt  # Jump to end

# more
more file.txt

# sed (specific lines)
sed -n '1,10p' file.txt  # Lines 1-10
sed -n '$p' file.txt     # Last line

# awk (with conditions)
awk 'NR<=10' file.txt    # First 10 lines
```

## Practical examples

### Check recent errors

```bash
tail -100 /var/log/syslog | grep -i error
```

### Monitor deployment

```bash
tail -f /var/log/deploy.log
```

### Extract CSV data

```bash
# Skip header
tail -n +2 data.csv > data-only.csv

# Get header
head -1 data.csv > header.csv
```

### Split file

```bash
# First half
head -n $(( $(wc -l < file.txt) / 2 )) file.txt > first-half.txt

# Second half
tail -n $(( $(wc -l < file.txt) / 2 )) file.txt > second-half.txt
```

### Follow with context

```bash
# Show timestamp and follow
tail -f /var/log/app.log | while read line; do
    echo "$(date '+%H:%M:%S') $line"
done
```

## Tips

```bash
# 1. Use -f for live monitoring
tail -f /var/log/syslog

# 2. Use -F for rotated logs
tail -F /var/log/app.log  # Handles log rotation

# 3. Combine with grep
tail -f access.log | grep "POST"

# 4. Save output
tail -100 error.log > recent-errors.txt

# 5. Quick file check
head -5 file.txt && echo "..." && tail -5 file.txt
```

## Quick reference

```bash
# Head (beginning)
head file.txt          # First 10 lines
head -n 20 file.txt    # First 20 lines
head -c 100 file.txt   # First 100 bytes

# Tail (end)
tail file.txt          # Last 10 lines
tail -n 20 file.txt    # Last 20 lines
tail -f file.txt       # Follow updates
tail -F file.txt       # Follow with retry

# Combinations
head -20 file.txt | tail -10  # Lines 11-20
tail -n +10 file.txt          # From line 10 to end
head -n -5 file.txt           # All except last 5
```
