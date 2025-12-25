---
title: "SSH Configuration"
description: "Configure SSH client settings, keys, and connection options."
date: "2025-10-24"
tags: ["ssh", "config", "security"]
category: "Network"
---

## SSH config file location

```
~/.ssh/config
```

## Basic host configuration

```
Host myserver
    HostName 192.168.1.100
    User admin
    Port 22
```

## Connect using alias

```bash
ssh myserver
```

## Multiple hosts

```
Host server1
    HostName 192.168.1.100
    User admin

Host server2
    HostName 192.168.1.101
    User root
```

## Use specific key

```
Host myserver
    HostName example.com
    User admin
    IdentityFile ~/.ssh/id_rsa_myserver
```

## Jump host (bastion)

```
Host internal-server
    HostName 10.0.0.50
    User admin
    ProxyJump bastion

Host bastion
    HostName bastion.example.com
    User jump-user
```

## Alternative jump syntax

```
Host internal-server
    HostName 10.0.0.50
    User admin
    ProxyCommand ssh -W %h:%p bastion
```

## Wildcard patterns

```
Host *.example.com
    User admin
    IdentityFile ~/.ssh/company_key

Host 192.168.1.*
    User root
    Port 2222
```

## Keep connection alive

```
Host *
    ServerAliveInterval 60
    ServerAliveCountMax 3
```

## Connection multiplexing

```
Host *
    ControlMaster auto
    ControlPath ~/.ssh/sockets/%r@%h-%p
    ControlPersist 600
```

## Disable host key checking (unsafe!)

```
Host dev-server
    HostName dev.example.com
    StrictHostKeyChecking no
    UserKnownHostsFile /dev/null
```

## Forward agent

```
Host myserver
    HostName example.com
    ForwardAgent yes
```

## Local port forwarding

```
Host myserver
    HostName example.com
    LocalForward 8080 localhost:80
```

## Remote port forwarding

```
Host myserver
    HostName example.com
    RemoteForward 9000 localhost:3000
```

## Dynamic forwarding (SOCKS)

```
Host myserver
    HostName example.com
    DynamicForward 1080
```

## X11 forwarding

```
Host myserver
    HostName example.com
    ForwardX11 yes
```

## Compression

```
Host slow-connection
    HostName remote.example.com
    Compression yes
```

## Connection timeout

```
Host *
    ConnectTimeout 30
```

## Multiple identities

```
Host github-work
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_rsa_work

Host github-personal
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_rsa_personal
```

## Logging

```
Host myserver
    HostName example.com
    LogLevel DEBUG
```

## IPv4 only

```
Host myserver
    HostName example.com
    AddressFamily inet
```

## Preferred authentication

```
Host myserver
    HostName example.com
    PreferredAuthentications publickey,password
```

## Disable password auth

```
Host myserver
    HostName example.com
    PasswordAuthentication no
```

## Send environment variables

```
Host myserver
    HostName example.com
    SendEnv LANG LC_*
```

## Request TTY

```
Host myserver
    HostName example.com
    RequestTTY yes
```

## Include other configs

```
Include ~/.ssh/configs/*
```

## Complete example

```
# Default settings
Host *
    ServerAliveInterval 60
    ServerAliveCountMax 3
    ControlMaster auto
    ControlPath ~/.ssh/sockets/%r@%h-%p
    ControlPersist 600

# Production servers
Host prod-*
    User deployer
    IdentityFile ~/.ssh/id_rsa_prod
    StrictHostKeyChecking yes

# Development servers
Host dev-*
    User developer
    IdentityFile ~/.ssh/id_rsa_dev
    StrictHostKeyChecking no

# Specific server
Host webapp
    HostName prod-web-01.example.com
    User admin
    Port 2222
    LocalForward 3306 localhost:3306
```

## SSH key generation

```bash
# RSA key
ssh-keygen -t rsa -b 4096 -C "email@example.com"

# Ed25519 key (recommended)
ssh-keygen -t ed25519 -C "email@example.com"

# With custom filename
ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519_work
```

## Copy key to server

```bash
ssh-copy-id user@hostname

# With specific key
ssh-copy-id -i ~/.ssh/id_rsa_work.pub user@hostname
```

## Test SSH config

```bash
ssh -T git@github.com
ssh -vvv user@hostname
```

## View effective config

```bash
ssh -G hostname
```
