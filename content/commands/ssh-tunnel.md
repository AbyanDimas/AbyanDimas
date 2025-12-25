---
title: "SSH Tunneling & Port Forwarding"
description: "Essential SSH commands for remote access, tunneling, and secure port forwarding."
date: "2025-08-23"
tags: ["ssh", "security", "networking"]
category: "Network"
---

## SSH into remote server

Basic SSH connection with username and host.

```bash
ssh username@remote-host.com
```

## SSH with custom port

```bash
ssh -p 2222 username@remote-host.com
```

## Local port forwarding

Forward local port 8080 to remote server's port 80.

```bash
ssh -L 8080:localhost:80 username@remote-host.com
```

Now access `localhost:8080` to reach the remote server's port 80.

## Remote port forwarding (Reverse tunnel)

Allow remote server to access your local service.

```bash
ssh -R 9000:localhost:3000 username@remote-host.com
```

## Dynamic port forwarding (SOCKS proxy)

Create a SOCKS proxy on port 1080.

```bash
ssh -D 1080 username@remote-host.com
```

Configure your browser to use `localhost:1080` as SOCKS proxy.

## Copy SSH key to server

```bash
ssh-copy-id username@remote-host.com
```

## SSH without password prompt (with key)

```bash
ssh -i ~/.ssh/id_rsa username@remote-host.com
```
