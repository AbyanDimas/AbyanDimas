---
title: "Iperf Network Performance"
description: "Test network bandwidth and performance with iperf3."
date: "2025-11-22"
tags: ["iperf", "network", "bandwidth"]
category: "Network"
---

## Install iperf3

```bash
sudo apt install iperf3
```

## Basic usage

### Server mode

```bash
iperf3 -s
iperf3 -s -p 5201  # Custom port
```

### Client mode

```bash
iperf3 -c server-ip
iperf3 -c 192.168.1.100
```

## Test duration

```bash
# 30 second test
iperf3 -c server -t 30

# 100 MB transfer
iperf3 -c server -n 100M
```

## TCP testing

```bash
# Default is TCP
iperf3 -c server

# Reverse direction (server sends)
iperf3 -c server -R

# Bidirectional
iperf3 -c server --bidir
```

## UDP testing

```bash
# UDP mode
iperf3 -c server -u

# Set bandwidth
iperf3 -c server -u -b 100M

# Packet loss and jitter
iperf3 -c server -u -b 10M
```

## Parallel streams

```bash
iperf3 -c server -P 4  # 4 parallel connections
```

## Output formats

```bash
# JSON output
iperf3 -c server -J

# Human readable (default)
iperf3 -c server

# Interval reports
iperf3 -c server -i 1  # Every second
```

## IPv6

```bash
# Server
iperf3 -s -6

# Client
iperf3 -c server-ipv6 -6
```

## Common scenarios

### Test bandwidth

```bash
# Server
iperf3 -s

# Client
iperf3 -c server -t 10
```

### Test latency (UDP)

```bash
iperf3 -c server -u -b 1M -t 30
```

### Multiple streams

```bash
iperf3 -c server -P 10 -t 30
```

### Reverse test

```bash
iperf3 -c server -R -t 10
```

## Save results

```bash
# JSON to file
iperf3 -c server -J > results.json

# Log file
iperf3 -c server --logfile test.log
```

## Port options

```bash
# Custom port
iperf3 -s -p 9999
iperf3 -c server -p 9999

# Bind to specific interface
iperf3 -s -B 192.168.1.100
```

## Throughput testing script

```bash
#!/bin/bash
SERVER=$1

if [ -z "$SERVER" ]; then
    echo "Usage: $0 <server-ip>"
    exit 1
fi

echo "Testing TCP throughput..."
iperf3 -c $SERVER -t 10

echo -e "\nTesting UDP throughput (100 Mbps)..."
iperf3 -c $SERVER -u -b 100M -t 10

echo -e "\nTesting with 4 parallel streams..."
iperf3 -c $SERVER -P 4 -t 10
```

## Firewall

```bash
# Allow iperf port
sudo ufw allow 5201/tcp
sudo ufw allow 5201/udp
```

## Troubleshooting

```bash
# Check if server is running
netstat -tuln | grep 5201
ss -tuln | grep 5201

# Test connectivity
telnet server 5201
nc -zv server 5201
```
