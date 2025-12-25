---
title: "Systemd Unit Files"
description: "Create and manage custom systemd service unit files."
date: "2025-11-06"
tags: ["systemd", "services", "linux"]
category: "System"
---

## Unit file location

- System: `/etc/systemd/system/`
- User: `~/.config/systemd/user/`
- Package: `/lib/systemd/system/`

## Basic service unit

Create `/etc/systemd/system/myapp.service`:

```ini
[Unit]
Description=My Application
After=network.target

[Service]
ExecStart=/usr/bin/myapp
Restart=always

[Install]
WantedBy=multi-user.target
```

## Common [Unit] options

```ini
[Unit]
Description=Service description
Documentation=https://example.com/docs
After=network.target postgresql.service
Before=nginx.service
Requires=postgresql.service
Wants=redis.service
Conflicts=another-service.service
```

## [Service] types

```ini
Type=simple      # Default
Type=forking     # Traditional daemons
Type=oneshot     # One-time tasks
Type=notify      # Notifies when ready
Type=dbus        # D-Bus activation
Type=idle        # Delayed execution
```

## [Service] options

```ini
[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/var/www/app
Environment="NODE_ENV=production"
EnvironmentFile=/etc/myapp/env
ExecStartPre=/usr/bin/prepare.sh
ExecStart=/usr/bin/node server.js
ExecReload=/bin/kill -HUP $MAINPID
ExecStop=/usr/bin/cleanup.sh
Restart=on-failure
RestartSec=5
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=myapp
```

## Restart policies

```ini
Restart=no           # Don't restart
Restart=always       # Always restart
Restart=on-success   # Restart on clean exit
Restart=on-failure   # Restart on error
Restart=on-abnormal  # Restart on signal/timeout
Restart=on-abort     # Restart on unclean signal
```

## Security options

```ini
[Service]
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/var/lib/myapp
ReadOnlyPaths=/etc/myapp
CapabilityBoundingSet=CAP_NET_BIND_SERVICE
```

## Resource limits

```ini
[Service]
MemoryLimit=512M
CPUQuota=50%
TasksMax=10
LimitNOFILE=4096
Nice=19
IOSchedulingClass=idle
```

## Dependencies

```ini
[Unit]
After=network.target           # Start after
Before=nginx.service           # Start before
Requires=postgresql.service    # Hard dependency
Wants=redis.service            # Soft dependency
BindsTo=storage.mount          # Strict binding
PartOf=app.target             # Part of group
```

## Timer unit

Create `/etc/systemd/system/backup.timer`:

```ini
[Unit]
Description=Daily Backup Timer

[Timer]
OnCalendar=daily
OnCalendar=*-*-* 02:00:00
Persistent=true

[Install]
WantedBy=timers.target
```

Create `/etc/systemd/system/backup.service`:

```ini
[Unit]
Description=Backup Service

[Service]
Type=oneshot
ExecStart=/usr/local/bin/backup.sh
```

## Timer calendars

```ini
OnCalendar=hourly
OnCalendar=daily
OnCalendar=weekly
OnCalendar=monthly
OnCalendar=*-*-* 04:00:00      # Every day at 4am
OnCalendar=Mon *-*-* 00:00:00  # Every Monday
OnCalendar=Mon..Fri *-*-* 09:00:00  # Weekdays at 9am
```

## Socket activation

Create `/etc/systemd/system/myapp.socket`:

```ini
[Unit]
Description=My App Socket

[Socket]
ListenStream=8080
Accept=no

[Install]
WantedBy=sockets.target
```

## Path unit (monitor file changes)

Create `/etc/systemd/system/watch-config.path`:

```ini
[Unit]
Description=Watch Config File

[Path]
PathChanged=/etc/myapp/config.ini
Unit=reload-config.service

[Install]
WantedBy=multi-user.target
```

## Template units

Create `/etc/systemd/system/worker@.service`:

```ini
[Unit]
Description=Worker %i

[Service]
ExecStart=/usr/bin/worker %i
Restart=always

[Install]
WantedBy=multi-user.target
```

Start multiple instances:
```bash
sudo systemctl start worker@1
sudo systemctl start worker@2
sudo systemctl start worker@3
```

## Complete example: Node.js app

`/etc/systemd/system/nodeapp.service`:

```ini
[Unit]
Description=Node.js App
Documentation=https://docs.example.com
After=network.target

 [Service]
Type=simple
User=nodeuser
Group=nodeuser
WorkingDirectory=/opt/nodeapp
Environment="NODE_ENV=production"
Environment="PORT=3000"
ExecStart=/usr/bin/node app.js
Restart=on-failure
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=nodeapp

# Security
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/opt/nodeapp/data

# Resources
MemoryLimit=512M
CPUQuota=50%

[Install]
WantedBy=multi-user.target
```

## Enable and start

```bash
sudo systemctl daemon-reload
sudo systemctl enable nodeapp
sudo systemctl start nodeapp
sudo systemctl status nodeapp
```

## Reload service configuration

```bash
sudo systemctl daemon-reload
sudo systemctl reload-or-restart myapp
```

## Override unit file

```bash
sudo systemctl edit myapp.service
```

Creates `/etc/systemd/system/myapp.service.d/override.conf`

## View effective configuration

```bash
systemctl cat myapp.service
```

## Check unit file syntax

```bash
systemd-analyze verify /etc/systemd/system/myapp.service
```

## Debug unit

```bash
systemd-analyze verify myapp.service
systemctl status myapp -l
journalctl -u myapp.service -f
```

## User service

Create `~/.config/systemd/user/myservice.service`:

```ini
[Unit]
Description=My User Service

[Service]
ExecStart=/home/user/bin/myapp

[Install]
WantedBy=default.target
```

Enable user service:
```bash
systemctl --user enable myservice
systemctl --user start myservice
```

## Best practices

```ini
# 1. Always specify dependencies
After=network.target postgresql.service

# 2. Use specific user
User=appuser
Group=appuser

# 3. Enable restart
Restart=on-failure
RestartSec=5

# 4. Add logging
StandardOutput=journal
StandardError=journal
SyslogIdentifier=myapp

# 5. Set resource limits
MemoryLimit=512M
CPUQuota=50%

# 6. Security hardening
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
```
