---
title: "Podman Container Management"
description: "Docker-compatible container management without daemon using Podman."
date: "2025-11-10"
tags: ["podman", "containers", "docker"]
category: "DevOps"
---

## Install Podman

```bash
# Ubuntu/Debian
sudo apt install -y podman

# RHEL/CentOS/Fedora
sudo dnf install podman

# macOS
brew install podman
```

## Podman vs Docker

- No daemon required (daemonless)
- Rootless by default
- Compatible with Docker images
- Drop-in replacement for Docker

## Basic commands (Docker-compatible)

```bash
# Run container
podman run -d --name web nginx

# List running containers
podman ps

# List all containers
podman ps -a

# Stop container
podman stop web

# Start container
podman start web

# Remove container
podman rm web
```

## Pull images

```bash
podman pull nginx
podman pull docker.io/library/nginx
podman pull quay.io/podman/hello
```

## Run container

```bash
# Interactive
podman run -it ubuntu bash

# Detached
podman run -d nginx

# With name
podman run -d --name my-nginx nginx

# With port mapping
podman run -d -p 8080:80 nginx

# With volume
podman run -d -v /host/path:/container/path nginx

# With environment variables
podman run -d -e "VAR=value" nginx
```

## List images

```bash
podman images
podman image ls
```

## Remove image

```bash
podman rmi nginx
podman image rm nginx
```

## Build image

```bash
podman build -t myapp .
podman build -t myapp:v1.0 -f Dockerfile.prod .
```

## Container logs

```bash
podman logs container-name
podman logs -f container-name  # Follow
podman logs --tail 100 container-name
```

## Execute command in container

```bash
podman exec container-name ls
podman exec -it container-name bash
```

## Inspect container

```bash
podman inspect container-name
podman inspect --format '{{.NetworkSettings.IPAddress}}' container-name
```

## Pod management

```bash
# Create pod
podman pod create --name mypod -p 8080:80

# Run container in pod
podman run -d --pod mypod nginx

# List pods
podman pod list

# Inspect pod
podman pod inspect mypod

# Stop pod
podman pod stop mypod

# Remove pod
podman pod rm mypod
```

## Rootless containers

```bash
# Run as non-root user
podman run -d --name web nginx

# Check user namespace
podman unshare cat /proc/self/uid_map
```

## Generate systemd unit

```bash
# From running container
podman generate systemd --name web > ~/.config/systemd/user/container-web.service

# Enable and start
systemctl --user enable container-web
systemctl --user start container-web
```

## Generate Kubernetes YAML

```bash
# From container
podman generate kube container-name > pod.yaml

# From pod
podman generate kube mypod > pod.yaml
```

## Play Kubernetes YAML

```bash
podman play kube pod.yaml
```

## Compose with podman-compose

```bash
# Install
pip3 install podman-compose

# Use like docker-compose
podman-compose up
podman-compose down
podman-compose ps
```

## Save and load images

```bash
# Save
podman save -o nginx.tar nginx

# Load
podman load -i nginx.tar
```

## Export and import containers

```bash
# Export
podman export container-name > container.tar

# Import
cat container.tar | podman import - myimage:latest
```

## Search images

```bash
podman search nginx
podman search --limit 5 nginx
```

## Tag image

```bash
podman tag nginx:latest myregistry.com/nginx:v1.0
```

## Push to registry

```bash
podman login registry.example.com
podman push myimage:latest registry.example.com/myimage:latest
```

## Container networking

```bash
# Create network
podman network create mynet

# Run container on network
podman run -d --network mynet --name web nginx

# List networks
podman network ls

# Inspect network
podman network inspect mynet

# Remove network
podman network rm mynet
```

## Volume management

```bash
# Create volume
podman volume create myvolume

# List volumes
podman volume ls

# Inspect volume
podman volume inspect myvolume

# Remove volume
podman volume rm myvolume

# Use volume
podman run -d -v myvolume:/data nginx
```

## Container stats

```bash
podman stats
podman stats container-name
```

## Resource limits

```bash
# Memory limit
podman run -d --memory 512m nginx

# CPU limit
podman run -d --cpus 1.5 nginx

# CPU shares
podman run -d --cpu-shares 512 nginx
```

## Health check

```bash
podman run -d \
  --health-cmd "curl -f http://localhost/ || exit 1" \
  --health-interval 30s \
  --health-retries 3 \
  --health-timeout 10s \
  nginx
```

## Auto-update containers

```bash
# Tag container for auto-update
podman run -d --label io.containers.autoupdate=image nginx

# Run auto-update
podman auto-update
```

## Systemd integration

```bash
# Generate systemd service for pod
podman pod create --name webapp -p 8080:80
podman run -d --pod webapp nginx
podman generate systemd --name --files webapp

# Install service
mv pod-webapp.service ~/.config/systemd/user/
systemctl --user daemon-reload
systemctl --user enable pod-webapp
systemctl --user start pod-webapp
```

## Quadlet (systemd native)

Create `~/.config/containers/systemd/nginx.container`:

```ini
[Container]
Image=nginx:latest
PublishPort=8080:80
Volume=/data:/usr/share/nginx/html:Z

[Service]
Restart=always

[Install]
WantedBy=default.target
```

Activate:
```bash
systemctl --user daemon-reload
systemctl --user start nginx
```

## Secrets management

```bash
# Create secret
echo "mypassword" | podman secret create db_password -

# List secrets
podman secret ls

# Use secret
podman run -d --secret db_password myapp
```

## Clean up

```bash
# Remove stopped containers
podman container prune

# Remove unused images
podman image prune

# Remove unused volumes
podman volume prune

# Remove everything
podman system prune -a
```

## Dockerfile example

```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:
```bash
podman build -t myapp .
podman run -d -p 3000:3000 myapp
```

## Complete workflow

```bash
# Pull image
podman pull nginx

# Run container
podman run -d \
  --name web \
  -p 8080:80 \
  -v $(pwd)/html:/usr/share/nginx/html:Z \
  nginx

# Check status
podman ps

# View logs
podman logs web

# Generate systemd service
podman generate systemd --name web \
  > ~/.config/systemd/user/container-web.service

# Enable service
systemctl --user enable container-web

# Reboot and verify
systemctl --user status container-web
```

## Alias for Docker compatibility

Add to `~/.bashrc` or `~/.zshrc`:

```bash
alias docker=podman
```

## Tips

```bash
# Run as root if needed
sudo podman run -d nginx

# Machine for macOS/Windows
podman machine init
podman machine start

# Compatible with Docker Hub
podman pull docker.io/library/nginx

# Use --userns flag for specific user namespace
podman run --userns keep-id nginx
```
