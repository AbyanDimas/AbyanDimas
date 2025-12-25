---
title: "Nginx Configuration Essentials"
description: "Common nginx commands and configuration snippets."
date: "2025-09-07"
tags: ["nginx", "web-server", "devops"]
category: "DevOps"
---

## Test nginx configuration

```bash
sudo nginx -t
```

## Reload nginx

```bash
sudo systemctl reload nginx
```

Or:

```bash
sudo nginx -s reload
```

## Restart nginx

```bash
sudo systemctl restart nginx
```

## Stop nginx

```bash
sudo systemctl stop nginx
```

## View nginx version

```bash
nginx -v
```

## Check nginx status

```bash
sudo systemctl status nginx
```

## View error logs

```bash
sudo tail -f /var/log/nginx/error.log
```

## View access logs

```bash
sudo tail -f /var/log/nginx/access.log
```

## Basic server block (virtual host)

```nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/example;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

## Reverse proxy

```nginx
location / {
    proxy_pass http://localhost:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

## SSL configuration

```nginx
server {
    listen 443 ssl;
    server_name example.com;
    
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
}
```

## Redirect HTTP to HTTPS

```nginx
server {
    listen 80;
    server_name example.com;
    return 301 https://$server_name$request_uri;
}
```

## Enable gzip compression

```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```
