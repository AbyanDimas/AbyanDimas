---
title: "Certbot Let's Encrypt SSL"
description: "Automate SSL certificate management with Certbot and Let's Encrypt."
date: "2025-10-07"
tags: ["certbot", "ssl", "letsencrypt"]
category: "Security"
---

## Install Certbot

```bash
# Ubuntu/Debian
sudo apt install certbot

# With Nginx plugin
sudo apt install python3-certbot-nginx

# With Apache plugin
sudo apt install python3-certbot-apache
```

## Obtain certificate (Nginx)

```bash
sudo certbot --nginx -d example.com -d www.example.com
```

## Obtain certificate (Apache)

```bash
sudo certbot --apache -d example.com -d www.example.com
```

## Standalone mode

```bash
sudo certbot certonly --standalone -d example.com
```

## Webroot mode

```bash
sudo certbot certonly --webroot -w /var/www/html -d example.com
```

## DNS challenge

```bash
sudo certbot certonly --manual --preferred-challenges dns -d example.com
```

## Wildcard certificate

```bash
sudo certbot certonly --manual --preferred-challenges dns -d "*.example.com"
```

## List certificates

```bash
sudo certbot certificates
```

## Renew all certificates

```bash
sudo certbot renew
```

## Renew specific certificate

```bash
sudo certbot renew --cert-name example.com
```

## Dry run renewal

```bash
sudo certbot renew --dry-run
```

## Force renewal (< 30 days)

```bash
sudo certbot renew --force-renewal
```

## Revoke certificate

```bash
sudo certbot revoke --cert-path /etc/letsencrypt/live/example.com/cert.pem
```

## Delete certificate

```bash
sudo certbot delete --cert-name example.com
```

## Update email

```bash
sudo certbot update_account --email new@example.com
```

## Show account info

```bash
sudo certbot show_account
```

## Expand certificate (add domain)

```bash
sudo certbot --nginx -d example.com -d www.example.com -d api.example.com
```

## Certificate locations

```
Certificates: /etc/letsencrypt/live/example.com/
├── cert.pem       # Certificate only
├── chain.pem      # Intermediate certificates
├── fullchain.pem  # Certificate + chain
└── privkey.pem    # Private key
```

## Auto-renewal setup

Certbot installs cron job automatically:

```bash
# Check cron
cat /etc/cron.d/certbot
```

Or systemd timer:

```bash
systemctl list-timers certbot
```

## Manual renewal cron

```cron
0 0,12 * * * root certbot renew --quiet
```

## Nginx configuration

```nginx
server {
    listen 443 ssl;
    server_name example.com;

    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    
    # SSL settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
}
```

## Apache configuration

```apache
<VirtualHost *:443>
    ServerName example.com
    
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/example.com/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/example.com/privkey.pem
</VirtualHost>
```

## Hooks (run scripts on renewal)

```bash
sudo certbot renew \
  --deploy-hook "systemctl reload nginx"
```

## Pre/post hooks

```bash
--pre-hook "systemctl stop nginx"
--post-hook "systemctl start nginx"
```

## Set config directory

```bash
sudo certbot --config-dir /custom/path
```

## Non-interactive mode

```bash
sudo certbot --non-interactive --nginx -d example.com --agree-tos -m admin@example.com
```
