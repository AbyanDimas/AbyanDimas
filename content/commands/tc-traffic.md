---
title: "TC Traffic Control"
description: "Manage network traffic shaping, bandwidth limiting, and QoS with tc."
date: "2025-10-19"
tags: ["tc", "qos", "networking"]
category: "Network"
---

## Show current rules

```bash
tc qdisc show dev eth0
```

## Show class rules

```bash
tc class show dev eth0
```

## Show filter rules

```bash
tc filter show dev eth0
```

## Delete all rules

```bash
sudo tc qdisc del dev eth0 root
```

## Simple bandwidth limit (1 Mbit/s)

```bash
sudo tc qdisc add dev eth0 root tbf rate 1mbit burst 32kbit latency 400ms
```

## Remove bandwidth limit

```bash
sudo tc qdisc del dev eth0 root
```

## Delay packets (100ms)

```bash
sudo tc qdisc add dev eth0 root netem delay 100ms
```

## Variable delay (100ms ± 10ms)

```bash
sudo tc qdisc add dev eth0 root netem delay 100ms 10ms
```

## Packet loss (10%)

```bash
sudo tc qdisc add dev eth0 root netem loss 10%
```

## Packet corruption (5%)

```bash
sudo tc qdisc add dev eth0 root netem corrupt 5%
```

## Packet duplication (1%)

```bash
sudo tc qdisc add dev eth0 root netem duplicate 1%
```

## Packet reordering

```bash
sudo tc qdisc add dev eth0 root netem delay 10ms reorder 25% 50%
```

## HTB basic setup

```bash
# Add root qdisc
sudo tc qdisc add dev eth0 root handle 1: htb default 30

# Add root class (100 Mbit)
sudo tc class add dev eth0 parent 1: classid 1:1 htb rate 100mbit

# Add child class (50 Mbit, can burst to 100 Mbit)
sudo tc class add dev eth0 parent 1:1 classid 1:10 htb rate 50mbit ceil 100mbit

# Add another child (30 Mbit)
sudo tc class add dev eth0 parent 1:1 classid 1:20 htb rate 30mbit ceil 100mbit
```

## Filter by IP

```bash
# Filter traffic to 192.168.1.100 into class 1:10
sudo tc filter add dev eth0 protocol ip parent 1:0 prio 1 u32 \
  match ip dst 192.168.1.100/32 flowid 1:10
```

## Filter by port

```bash
# HTTP traffic (port 80)
sudo tc filter add dev eth0 protocol ip parent 1:0 prio 1 u32 \
  match ip dport 80 0xffff flowid 1:10
```

## Prioritize SSH traffic

```bash
# Add priority qdisc
sudo tc qdisc add dev eth0 root handle 1: prio bands 3

# SSH to high priority
sudo tc filter add dev eth0 protocol ip parent 1:0 prio 1 u32 \
  match ip dport 22 0xffff flowid 1:1
```

## Bandwidth per IP

```bash
#!/bin/bash
# Limit each IP to 1 Mbit/s

tc qdisc add dev eth0 root handle 1: htb default 30

tc class add dev eth0 parent 1: classid 1:1 htb rate 100mbit

for ip in 192.168.1.{10..20}; do
  classid=$((10 + ${ip##*.}))
  tc class add dev eth0 parent 1:1 classid 1:$classid htb rate 1mbit ceil 1mbit
  tc filter add dev eth0 protocol ip parent 1:0 prio 1 u32 \
    match ip dst $ip/32 flowid 1:$classid
done
```

## Simulate slow network

```bash
# 1 Mbit/s with 50ms latency and 1% loss
sudo tc qdisc add dev eth0 root netem rate 1mbit delay 50ms loss 1%
```

## Simulate mobile network

```bash
# 3G simulation
sudo tc qdisc add dev eth0 root netem rate 384kbit delay 100ms loss 0.5%

# 4G simulation
sudo tc qdisc add dev eth0 root netem rate 10mbit delay 30ms loss 0.1%
```

## Ingress limiting

```bash
# Create ifb device
sudo modprobe ifb
sudo ip link add ifb0 type ifb
sudo ip link set dev ifb0 up

# Redirect ingress to ifb0
sudo tc qdisc add dev eth0 handle ffff: ingress
sudo tc filter add dev eth0 parent ffff: protocol ip u32 \
  match u32 0 0 action mirred egress redirect dev ifb0

# Apply limit on ifb0
sudo tc qdisc add dev ifb0 root tbf rate 10mbit burst 32kbit latency 400ms
```

## Show statistics

```bash
tc -s qdisc show dev eth0
tc -s class show dev eth0
```

## Detailed statistics

```bash
tc -s -d qdisc show dev eth0
```

## Police (rate limiting)

```bash
sudo tc filter add dev eth0 protocol ip parent 1:0 prio 1 u32 \
  match ip dst 192.168.1.100/32 \
  police rate 1mbit burst 100k drop flowid :1
```

## Remove specific qdisc

```bash
sudo tc qdisc del dev eth0 root
sudo tc qdisc del dev eth0 ingress
```

## Test bandwidth limit

```bash
# Apply 1 Mbit limit
sudo tc qdisc add dev eth0 root tbf rate 1mbit burst 32kbit latency 400ms

# Test with iperf
iperf3 -c target-server

# Remove limit
sudo tc qdisc del dev eth0 root
```

## Common units

```
kbit  # Kilobit
mbit  # Megabit
gbit  # Gigabit
kbps  # Kilobyte per second
mbps  # Megabyte per second
```

## Common qdisc types

```
tbf     # Token Bucket Filter (rate limiting)
htb     # Hierarchical Token Bucket (complex shaping)
prio    # Priority queueing
sfq     # Stochastic Fairness Queueing
netem   # Network Emulator (delay, loss, etc.)
fq_codel  # Fair Queue with CoDel (default in modern Linux)
```

## Persistent rules (systemd)

Create `/etc/systemd/system/tc-setup.service`:

```ini
[Unit]
Description=Traffic Control Setup
After=network.target

[Service]
Type=oneshot
ExecStart=/usr/local/bin/tc-setup.sh
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target
```
