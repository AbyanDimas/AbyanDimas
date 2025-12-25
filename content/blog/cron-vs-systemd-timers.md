---
title: "Scheduling Tasks: Cron vs Systemd Timers"
date: "2025-07-17"
author: "Abyan Dimas"
excerpt: "Cron is legendary, but Systemd Timers offer better logging, dependencies, and flexibility. Which should you use?"
coverImage: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=1200&auto=format&fit=crop"
---

![Clock](https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=1200&auto=format&fit=crop)

For decades, `crontab -e` was the only way to schedule jobs. Now, Systemd Timers provide a modern alternative.

## The Cron Way

```bash
# Run backup at 3 AM daily
0 3 * * * /usr/bin/backup.sh
```

**Pros**: Simple, one-line setup. Universal.
**Cons**:
*   If job fails, where do logs go? (Usually emailed to dead root mailbox).
*   If computer is off at 3 AM, job is skipped completely.
*   Hard to manage dependencies.

## The Systemd Timer Way

Requires two files: a Service (what to do) and a Timer (when to do it).

`backup.timer`:
```ini
[Timer]
OnCalendar=*-*-* 03:00:00
Persistent=true  # Catch up if missed!

[Install]
WantedBy=timers.target
```

**Pros**:
*   **Logging**: Output goes to `journalctl`.
*   **Persistence**: If off at 3 AM, it runs immediately on boot.
*   **Accuracy**: monotonic timers, randomization (prevent thundering herd).
*   **Dependencies**: "Don't run Backup unless Network is Online".

## Verdict

For simple user scripts? **Cron** is fine.
For critical system infrastructure, backups, and production apps? **Systemd Timers** are superior.
