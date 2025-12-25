---
title: "Fail2ban Intrusion Prevention"
description: "Protect your server from brute-force attacks with fail2ban."
date: "2025-10-05"
tags: ["fail2ban", "security", "ssh"]
category: "Security"
---

## Install fail2ban

```bash
sudo apt install fail2ban
```

## Start fail2ban

```bash
sudo systemctl start fail2ban
```

## Enable on boot

```bash
sudo systemctl enable fail2ban
```

## Check status

```bash
sudo systemctl status fail2ban
```

## Show all jails

```bash
sudo fail2ban-client status
```

## Show specific jail status

```bash
sudo fail2ban-client status sshd
```

## Unban IP

```bash
sudo fail2ban-client set sshd unbanip 192.168.1.100
```

## Ban IP manually

```bash
sudo fail2ban-client set sshd banip 192.168.1.100
```

## Reload fail2ban

```bash
sudo fail2ban-client reload
```

## Reload specific jail

```bash
sudo fail2ban-client reload sshd
```

## Basic jail configuration

Create `/etc/fail2ban/jail.local`:

```ini
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5
destemail = admin@example.com
sendername = Fail2Ban

[sshd]
enabled = true
port = 22
logpath = /var/log/auth.log
maxretry = 3
```

## Nginx brute force protection

```ini
[nginx-http-auth]
enabled = true
filter = nginx-http-auth
port = http,https
logpath = /var/log/nginx/error.log

[nginx-noscript]
enabled = true
port = http,https
filter = nginx-noscript
logpath = /var/log/nginx/access.log
maxretry = 6

[nginx-badbots]
enabled = true
port = http,https
filter = nginx-badbots
logpath = /var/log/nginx/access.log
maxretry = 2
```

## Create custom filter

Create `/etc/fail2ban/filter.d/myapp.conf`:

```ini
[Definition]
failregex = ^<HOST> - .* "POST /login HTTP/.*" 401
ignoreregex =
```

## Test filter regex

```bash
sudo fail2ban-regex /var/log/myapp.log /etc/fail2ban/filter.d/myapp.conf
```

## View banned IPs

```bash
sudo fail2ban-client get sshd banned
```

## Get jail config

```bash
sudo fail2ban-client get sshd bantime
sudo fail2ban-client get sshd maxretry
```

## Set jail parameters

```bash
sudo fail2ban-client set sshd bantime 7200
sudo fail2ban-client set sshd maxretry 3
```

## Check logs

```bash
sudo tail -f /var/log/fail2ban.log
```

## Whitelist IP

In `/etc/fail2ban/jail.local`:

```ini
[DEFAULT]
ignoreip = 127.0.0.1/8 192.168.1.0/24
```

## Email notifications

```ini
[DEFAULT]
action = %(action_mwl)s
```

## Common jails

```ini
[sshd]
[apache-auth]
[apache-badbots]
[nginx-http-auth]
[postfix-sasl]
[dovecot]
[mysql-auth]
```

## Show jail actions

```bash
sudo fail2ban-client get sshd actions
```
