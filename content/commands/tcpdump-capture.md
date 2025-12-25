---
title: "Tcpdump Packet Capture"
description: "Capture and analyze network packets with tcpdump."
date: "2025-09-23"
tags: ["tcpdump", "networking", "debugging"]
category: "Network"
---

## Capture on interface

```bash
sudo tcpdump -i eth0
```

## Capture specific number of packets

```bash
sudo tcpdump -i eth0 -c 10
```

## Capture and save to file

```bash
sudo tcpdump -i eth0 -w capture.pcap
```

## Read from file

```bash
tcpdump -r capture.pcap
```

## Capture specific port

```bash
sudo tcpdump -i eth0 port 80
```

## Capture specific host

```bash
sudo tcpdump -i eth0 host 192.168.1.1
```

## Capture HTTP traffic

```bash
sudo tcpdump -i eth0 'tcp port 80'
```

## Capture HTTPS traffic

```bash
sudo tcpdump -i eth0 'tcp port 443'
```

## Show packet contents (ASCII)

```bash
sudo tcpdump -i eth0 -A
```

## Show packet contents (hex + ASCII)

```bash
sudo tcpdump -i eth0 -X
```

## Don't resolve hostnames (faster)

```bash
sudo tcpdump -i eth0 -n
```

## More verbose output

```bash
sudo tcpdump -i eth0 -v
```

## Capture specific protocol

```bash
sudo tcpdump -i eth0 icmp
```

## Capture traffic from source IP

```bash
sudo tcpdump -i eth0 src 192.168.1.100
```

## Capture traffic to destination IP

```bash
sudo tcpdump -i eth0 dst 192.168.1.200
```

## Capture specific network

```bash
sudo tcpdump -i eth0 net 192.168.1.0/24
```

## Combine filters with AND

```bash
sudo tcpdump -i eth0 'host 192.168.1.1 and port 80'
```

## Combine filters with OR

```bash
sudo tcpdump -i eth0 'port 80 or port 443'
```

## Capture DNS queries

```bash
sudo tcpdump -i eth0 'udp port 53'
```

## Capture SYN packets

```bash
sudo tcpdump -i eth0 'tcp[tcpflags] & tcp-syn != 0'
```

## Show timestamp

```bash
sudo tcpdump -i eth0 -tttt
```

## Rotate capture files (100MB each)

```bash
sudo tcpdump -i eth0 -w capture.pcap -C 100
```

## Capture all interfaces

```bash
sudo tcpdump -i any
```
