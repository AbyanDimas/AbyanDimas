---
title: "Systemd-analyze Boot Performance"
description: "Analyze system boot time and service startup performance."
date: "2025-10-02"
tags: ["systemd", "performance", "linux"]
category: "System"
---

## Show boot time

```bash
systemd-analyze
```

## Show detailed boot time

```bash
systemd-analyze time
```

## Blame slow services

```bash
systemd-analyze blame
```

## Show critical chain

```bash
systemd-analyze critical-chain
```

## Critical chain for specific service

```bash
systemd-analyze critical-chain nginx.service
```

## Plot boot graph (SVG)

```bash
systemd-analyze plot > boot.svg
```

## Show service dependencies

```bash
systemd-analyze dot nginx.service | dot -Tsvg > nginx-deps.svg
```

## Verify system configuration

```bash
systemd-analyze verify
```

## Verify specific service

```bash
systemd-analyze verify /etc/systemd/system/myapp.service
```

## Show security score

```bash
systemd-analyze security
```

## Security analysis for service

```bash
systemd-analyze security nginx.service
```

## List unit files

```bash
systemd-analyze unit-files
```

## Show calendar events

```bash
systemd-analyze calendar "Mon *-*-* 00:00:00"
```

## Verify timer syntax

```bash
systemd-analyze calendar weekly
```

## Show unit paths

```bash
systemd-analyze unit-paths
```

## Dump all unit properties

```bash
systemd-analyze dump
```

## Show condition test

```bash
systemd-analyze condition 'ConditionPathExists=/etc/nginx/nginx.conf'
```

## Set boot target analysis

```bash
systemd-analyze set-log-level debug
```

## Check boot loader entries

```bash
systemd-analyze --boot-loader-entries
```

## Compare boot times

```bash
systemd-analyze plot --iterations=5 > boot-comparison.svg
```
