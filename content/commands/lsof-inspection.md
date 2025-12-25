---
title: "Lsof - List Open Files"
description: "Inspect open files, network connections, and processes with lsof."
date: "2025-09-19"
tags: ["lsof", "debugging", "linux"]
category: "System"
---

## List all open files

```bash
lsof
```

Warning: This produces massive output!

## List files opened by specific user

```bash
lsof -u username
```

## List files opened by process

```bash
lsof -p 1234
```

## List files in directory

```bash
lsof +D /var/log
```

## Find process using specific file

```bash
lsof /var/log/syslog
```

## List network connections

```bash
lsof -i
```

## List connections on specific port

```bash
lsof -i :8080
```

## List TCP connections

```bash
lsof -i TCP
```

## List UDP connections

```bash
lsof -i UDP
```

## Find process listening on port

```bash
lsof -i :80 -sTCP:LISTEN
```

## List IPv4 connections

```bash
lsof -i 4
```

## List IPv6 connections

```bash
lsof -i 6
```

## Show files opened by command

```bash
lsof -c nginx
```

## Repeat every N seconds

Monitor every 2 seconds:

```bash
lsof -r 2 -i :8080
```

## Exclude user

```bash
lsof -u ^root
```

## Combine filters (AND)

Files by user AND process:

```bash
lsof -u username -c nginx
```

## Combine filters (OR)

Use `-a` flag for AND, default is OR:

```bash
lsof -i :80 -i :443
```

## Find deleted but open files

```bash
lsof | grep deleted
```

## Kill all processes using a file

```bash
kill -9 $(lsof -t /path/to/file)
```

## Check who's using mounted filesystem

```bash
lsof /mnt/usb
```
