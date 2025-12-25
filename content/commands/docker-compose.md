---
title: "Docker Compose Multi-Container Apps"
description: "Manage multi-container Docker applications with docker-compose."
date: "2025-09-25"
tags: ["docker-compose", "docker", "containers"]
category: "DevOps"
---

## Start services

```bash
docker-compose up
```

## Start in background

```bash
docker-compose up -d
```

## Stop services

```bash
docker-compose down
```

## Stop and remove volumes

```bash
docker-compose down -v
```

## View logs

```bash
docker-compose logs
```

## Follow logs

```bash
docker-compose logs -f
```

## View specific service logs

```bash
docker-compose logs -f web
```

## List running services

```bash
docker-compose ps
```

## Restart services

```bash
docker-compose restart
```

## Rebuild images

```bash
docker-compose build
```

## Build without cache

```bash
docker-compose build --no-cache
```

## Scale service

```bash
docker-compose up -d --scale web=3
```

## Execute command in service

```bash
docker-compose exec web bash
```

## Run one-off command

```bash
docker-compose run web python manage.py migrate
```

## Pull latest images

```bash
docker-compose pull
```

## Validate configuration

```bash
docker-compose config
```

## View environment variables

```bash
docker-compose config --services
```

## Pause services

```bash
docker-compose pause
```

## Unpause services

```bash
docker-compose unpause
```

## Basic docker-compose.yml

```yaml
version: '3.8'

services:
  web:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./html:/usr/share/nginx/html
    
  db:
    image: postgres:14
    environment:
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: myapp
    volumes:
      - db_data:/var/lib/postgresql/data

volumes:
  db_data:
```

## Use custom file

```bash
docker-compose -f custom-compose.yml up
```

## Multiple compose files

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up
```

## Remove stopped containers

```bash
docker-compose rm
```
