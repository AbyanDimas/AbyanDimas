---
title: "Systemctl Service Management"
description: "Manage systemd services: start, stop, restart, and troubleshoot."
date: "2025-09-01"
tags: ["systemd", "linux", "services"]
category: "System"
---

## Start a service

```bash
sudo systemctl start nginx
```

## Stop a service

```bash
sudo systemctl stop nginx
```

## Restart a service

```bash
sudo systemctl restart nginx
```

## Reload service configuration

```bash
sudo systemctl reload nginx
```

## Enable service at boot

```bash
sudo systemctl enable nginx
```

## Disable service at boot

```bash
sudo systemctl disable nginx
```

## Check service status

```bash
sudo systemctl status nginx
```

## View service logs

```bash
sudo journalctl -u nginx
```

## Follow service logs (real-time)

```bash
sudo journalctl -u nginx -f
```

## List all services

```bash
systemctl list-units --type=service
```

## List failed services

```bash
systemctl --failed
```

## Reload systemd daemon

After editing service files:

```bash
sudo systemctl daemon-reload
```

## Check if service is active

```bash
systemctl is-active nginx
```

## Check if service is enabled

```bash
systemctl is-enabled nginx
```
