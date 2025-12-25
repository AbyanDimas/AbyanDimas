---
title: "Cron Job Scheduling"
description: "Schedule automated tasks with cron jobs and crontab."
date: "2025-09-05"
tags: ["cron", "automation", "linux"]
category: "System"
---

## Edit crontab

```bash
crontab -e
```

## List current cron jobs

```bash
crontab -l
```

## Remove all cron jobs

```bash
crontab -r
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

## Every minute

```cron
* * * * * /path/to/script.sh
```

## Every hour at minute 0

```cron
0 * * * * /path/to/script.sh
```

## Every day at 2:30 AM

```cron
30 2 * * * /path/to/backup.sh
```

## Every Monday at 9:00 AM

```cron
0 9 * * 1 /path/to/weekly-report.sh
```

## Every 15 minutes

```cron
*/15 * * * * /path/to/check.sh
```

## First day of every month

```cron
0 0 1 * * /path/to/monthly-task.sh
```

## Every weekday at 6 PM

```cron
0 18 * * 1-5 /path/to/workday-task.sh
```

## Redirect output to log file

```cron
0 2 * * * /path/to/script.sh > /var/log/cronjob.log 2>&1
```

## Disable email notifications

```cron
MAILTO=""
0 * * * * /path/to/script.sh
```

## Use environment variables

```cron
SHELL=/bin/bash
PATH=/usr/local/bin:/usr/bin:/bin
0 * * * * backup.sh
```
