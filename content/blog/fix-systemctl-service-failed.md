---
title: "How to Fix 'systemctl service failed' Error in Linux: Complete Troubleshooting Guide"
date: "2025-08-10"
author: "Abyan Dimas"
excerpt: "Step-by-step tutorial to diagnose and fix systemd service failures. From 'service not starting' to 'failed to start' errors with real solutions."
coverImage: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=1200&auto=format&fit=crop"
---

![Linux Service Error](https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=1200&auto=format&fit=crop)

## The Problem: Service Won't Start

You try to start a service and get this:

```bash
$ sudo systemctl start myapp
Job for myapp.service failed because the control process exited with error code.
See "systemctl status myapp.service" and "journalctl -xe" for details.
```

Or variations like:
- `Failed to start <service>.service`
- `Service has no installation config`
- `Unit <service>.service could not be found`

**Stop.** Don't panic. Don't reinstall. This guide will fix it.

---

## Understanding Systemd Services

Before fixing, understand what **systemd** is:
- Modern init system for Linux (replaced SysVinit)
- Manages all services/daemons (nginx, mysql, your app)
- Uses "unit files" (`.service` files) for configuration

When a service fails, systemd captures **why** it failed. Your job is to read those logs correctly.

---

## Error #1: Service Failed to Start (Generic)

### Symptom

```bash
$ sudo systemctl start nginx
Job for nginx.service failed. See 'systemctl status nginx' and 'journalctl -xe' for details.
```

### Step 1: Check Service Status

```bash
sudo systemctl status nginx
```

**Example Output:**
```
● nginx.service - A high performance web server
   Loaded: loaded (/lib/systemd/system/nginx.service; enabled)
   Active: failed (Result: exit-code) since Mon 2025-03-10 10:00:00 UTC; 5s ago
  Process: 12345 ExecStart=/usr/sbin/nginx -g daemon off; (code=exited, status=1/FAILURE)
 Main PID: 12345 (code=exited, status=1/FAILURE)

Mar 10 10:00:00 server nginx[12345]: nginx: [emerg] bind() to 0.0.0.0:80 failed (98: Address already in use)
Mar 10 10:00:00 server nginx[12345]: nginx: [emerg] still could not bind()
Mar 10 10:00:00 server systemd[1]: nginx.service: Failed with result 'exit-code'.
```

**Key Information:**
- `Active: failed` - Service is not running
- `exit-code` - The process exited with an error
- **Error Message**: `bind() to 0.0.0.0:80 failed (98: Address already in use)`

**Root Cause**: Port 80 already in use by another process.

### Step 2: Check Detailed Logs

```bash
sudo journalctl -u nginx -n 50 --no-pager
```

Flags explained:
- `-u nginx` = Show logs for nginx unit
- `-n 50` = Last 50 lines
- `--no-pager` = Print all at once (no scrolling)

### Step 3: Fix the Root Cause

For "port already in use":

```bash
# Find what's using port 80
sudo ss -lntp | grep :80
```

Output:
```
LISTEN  0  128  0.0.0.0:80  0.0.0.0:*  users:(("apache2",pid=8888,fd=4))
```

**Solution**: Apache is using port 80. Stop it:

```bash
sudo systemctl stop apache2
sudo systemctl disable apache2  # Prevent auto-start on boot
sudo systemctl start nginx
```

### Step 4: Verify

```bash
sudo systemctl status nginx
# Should show: Active: active (running)

curl localhost:80
# Should return HTML
```

---

## Error #2: Configuration File Syntax Error

### Symptom

```bash
$ sudo systemctl restart nginx
Job for nginx.service failed. See 'systemctl status nginx' and 'journalctl -xe' for details.
```

### Step 1: Status Check

```bash
sudo systemctl status nginx
```

Output shows:
```
nginx: [emerg] unexpected "}" in /etc/nginx/nginx.conf:45
nginx: configuration file /etc/nginx/nginx.conf test failed
```

**Root Cause**: Syntax error in config file.

### Step 2: Test Configuration

Most services have a test command:

```bash
# Nginx
sudo nginx -t

# Apache
sudo apache2ctl configtest

# HAProxy
sudo haproxy -c -f /etc/haproxy/haproxy.cfg
```

Output:
```
nginx: [emerg] unexpected "}" in /etc/nginx/nginx.conf:45
nginx: configuration file /etc/nginx/nginx.conf test failed
```

### Step 3: Fix Config

Open the file and fix line 45:

```bash
sudo nano /etc/nginx/nginx.conf
# Go to line 45, fix the syntax error
```

**Common mistakes:**
- Missing semicolon `;`
- Extra closing brace `}`
- Typo in directive name

### Step 4: Test Again

```bash
sudo nginx -t
# nginx: configuration file /etc/nginx/nginx.conf test successful

sudo systemctl restart nginx
```

---

## Error #3: Permission Denied

### Symptom

```bash
$ sudo systemctl start myapp
Job for myapp.service failed. See 'systemctl status myapp' and 'journalctl -xe' for details.
```

Logs show:
```
Mar 10 10:00:00 server myapp[1234]: /usr/bin/python3: can't open file '/opt/myapp/app.py': [Errno 13] Permission denied
```

### Step 1: Check File Permissions

```bash
ls -lah /opt/myapp/app.py
```

Output:
```
-rw------- 1 root root 1234 Mar 10 09:00 /opt/myapp/app.py
```

**Problem**: File is owned by `root`, but service runs as `myapp` user (as defined in unit file).

### Step 2: Check Service User

```bash
sudo systemctl cat myapp | grep User
```

Output:
```
User=myapp
```

Service runs as `myapp` user but file is owned by `root`.

### Step 3: Fix Ownership

```bash
sudo chown -R myapp:myapp /opt/myapp
```

### Step 4: Fix Permissions

```bash
# Directories: 755 (rwxr-xr-x)
sudo find /opt/myapp -type d -exec chmod 755 {} \;

# Files: 644 (rw-r--r--)
sudo find /opt/myapp -type f -exec chmod 644 {} \;

# Make main script executable
sudo chmod +x /opt/myapp/app.py
```

### Step 5: Restart

```bash
sudo systemctl restart myapp
sudo systemctl status myapp
# Active: active (running)
```

---

## Error #4: Missing Dependencies

### Symptom

Service starts then immediately crashes.

```bash
sudo systemctl status myapp
```

Output:
```
Active: failed (Result: exit-code)
Process: 1234 ExecStart=/usr/bin/node server.js (code=exited, status=1/FAILURE)
```

Logs show:
```
Error: Cannot find module 'express'
```

### Step 1: Check Application Logs

```bash
sudo journalctl -u myapp -n 50
```

### Step 2: Fix Missing Dependencies

```bash
# For Node.js
cd /opt/myapp
sudo -u myapp npm install

# For Python
cd /opt/myapp
sudo -u myapp pip3 install -r requirements.txt
```

**Important**: Run as the service user (`myapp`), not as root.

### Step 3: Restart

```bash
sudo systemctl restart myapp
```

---

## Error #5: Service Unit Not Found

### Symptom

```bash
$ sudo systemctl start myapp
Failed to start myapp.service: Unit myapp.service not found.
```

### Step 1: Verify Unit File Exists

```bash
ls -l /etc/systemd/system/myapp.service
# or
ls -l /lib/systemd/system/myapp.service
```

If file doesn't exist, you need to create it.

### Step 2: Create Unit File

```bash
sudo nano /etc/systemd/system/myapp.service
```

**Example Template:**

```ini
[Unit]
Description=My Application
After=network.target

[Service]
Type=simple
User=myapp
WorkingDirectory=/opt/myapp
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=myapp

[Install]
WantedBy=multi-user.target
```

### Step 3: Reload Systemd

**Critical Step**: Systemd needs to re-scan for new unit files.

```bash
sudo systemctl daemon-reload
```

### Step 4: Enable and Start

```bash
sudo systemctl enable myapp  # Start on boot
sudo systemctl start myapp
```

---

## Error #6: Dependency Failed

### Symptom

```bash
$ sudo systemctl start myapp
Job for myapp.service failed because a dependency job failed.
```

### Step 1: Check Dependencies

```bash
systemctl list-dependencies myapp
```

Output:
```
myapp.service
● ├─postgresql.service  ← Failed!
● ├─network.target
```

### Step 2: Fix Dependency

```bash
# Start the failed dependency
sudo systemctl start postgresql

# Then start your service
sudo systemctl start myapp
```

### Step 3: Modify Unit File (If Needed)

If PostgreSQL should auto-start before your app:

```bash
sudo nano /etc/systemd/system/myapp.service
```

Add:
```ini
[Unit]
After=postgresql.service
Requires=postgresql.service
```

Reload and restart:
```bash
sudo systemctl daemon-reload
sudo systemctl restart myapp
```

---

## Using `journalctl` Like a Pro

### Follow Logs Real-Time

```bash
sudo journalctl -u myapp -f
```

This is your **debugging window**. Keep it open while you restart the service in another terminal.

### Filter by Time

```bash
# Last hour
sudo journalctl -u nginx --since "1 hour ago"

# Specific time range
sudo journalctl -u myapp --since "2025-03-10 10:00" --until "2025-03-10 11:00"

# Today's logs
sudo journalctl -u myapp --since today
```

### Show Only Errors

```bash
sudo journalctl -u myapp -p err
```

Priority levels:
- `emerg` (0) - System is unusable
- `alert` (1) - Action must be taken immediately
- `crit` (2) - Critical conditions
- `err` (3) - Error conditions
- `warning` (4) - Warning conditions
- `notice` (5) - Normal but significant
- `info` (6) - Informational
- `debug` (7) - Debug-level messages

### Disk Space Management

Logs can grow huge. Clean old logs:

```bash
# Keep only last 7 days
sudo journalctl --vacuum-time=7d

# Keep max 500MB
sudo journalctl --vacuum-size=500M
```

---

## Common Mistakes Users Make

### 1. Not Running `daemon-reload`

After editing `.service` file, **always**:

```bash
sudo systemctl daemon-reload
```

Without this, systemd won't see your changes.

### 2. Using `service` Instead of `systemctl`

Old command:
```bash
sudo service nginx start  # Deprecated!
```

Modern way:
```bash
sudo systemctl start nginx
```

### 3. Not Checking Logs

Don't just run `start` and hope. **Always check**:

```bash
sudo systemctl status myapp
sudo journalctl -u myapp -n 50
```

### 4. Running as Root Unnecessarily

**Bad:**
```ini
[Service]
User=root  # Security risk!
```

**Good:**
```ini
[Service]
User=myapp  # Run as dedicated user
```

### 5. Forgetting to Enable

Service starts now but won't survive reboot:

```bash
sudo systemctl start myapp  # Start now
sudo systemctl enable myapp  # Start on boot
```

---

## Prevention: Best Practices

### 1. Always Test Config Before Reload

```bash
# Test first
sudo nginx -t

# Only reload if test passes
sudo systemctl reload nginx
```

### 2. Use Restart Policies

In your `.service` file:

```ini
[Service]
Restart=on-failure
RestartSec=10
```

This auto-restarts on crashes (but not on manual stop).

### 3. Set Resource Limits

Prevent runaway processes:

```ini
[Service]
MemoryMax=512M
CPUQuota=50%
```

### 4. Monitor Services

Install monitoring (Prometheus, Netdata, or simple cron):

```bash
# Simple healthcheck script
#!/bin/bash
if ! systemctl is-active --quiet myapp; then
    echo "Service myapp is down!" | mail -s "Alert" admin@example.com
    sudo systemctl restart myapp
fi
```

### 5. Backup Unit Files

Before editing:

```bash
sudo cp /etc/systemd/system/myapp.service /etc/systemd/system/myapp.service.backup
```

---

## Troubleshooting Workflow Checklist

When a service fails, follow this order:

- [ ] Run `sudo systemctl status <service>`
- [ ] Read the error message carefully
- [ ] Run `sudo journalctl -u <service> -n 50`
- [ ] Identify root cause (port, config, permissions, dependency)
- [ ] Fix the root cause
- [ ] Test configuration if applicable (`nginx -t`, etc.)
- [ ] Run `sudo systemctl daemon-reload` if unit file changed
- [ ] Run `sudo systemctl restart <service>`
- [ ] Verify with `sudo systemctl status <service>`
- [ ] Test functionality (`curl`, browser, etc.)

---

## Emergency Recovery

### Service Won't Stop

```bash
# Force stop
sudo systemctl kill -s SIGKILL myapp

# Then clean restart
sudo systemctl restart myapp
```

### Systemd Itself is Broken

```bash
# Re-execute systemd
sudo systemctl daemon-reexec
```

### Last Resort: Boot to Single User Mode

If system won't boot due to service failure, at GRUB:
1. Press `e` to edit boot parameters
2. Add `systemd.unit=rescue.target` to kernel line
3. Press `Ctrl+X` to boot into rescue mode
4. Fix the broken service
5. Disable it: `systemctl disable broken-service`
6. Reboot

---

## Conclusion

95% of "service failed" errors come down to:
1. **Port conflicts** - Use `ss -lntp`
2. **Config errors** - Use `nginx -t` or equivalent
3. **Permission issues** - Check `chown` and `chmod`
4. **Missing dependencies** - Install them
5. **Forgot daemon-reload** - Run it after changes

**Master these, and you'll troubleshoot like a senior sysadmin.**

> **Pro Tip**: Keep `sudo journalctl -u <service> -f` running in a separate terminal whenever you're debugging services. Real-time logs are invaluable.
