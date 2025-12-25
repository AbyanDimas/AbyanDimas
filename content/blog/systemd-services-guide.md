---
title: "Mastering Systemd: Creating and Managing Custom Services"
date: "2025-07-03"
author: "Abyan Dimas"
excerpt: "Stop running apps in `screen`. Learn to write Unit files, manage dependencies, and analyze logs with journalctl."
coverImage: "https://images.unsplash.com/photo-1591696205402-94473027ae66?q=80&w=1200&auto=format&fit=crop"
---

![System Logs](https://images.unsplash.com/photo-1591696205402-94473027ae66?q=80&w=1200&auto=format&fit=crop)

`init.d` scripts are dead. Long live **Systemd**. It is the standard init system for almost all modern Linux distributions (timeless debates aside). It manages the boot process and services.

## Why Systemd?

*   **Parallel Startup**: Booting is faster.
*   **Dependency Management**: "Start WebServer only after Network is up".
*   **Respawn**: Automatically restarts crashed services.
*   **Logging**: Centralized binary logging journal.

## Creating a Service Unit

Let's say you have a Node.js app. Don't run `node server.js` and leave the terminal open. Create a service.

File: `/etc/systemd/system/myapp.service`

```ini
[Unit]
Description=My Node App
After=network.target postgresql.service

[Service]
Type=simple
User=appuser
WorkingDirectory=/opt/myapp
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

### Breakdown
1.  **After**: Waits for Network and Database.
2.  **User**: Runs as `appuser` (Security!).
3.  **Restart**: If it crashes, it waits 10s and tries again.
4.  **WantedBy**: Tells systemd to start this when booting into standard multi-user mode.

## Enabling and Running

```bash
sudo systemctl daemon-reload   # Scan for new files
sudo systemctl enable myapp    # Start on boot
sudo systemctl start myapp     # Start now
```

## Debugging with Journalctl

Systemd stores logs in a binary format. Use `journalctl` to query them effectively.

*   `journalctl -u myapp`: Show logs for specific unit.
*   `journalctl -f`: Follow logs (like tail -f).
*   `journalctl -p err`: Show only errors.
*   `journalctl --since "1 hour ago"`: Time travel.

Systemd gives you production-grade reliability with simple configuration.
