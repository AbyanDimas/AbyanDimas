---
title: "UFW Firewall Management"
description: "Simple firewall configuration with Uncomplicated Firewall (UFW)."
date: "2025-09-15"
tags: ["ufw", "firewall", "security"]
category: "Security"
---

## Enable UFW

```bash
sudo ufw enable
```

## Disable UFW

```bash
sudo ufw disable
```

## Check status

```bash
sudo ufw status
```

## Verbose status

```bash
sudo ufw status verbose
```

## Allow specific port

```bash
sudo ufw allow 22
```

## Allow specific port with protocol

```bash
sudo ufw allow 80/tcp
```

## Allow port range

```bash
sudo ufw allow 6000:6007/tcp
```

## Allow from specific IP

```bash
sudo ufw allow from 192.168.1.100
```

## Allow from IP to specific port

```bash
sudo ufw allow from 192.168.1.100 to any port 22
```

## Allow subnet

```bash
sudo ufw allow from 192.168.1.0/24
```

## Deny port

```bash
sudo ufw deny 23
```

## Delete rule by number

First, list numbered rules:

```bash
sudo ufw status numbered
```

Then delete:

```bash
sudo ufw delete 2
```

## Delete rule by specification

```bash
sudo ufw delete allow 80/tcp
```

## Allow common services

```bash
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
```

## Default policies

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
```

## Allow specific interface

```bash
sudo ufw allow in on eth0 to any port 80
```

## Reset UFW (remove all rules)

```bash
sudo ufw reset
```

## Logging

```bash
sudo ufw logging on
```
