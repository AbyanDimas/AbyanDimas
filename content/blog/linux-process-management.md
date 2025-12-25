---
title: "Linux Process Management: Kill, Nice, and Strace"
date: "2025-07-09"
author: "Abyan Dimas"
excerpt: "Taking control of your system. Prioritizing CPU, debugging frozen apps, and understanding standard signals."
coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop"
---

![CPU Processor](https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop)

A Linux system is just a kernel juggling thousands of processes. Knowing how to manipulate them is key to system stability.

## Viewing Processes

`top` is classic, but `htop` is better. It gives a visual representation of CPU cores and memory.
*   **PID**: Process ID.
*   **USER**: Owner.
*   **RES**: Resident Memory (Physical RAM used).
*   **S**: State (Running, Sleeping, Zombie).

## The Kill Signals

`kill` doesn't just kill. It sends signals.

*   `kill -15 (SIGTERM)`: "Please stop." The application catches this and cleans up (saves files, closes sockets). Use this first.
*   `kill -9 (SIGKILL)`: "Die immediately." The kernel rips the process out of memory. No cleanup. Use only if frozen.
*   `kill -1 (SIGHUP)`: "Hang up." Often used to tell services to **reload configuration** without restarting.

## Niceness (CPU Priority)

`Nice` values range from -20 (Highest Priority) to +19 (Lowest). Default is 0.

*   `nice -n 10 tar -czf backup.tar.gz /home`: Run backup with low priority so it doesn't slow down the website.
*   `renice -n -5 -p 1234`: Give PID 1234 more CPU attention (needs root).

## Strace: The Ultimate Debugger

When a process is running but stuck, `strace` reveals what it's whispering to the kernel.

```bash
strace -p 1234
```

You might see:
`open("/missing/config.json", O_RDONLY) = -1 ENOENT`

Aha! It's crashing because a config file is missing. `strace` makes you look like a wizard.
