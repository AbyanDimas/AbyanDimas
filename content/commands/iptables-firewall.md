---
title: "IPtables Firewall Rules"
description: "Configure Linux firewall rules with iptables."
date: "2025-10-01"
tags: ["iptables", "firewall", "security"]
category: "Security"
---

## List all rules

```bash
sudo iptables -L -v
```

## List rules with line numbers

```bash
sudo iptables -L --line-numbers
```

## Allow incoming SSH

```bash
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT
```

## Allow incoming HTTP

```bash
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
```

## Allow incoming HTTPS

```bash
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT
```

## Allow from specific IP

```bash
sudo iptables -A INPUT -s 192.168.1.100 -j ACCEPT
```

## Block specific IP

```bash
sudo iptables -A INPUT -s 192.168.1.100 -j DROP
```

## Block specific port

```bash
sudo iptables -A INPUT -p tcp --dport 23 -j DROP
```

## Allow loopback

```bash
sudo iptables -A INPUT -i lo -j ACCEPT
```

## Allow established connections

```bash
sudo iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
```

## Drop all other input

```bash
sudo iptables -P INPUT DROP
```

## Default policies

```bash
sudo iptables -P INPUT DROP
sudo iptables -P FORWARD DROP
sudo iptables -P OUTPUT ACCEPT
```

## Delete rule by number

```bash
sudo iptables -D INPUT 3
```

## Delete specific rule

```bash
sudo iptables -D INPUT -p tcp --dport 80 -j ACCEPT
```

## Flush all rules

```bash
sudo iptables -F
```

## Flush specific chain

```bash
sudo iptables -F INPUT
```

## Save rules (Ubuntu/Debian)

```bash
sudo iptables-save > /etc/iptables/rules.v4
```

## Restore rules

```bash
sudo iptables-restore < /etc/iptables/rules.v4
```

## NAT port forwarding

```bash
sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 8080
```

## Masquerade (NAT)

```bash
sudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
```

## Limit connection rate

```bash
sudo iptables -A INPUT -p tcp --dport 22 -m limit --limit 3/min -j ACCEPT
```

## Block ping

```bash
sudo iptables -A INPUT -p icmp --icmp-type echo-request -j DROP
```

## Log dropped packets

```bash
sudo iptables -A INPUT -j LOG --log-prefix "IPTables-Dropped: "
```

## Allow specific subnet

```bash
sudo iptables -A INPUT -s 192.168.1.0/24 -j ACCEPT
```

## Port range

```bash
sudo iptables -A INPUT -p tcp --dport 6000:6100 -j ACCEPT
```
