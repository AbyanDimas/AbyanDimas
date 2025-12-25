---
title: "Htop Advanced Process Viewer"
description: "Interactive process monitoring with htop - advanced tips and shortcuts."
date: "2025-10-04"
tags: ["htop", "monitoring", "performance"]
category: "System"
---

## Install htop

```bash
# Ubuntu/Debian
sudo apt install htop

# macOS
brew install htop
```

## Launch htop

```bash
htop
```

## Navigation shortcuts

- `F1` or `h` - Help
- `F2` or `S` - Setup
- `F3` or `/` - Search
- `F4` or `\` - Filter
- `F5` or `t` - Tree view
- `F6` or `<` `>` - Sort by column
- `F9` or `k` - Kill process
- `F10` or `q` - Quit

## Sorting

- `M` - Sort by memory usage
- `P` - Sort by CPU usage
- `T` - Sort by time
- `N` - Sort by PID

## Display options

- `H` - Toggle user threads
- `K` - Toggle kernel threads
- `u` - Filter by user
- `Space` - Tag process
- `U` - Untag all
- `c` - Tag all children

## Tree view

- `t` - Toggle tree view
- `+` - Expand tree
- `-` - Collapse tree

## Process management

- `k` - Kill process (sends SIGTERM)
- `F9` - Kill menu (choose signal)
- `e` - Show process environment
- `l` - List open files (lsof)
- `s` - Trace syscalls (strace)

## Common signals

```
1  - SIGHUP   (Reload configuration)
2  - SIGINT   (Interrupt, Ctrl+C)
9  - SIGKILL  (Force kill)
15 - SIGTERM  (Graceful termination)
18 - SIGCONT  (Continue if stopped)
19 - SIGSTOP  (Pause process)
```

## Filtering

Press `F4` then type:

```
nginx       # Show only nginx processes
USER=www    # Show processes by user
STATE=R     # Show only running processes
```

## Color schemes

Press `F2` > Colors > Choose theme:

- Monochrome
- Black on White
- Light Terminal
- MC (Midnight Commander)
- Black Night

## Display meters

Press `F2` > Meters:

- Add/remove meters
- Customize layout
- CPU, Memory, Swap meters
- Load average, Uptime

## Configuration file

Located at `~/.config/htop/htoprc`

## View specific user

```bash
htop -u username
```

## Batch mode (non-interactive)

```bash
htop --no-color --no-mouse
```

## CPU affinity

- `a` - Set CPU affinity
- Select which CPUs process can use

## Process priority

- `F7` - Decrease priority (nice)
- `F8` - Increase priority (nice)

## Useful display modes

- `I` - Invert sort order
- `p` - Show full paths
- `g` - Merge all branches

## Monitor specific PID

```bash
htop -p 1234,5678
```

## Show command line arguments

- `c` - Show full command line
