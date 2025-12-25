---
title: "Optimizing Docker Images for Production"
date: "2025-02-15"
author: "Abyan Dimas"
excerpt: "Learn how to reduce your Docker image size by 90% using Multi-stage builds and Alpine Linux."
coverImage: "https://images.unsplash.com/photo-1605745341112-85968b19335b?q=80&w=1200&auto=format&fit=crop"
---

![Docker Containers](https://images.unsplash.com/photo-1605745341112-85968b19335b?q=80&w=1200&auto=format&fit=crop)

Container optimization is a crucial skill for any Cloud Engineer. Large images slow down deployments, increase storage costs, and broaden the attack surface.

## The Problem: Bloated Images

A standard Node.js image (`node:18`) can be over 1GB. For a simple Hello World app, this is unacceptable.

## Solution 1: Use Alpine

Switching to `node:18-alpine` immediately drops the base size to under 50MB.

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
CMD ["node", "index.js"]
```

## Solution 2: Multi-Stage Builds

The real magic happens with multi-stage builds. You use one stage to install dependencies and build, and a second empty stage to run the app.

```dockerfile
# Build Stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production Stage
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

CMD ["npm", "start"]
```

## Result

By implementing these techniques, I've seen production images drop from **1.2GB** to **120MB**. Faster deployments, happier DevOps.
