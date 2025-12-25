---
title: "Docker Cleanup One-Liners"
description: "Quick commands to reclaim disk space from unused Docker resources."
date: "2025-08-21"
tags: ["docker", "devops", "cleanup"]
category: "DevOps"
---

## The Nuclear Option

Remove all unused containers, networks, images (both dangling and unreferenced), and optionally, volumes.

```bash
docker system prune -a --volumes
```

## Remove stopped containers

```bash
docker container prune
```

## Remove dangling images

Images that are not tagged and not used by any container.

```bash
docker image prune
```

## Kill all running containers

```bash
docker kill $(docker ps -q)
```

## Remove all containers

```bash
docker rm $(docker ps -a -q)
```
