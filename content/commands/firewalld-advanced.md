---
title: "Firewalld Advanced Firewall"
description: "Manage firewall zones and rules with firewalld on RHEL/CentOS systems."
date: "2025-10-13"
tags: ["firewalld", "firewall", "security"]
category: "Security"
---

## Start firewalld

```bash
sudo systemctl start firewalld
```

## Enable on boot

```bash
sudo systemctl enable firewalld
```

## Check status

```bash
sudo firewall-cmd --state
```

## List all zones

```bash
sudo firewall-cmd --get-zones
```

## Get default zone

```bash
sudo firewall-cmd --get-default-zone
```

## Set default zone

```bash
sudo firewall-cmd --set-default-zone=public
```

## List active zones

```bash
sudo firewall-cmd --get-active-zones
```

## Get zone for interface

```bash
sudo firewall-cmd --get-zone-of-interface=eth0
```

## Add interface to zone

```bash
sudo firewall-cmd --zone=public --add-interface=eth0
```

## List all in zone

```bash
sudo firewall-cmd --zone=public --list-all
```

## Add service

```bash
sudo firewall-cmd --zone=public --add-service=http
```

## Add service permanently

```bash
sudo firewall-cmd --zone=public --add-service=http --permanent
```

## Remove service

```bash
sudo firewall-cmd --zone=public --remove-service=http --permanent
```

## Add port

```bash
sudo firewall-cmd --zone=public --add-port=8080/tcp --permanent
```

## Add port range

```bash
sudo firewall-cmd --zone=public --add-port=6000-6100/tcp --permanent
```

## Remove port

```bash
sudo firewall-cmd --zone=public --remove-port=8080/tcp --permanent
```

## List services

```bash
sudo firewall-cmd --zone=public --list-services
```

## List ports

```bash
sudo firewall-cmd --zone=public --list-ports
```

## List available services

```bash
sudo firewall-cmd --get-services
```

## Add rich rule

```bash
sudo firewall-cmd --zone=public --add-rich-rule='rule family="ipv4" source address="192.168.1.0/24" accept' --permanent
```

## Block IP

```bash
sudo firewall-cmd --zone=public --add-rich-rule='rule family="ipv4" source address="192.168.1.100" reject' --permanent
```

## Allow IP to specific port

```bash
sudo firewall-cmd --zone=public --add-rich-rule='rule family="ipv4" source address="192.168.1.100" port port="22" protocol="tcp" accept' --permanent
```

## List rich rules

```bash
sudo firewall-cmd --zone=public --list-rich-rules
```

## Remove rich rule

```bash
sudo firewall-cmd --zone=public --remove-rich-rule='rule ...' --permanent
```

## Reload firewall

```bash
sudo firewall-cmd --reload
```

## Complete reload (drops connections)

```bash
sudo firewall-cmd --complete-reload
```

## Enable masquerading (NAT)

```bash
sudo firewall-cmd --zone=public --add-masquerade --permanent
```

## Port forwarding

```bash
sudo firewall-cmd --zone=public --add-forward-port=port=80:proto=tcp:toport=8080 --permanent
```

## Forward to different IP

```bash
sudo firewall-cmd --zone=public --add-forward-port=port=80:proto=tcp:toaddr=192.168.1.100:toport=80 --permanent
```

## Create new zone

```bash
sudo firewall-cmd --permanent --new-zone=myzone
```

## Delete zone

```bash
sudo firewall-cmd --permanent --delete-zone=myzone
```

## Add source to zone

```bash
sudo firewall-cmd --zone=trusted --add-source=192.168.1.0/24 --permanent
```

## Remove source

```bash
sudo firewall-cmd --zone=trusted --remove-source=192.168.1.0/24 --permanent
```

## Panic mode (block all)

```bash
sudo firewall-cmd --panic-on
```

## Disable panic mode

```bash
sudo firewall-cmd --panic-off
```

## Check panic mode

```bash
sudo firewall-cmd --query-panic
```

## Runtime vs permanent

```bash
# Runtime (lost on reload)
sudo firewall-cmd --add-service=http

# Permanent (saved to config)
sudo firewall-cmd --add-service=http --permanent
sudo firewall-cmd --reload
```

## Direct rules (iptables)

```bash
sudo firewall-cmd --direct --add-rule ipv4 filter INPUT 0 -p tcp --dport 9000 -j ACCEPT
```

## Lockdown mode

```bash
sudo firewall-cmd --lockdown-on
```
