---
title: "Nmap Network Scanner"
description: "Network discovery and security auditing with nmap."
date: "2025-10-03"
tags: ["nmap", "security", "networking"]
category: "Security"
---

## Simple host scan

```bash
nmap 192.168.1.1
```

## Scan subnet

```bash
nmap 192.168.1.0/24
```

## Scan multiple hosts

```bash
nmap 192.168.1.1 192.168.1.2 192.168.1.3
```

## Scan range

```bash
nmap 192.168.1.1-100
```

## Port scan

```bash
nmap -p 80 192.168.1.1
```

## Scan multiple ports

```bash
nmap -p 22,80,443 192.168.1.1
```

## Scan port range

```bash
nmap -p 1-1000 192.168.1.1
```

## Scan all ports

```bash
nmap -p- 192.168.1.1
```

## Fast scan (100 most common ports)

```bash
nmap -F 192.168.1.1
```

## TCP SYN scan (stealth)

```bash
sudo nmap -sS 192.168.1.1
```

## TCP connect scan

```bash
nmap -sT 192.168.1.1
```

## UDP scan

```bash
sudo nmap -sU 192.168.1.1
```

## Detect OS

```bash
sudo nmap -O 192.168.1.1
```

## Detect service versions

```bash
nmap -sV 192.168.1.1
```

## Aggressive scan

```bash
sudo nmap -A 192.168.1.1
```

## Ping scan (no port scan)

```bash
nmap -sn 192.168.1.0/24
```

## Skip host discovery

```bash
nmap -Pn 192.168.1.1
```

## Scan from file

```bash
nmap -iL hosts.txt
```

## Save output

```bash
nmap -oN output.txt 192.168.1.1
```

## XML output

```bash
nmap -oX output.xml 192.168.1.1
```

## All output formats

```bash
nmap -oA scan_results 192.168.1.1
```

## Scan timing (0-5, 5 is fastest)

```bash
nmap -T4 192.168.1.1
```

## Script scan

```bash
nmap --script=default 192.168.1.1
```

## Vulnerability scan

```bash
nmap --script=vuln 192.168.1.1
```

## Check SSL/TLS

```bash
nmap --script ssl-enum-ciphers -p 443 example.com
```

## DNS brute force

```bash
nmap --script dns-brute example.com
```

## HTTP enumeration

```bash
nmap --script http-enum 192.168.1.1
```
