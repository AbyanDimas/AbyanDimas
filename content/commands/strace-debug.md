---
title: "Strace System Call Tracer"
description: "Debug programs by tracing system calls and signals with strace."
date: "2025-09-20"
tags: ["strace", "debugging", "linux"]
category: "System"
---

## Trace a command

```bash
strace ls
```

## Trace running process

```bash
strace -p 1234
```

## Count system calls

```bash
strace -c ls
```

## Trace only specific syscalls

```bash
strace -e open,read ls
```

## Trace file operations

```bash
strace -e trace=file ls
```

## Trace network operations

```bash
strace -e trace=network curl example.com
```

## Trace process and children

```bash
strace -f ./script.sh
```

## Save output to file

```bash
strace -o output.txt ls
```

## Show timestamps

```bash
strace -t ls
```

## Show relative timestamps

```bash
strace -r ls
```

## Show time spent in each syscall

```bash
strace -T ls
```

## Attach to all threads

```bash
strace -f -p 1234
```

## Trace file opens

```bash
strace -e openat nginx
```

## Trace network connections

```bash
strace -e connect,socket curl example.com
```

## Filter by string match

```bash
strace -e open -e trace=\!open ls 2>&1 | grep ".conf"
```

## Debug "file not found" errors

```bash
strace -e openat ./program 2>&1 | grep ENOENT
```

## Trace stat/access calls

```bash
strace -e stat,access ls
```

## See what files a process reads

```bash
strace -e read -s 100 cat file.txt
```

## Common syscall categories

```bash
# File operations
strace -e trace=file

# Network operations  
strace -e trace=network

# Process operations
strace -e trace=process

# IPC operations
strace -e trace=ipc

# Memory operations
strace -e trace=memory
```
