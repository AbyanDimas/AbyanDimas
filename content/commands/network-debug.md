---
title: "Network Debugging Toolkit"
description: "Essential networking commands: curl, netstat, ss, ping, and traceroute."
date: "2025-08-26"
tags: ["networking", "debugging", "linux"]
category: "Network"
---

## Check if port is open

```bash
nc -zv example.com 80
```

## List all listening ports

```bash
ss -tuln
```

Or with `netstat`:

```bash
netstat -tuln
```

## Show active connections

```bash
ss -tup
```

## Ping a server

```bash
ping -c 4 google.com
```

## Trace route to destination

```bash
traceroute google.com
```

## Test HTTP endpoint

```bash
curl https://api.example.com/health
```

## POST JSON data

```bash
curl -X POST https://api.example.com/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John", "email": "john@example.com"}'
```

## Download file with curl

```bash
curl -O https://example.com/file.zip
```

## Check DNS resolution

```bash
nslookup example.com
```

Or with `dig`:

```bash
dig example.com
```

## Show network interfaces

```bash
ip addr show
```

## Test TCP connection speed

```bash
iperf3 -c server-ip
```
