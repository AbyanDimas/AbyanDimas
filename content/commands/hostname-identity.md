---
title: "Hostname & System Identity"
description: "View and configure system hostname with hostname and hostnamectl."
date: "2025-12-03"
tags: ["hostname", "hostnamectl", "system"]
category: "System"
---

## View hostname

```bash
hostname
hostname -f  # Fully qualified domain name (FQDN)
hostname -s  # Short hostname
hostname -d  # Domain name
hostname -i  # IP address
hostname -I  # All IP addresses
```

## Set hostname (temporary)

```bash
# Until reboot
sudo hostname new-name
```

## Set hostname (permanent)

### Modern (systemd)

```bash
sudo hostnamectl set-hostname new-hostname

# With pretty name
sudo hostnamectl set-hostname "My Server" --pretty

# Just static hostname
sudo hostnamectl set-hostname server01 --static
```

### Legacy method

Edit `/etc/hostname`:
```
new-hostname
```

Edit `/etc/hosts`:
```
127.0.0.1   localhost
127.0.1.1   new-hostname
```

Then:
```bash
sudo systemctl restart systemd-hostnamed
# Or reboot
```

## HOSTNAMECTL - Comprehensive tool

### View all info

```bash
hostnamectl
hostnamectl status
```

Output example:
```
   Static hostname: webserver
         Icon name: computer-vm
           Chassis: vm
        Machine ID: 1234567890abcdef
           Boot ID: abcdef1234567890
    Virtualization: kvm
  Operating System: Ubuntu 22.04 LTS
            Kernel: Linux 5.15.0-56-generic
      Architecture: x86-64
```

### Set different hostname types

```bash
# Static hostname (main)
sudo hostnamectl set-hostname webserver

# Pretty hostname (descriptive)
sudo hostnamectl set-hostname "Production Web Server" --pretty

# Transient hostname (temporary)
sudo hostnamectl set-hostname temp-name --transient
```

### Set deployment environment

```bash
sudo hostnamectl set-deployment production
sudo hostnamectl set-deployment development
sudo hostnamectl set-deployment staging
```

### Set location

```bash
sudo hostnamectl set-location "Data Center 1"
sudo hostnamectl set-location "Rack 42"
```

### Set chassis type

```bash
sudo hostnamectl set-chassis server
sudo hostnamectl set-chassis laptop
sudo hostnamectl set-chassis vm
```

## Hostname types explained

```
Static hostname:    - Permanent name stored in /etc/hostname
Pretty hostname:    - UTF-8 descriptive name
Transient hostname: - Temporary name from DHCP/mDNS
```

## FQDN (Fully Qualified Domain Name)

```bash
# View FQDN
hostname -f
hostname --fqdn

# Should resolve to
# hostname.domain.com
```

### Setup FQDN

Edit `/etc/hosts`:
```
127.0.0.1       localhost
127.0.1.1       server.example.com  server
192.168.1.100   server.example.com  server
```

Verify:
```bash
hostname -f  # Should show: server.example.com
hostname -s  # Should show: server
hostname -d  # Should show: example.com
```

## Domain name

```bash
# View domain
hostname -d
hostname --domain

# On some systems
dnsdomainname
domainname
```

## IP addresses

```bash
# Primary IP
hostname -i

# All IPs
hostname -I

# Alternative
ip addr show | grep 'inet ' | awk '{print $2}'
```

## Machine ID

```bash
# View machine ID
cat /etc/machine-id
hostnamectl | grep "Machine ID"

# Regenerate (careful!)
sudo rm /etc/machine-id
sudo systemd-machine-id-setup
```

## Use in scripts

```bash
#!/bin/bash

# Get hostname
HOST=$(hostname)
FQDN=$(hostname -f)
SHORT=$(hostname -s)

# Use in backup filename
BACKUP_FILE="backup-${HOST}-$(date +%Y%m%d).tar.gz"

# Server-specific logic
case "$HOST" in
    prod-*)
        ENV="production"
        ;;
    dev-*)
        ENV="development"
        ;;
    *)
        ENV="unknown"
        ;;
esac

echo "Running on $ENV environment"
```

## Cloud environments

### AWS

```bash
# Get EC2 metadata
TOKEN=$(curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600")
curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/hostname
```

### Azure

```bash
# Get Azure metadata
curl -H Metadata:true "http://169.254.169.254/metadata/instance/compute/name?api-version=2021-02-01&format=text"
```

### Google Cloud

```bash
# Get GCP metadata
curl -H "Metadata-Flavor: Google" http://metadata.google.internal/computeMetadata/v1/instance/hostname
```

## Troubleshooting

### Hostname not persisting

```bash
# Check files
cat /etc/hostname
cat /etc/hosts

# Use hostnamectl
sudo hostnamectl set-hostname correct-name

# Verify
hostnamectl
```

### FQDN not resolving

```bash
# Check /etc/hosts
cat /etc/hosts
# Should have:
# 127.0.1.1   server.domain.com  server

# Check DNS
nslookup $(hostname)
dig $(hostname)

# Test resolution
getent hosts $(hostname)
```

### "sudo: unable to resolve host"

Edit `/etc/hosts`:
```
127.0.0.1   localhost
127.0.1.1   your-hostname
```

Or:
```bash
sudo hostnamectl set-hostname $(hostname)
```

## Best practices

```bash
# 1. Use hostnamectl (modern systems)
sudo hostnamectl set-hostname server01

# 2. Use descriptive names
# Good: web-prod-01, db-staging-02
# Bad: server1, server2

# 3. Follow naming conventions
# [role]-[env]-[number]
# web-prod-01
# db-dev-03

# 4. Update /etc/hosts
# Always keep in sync

# 5. Documentation
# Document hostname scheme
```

## Naming conventions

```bash
# By role
web-server-01
db-server-02
cache-server-01

# By environment  
prod-web-01
staging-db-01
dev-app-01

# By location
us-west-web-01
eu-central-db-01

# Combined
prod-us-west-web-01
```

## Quick reference

```bash
# View
hostname             # Current hostname
hostname -f          # FQDN
hostname -I          # All IPs
hostnamectl         # All info

# Set (permanent)
sudo hostnamectl set-hostname new-name

# Set (temporary)
sudo hostname temp-name

# Verify
hostname
hostname -f
cat /etc/hostname
cat /etc/hosts
```
