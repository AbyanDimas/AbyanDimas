---
title: "Perf Performance Analysis"
description: "CPU profiling, performance analysis, and hotspot detection with perf."
date: "2025-10-20"
tags: ["perf", "profiling", "performance"]
category: "System"
---

## Install perf

```bash
# Ubuntu/Debian
sudo apt install linux-tools-common linux-tools-generic linux-tools-$(uname -r)

# Check installation
perf --version
```

## Record CPU profile

```bash
sudo perf record -a -g sleep 10
```

## Record specific process

```bash
sudo perf record -p <PID> -g sleep 10
```

## Record specific command

```bash
sudo perf record -g ./my_program
```

## View recorded data

```bash
sudo perf report
```

## Interactive TUI

```bash
sudo perf report --tui
```

## Top-like view

```bash
sudo perf top
```

## Top for specific PID

```bash
sudo perf top -p <PID>
```

## CPU statistics

```bash
sudo perf stat ls -la
```

## Detailed statistics

```bash
sudo perf stat -d ./my_program
```

## Count specific events

```bash
sudo perf stat -e cpu-cycles,instructions,cache-misses ./my_program
```

## List available events

```bash
perf list
```

## List hardware events

```bash
perf list hardware
```

## List software events

```bash
perf list software
```

## Record with call graph

```bash
sudo perf record -g -F 99 -a sleep 30
```

## Record with dwarf call graph

```bash
sudo perf record --call-graph dwarf -a sleep 10
```

## Annotate source code

```bash
sudo perf annotate
```

## Generate flame graph

```bash
# Record
sudo perf record -F 99 -a -g -- sleep 30

# Convert to flamegraph format
sudo perf script | ~/FlameGraph/stackcollapse-perf.pl > out.folded

# Generate SVG
~/FlameGraph/flamegraph.pl out.folded > flamegraph.svg
```

## Cache misses

```bash
sudo perf stat -e cache-misses,cache-references ./my_program
```

## Branch prediction

```bash
sudo perf stat -e branch-misses,branch-instructions ./my_program
```

## Page faults

```bash
sudo perf stat -e page-faults ./my_program
```

## Record scheduler events

```bash
sudo perf record -e 'sched:*' -a sleep 5
```

## Record syscalls

```bash
sudo perf trace ls
```

## Trace specific syscall

```bash
sudo perf trace -e open ls
```

## Lock contention

```bash
sudo perf lock record ./my_program
sudo perf lock report
```

## Memory access

```bash
sudo perf mem record ./my_program
sudo perf mem report
```

## Sampling frequency

```bash
# 99 Hz
sudo perf record -F 99 -a -g sleep 10

# 999 Hz (higher overhead)
sudo perf record -F 999 -a -g sleep 10
```

## Record specific CPU

```bash
sudo perf record -C 0 -g sleep 10
```

## Record all CPUs

```bash
sudo perf record -a -g sleep 10
```

## Diff two profiles

```bash
sudo perf diff perf.data.old perf.data
```

## Archive for later analysis

```bash
sudo perf archive
```

## Analyze remote data

```bash
perf buildid-cache -a /path/to/binary
perf report -i perf.data
```

## Common event groups

```bash
# CPU Performance
sudo perf stat -e cpu-cycles,instructions,cache-references,cache-misses ./program

# Branch Performance
sudo perf stat -e branches,branch-misses ./program

# TLB Performance
sudo perf stat -e dTLB-loads,dTLB-load-misses ./program
```

## Record with timestamps

```bash
sudo perf record -T -a -g sleep 10
```

## Sample on period

```bash
sudo perf record -c 100000 -a -g sleep 10
```

## Filter by comm

```bash
sudo perf record --filter 'comm == nginx' -a sleep 10
```

## Save to specific file

```bash
sudo perf record -o my_profile.data -a -g sleep 10
sudo perf report -i my_profile.data
```

## Enable kernel symbols

```bash
# Install debug symbols
sudo apt install linux-image-$(uname -r)-dbgsym

# Or allow non-root perf
sudo sysctl -w kernel.perf_event_paranoid=1
```

## CPU utilization by function

```bash
sudo perf top -g
```

## Off-CPU analysis

```bash
sudo perf record -e sched:sched_switch -a -g sleep 10
```

## Realtime mode

```bash
sudo perf top -g -F 999
```

## Export to JSON

```bash
sudo perf report --stdio -i perf.data > report.txt
```

## Filter by DSO (library)

```bash
sudo perf report --dsos /lib/x86_64-linux-gnu/libc.so.6
```

## Common workflows

```bash
# 1. Quick profile
sudo perf top

# 2. Record and analyze
sudo perf record -a -g sleep 30
sudo perf report

# 3. Compare before/after
sudo perf record -o before.data -a -g ./benchmark
# Make changes
sudo perf record -o after.data -a -g ./benchmark
sudo perf diff before.data after.data

# 4. Find hotspots
sudo perf record -g ./my_app
sudo perf report --sort comm,dso,symbol
```
