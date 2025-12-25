---
title: "Logrotate Log Management"
description: "Automatic log file rotation, compression, and cleanup with logrotate."
date: "2025-10-06"
tags: ["logrotate", "logs", "maintenance"]
category: "System"
---

## Force rotation

```bash
sudo logrotate -f /etc/logrotate.conf
```

## Debug mode (dry run)

```bash
sudo logrotate -d /etc/logrotate.conf
```

## Verbose output

```bash
sudo logrotate -v /etc/logrotate.conf
```

## Check status

```bash
cat /var/lib/logrotate/status
```

## Main config file

`/etc/logrotate.conf`

## Custom config directory

`/etc/logrotate.d/`

## Basic configuration

```conf
/var/log/myapp/*.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
    create 0640 www-data www-data
    sharedscripts
    postrotate
        systemctl reload myapp > /dev/null
    endscript
}
```

## Rotation frequency

```conf
daily      # Rotate daily
weekly     # Rotate weekly
monthly    # Rotate monthly
yearly     # Rotate yearly
size 100M  # Rotate when file reaches size
```

## Compression options

```conf
compress              # Compress rotated files
nocompress           # Don't compress
delaycompress        # Compress on next rotation
compresscmd gzip     # Compression command
compressext .gz      # Extension for compressed files
compressoptions -9   # Max compression
```

## File handling

```conf
rotate 7                # Keep 7 rotated logs
maxage 30              # Remove logs older than 30 days
size 100M              # Rotate when file exceeds size
minsize 10M            # Rotate only if file is large enough
missingok              # Don't error if log is missing
notifempty             # Don't rotate if log is empty
create 0640 user group # Create new log with permissions
copytruncate           # Copy then truncate (for apps that keep file open)
```

## Scripts

```conf
sharedscripts    # Run scripts once for all logs
prerotate
    # Run before rotation
endscript
postrotate
    # Run after rotation
endscript
firstaction
    # Run before all logs
endscript
lastaction
    # Run after all logs
endscript
```

## Nginx example

```conf
/var/log/nginx/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data adm
    sharedscripts
    prerotate
        if [ -d /etc/logrotate.d/httpd-prerotate ]; then \
            run-parts /etc/logrotate.d/httpd-prerotate; \
        fi
    endscript
    postrotate
        [ -f /var/run/nginx.pid ] && kill -USR1 `cat /var/run/nginx.pid`
    endscript
}
```

## Apache example

```conf
/var/log/apache2/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 640 root adm
    sharedscripts
    postrotate
        /etc/init.d/apache2 reload > /dev/null
    endscript
}
```

## Syslog example

```conf
/var/log/syslog {
    rotate 7
    daily
    missingok
    notifempty
    delaycompress
    compress
    postrotate
        /usr/lib/rsyslog/rsyslog-rotate
    endscript
}
```

## Date in filename

```conf
dateext                  # Add date extension
dateformat -%Y%m%d      # Custom date format
dateyesterday           # Use yesterday's date
```

## Custom compression

```conf
compresscmd /usr/bin/bzip2
compressext .bz2
compressoptions -9
```

## Mail logs before deletion

```conf
mail admin@example.com
mailfirst                # Mail original log
maillast                 # Mail rotated log
```

## Include other configs

```conf
include /etc/logrotate.d
```

## Test specific config

```bash
sudo logrotate -d /etc/logrotate.d/nginx
```
