---
title: "Linux Server Error Troubleshooting: PostgreSQL, Systemd, Permissions, Network"
date: "2025-08-18"
author: "Abyan Dimas"
excerpt: "Real error outputs and proven fixes. PostgreSQL connection failures, systemd service errors, permission denied, and network issues solved."
coverImage: "https://images.unsplash.com/photo-1558494949-ef526b0042a0?q=80&w=1200&auto=format&fit=crop"
---

![Server Error](https://images.unsplash.com/photo-1558494949-ef526b0042a0?q=80&w=1200&auto=format&fit=crop)

## Introduction

This guide solves **actual production errors** with real error outputs. Copy-paste style troubleshooting for Linux sysadmins.

---

## Error #1: PostgreSQL Connection Refused

### The Error Output

```
$ psql -h localhost -U postgres
psql: error: connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
```

Or from application logs:

```
django.db.utils.OperationalError: connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
	Is the server running on that host and accepting TCP/IP connections?
```

### When This Happens

- After server reboot
- Fresh PostgreSQL installation
- Changing configuration files
- After system updates
- Firewall changes

### What It Actually Means

**Not** an authentication problem. The connection can't even be established.

**Real cause:** PostgreSQL daemon (postgres) is either:
1. Not running at all
2. Running but not listening on expected port/interface
3. Blocked by firewall

### Step 1: Check if PostgreSQL is Running

```bash
sudo systemctl status postgresql
```

**Example Output (Not Running):**

```
● postgresql.service - PostgreSQL RDBMS
     Loaded: loaded (/lib/systemd/system/postgresql.service)
     Active: inactive (dead)
```

**Example Output (Running):**

```
● postgresql.service - PostgreSQL RDBMS
     Loaded: loaded (/lib/systemd/system/postgresql.service)
     Active: active (exited) since Mon 2025-03-10 10:00:00 UTC; 5min ago
```

If `inactive (dead)`, go to **Solution A**.
If `active` but still connection refused, go to **Step 2**.

### Step 2: Check What Port PostgreSQL is Listening On

```bash
sudo ss -lntp | grep postgres
```

**Example Output (Listening on all interfaces):**

```
LISTEN 0  128  0.0.0.0:5432  0.0.0.0:*  users:(("postgres",pid=1234,fd=5))
LISTEN 0  128     [::]:5432     [::]:*  users:(("postgres",pid=1234,fd=6))
```

**Example Output (Listening only on localhost):**

```
LISTEN 0  128  127.0.0.1:5432  0.0.0.0:*  users:(("postgres",pid=1234,fd=5))
```

**Example Output (Not listening at all):**

```
(no output)
```

If no output, PostgreSQL is running but not listening properly. Check logs (Step 3).

### Step 3: Check PostgreSQL Logs

```bash
# Ubuntu/Debian
sudo tail -50 /var/log/postgresql/postgresql-14-main.log

# CentOS/RHEL
sudo tail -50 /var/lib/pgsql/data/log/postgresql-*.log

# Via journalctl
sudo journalctl -u postgresql -n 50
```

Look for errors like:

```
FATAL:  could not create lock file "/var/run/postgresql/.s.PGSQL.5432.lock": Permission denied
```

or

```
FATAL:  data directory "/var/lib/postgresql/14/main" has wrong ownership
```

### Solution A: PostgreSQL Not Running (Start It)

```bash
# Start service
sudo systemctl start postgresql

# Enable on boot
sudo systemctl enable postgresql

# Verify
sudo systemctl status postgresql
```

### Solution B: PostgreSQL Listening on Wrong Interface

**Problem:** Config set to `localhost` only, but you're connecting from external IP.

Edit PostgreSQL config:

```bash
# Find config file
sudo -u postgres psql -c "SHOW config_file;"
# Output: /etc/postgresql/14/main/postgresql.conf

# Edit it
sudo nano /etc/postgresql/14/main/postgresql.conf
```

Find line:

```
listen_addresses = 'localhost'
```

Change to:

```
listen_addresses = '*'
```

**Restart:**

```bash
sudo systemctl restart postgresql
```

### Solution C: Firewall Blocking

Check if firewall is running:

```bash
# Ubuntu/Debian (UFW)
sudo ufw status

# CentOS/RHEL (firewalld)
sudo firewall-cmd --list-all
```

**Allow PostgreSQL port:**

```bash
# UFW
sudo ufw allow 5432/tcp

# firewalld
sudo firewall-cmd --add-port=5432/tcp --permanent
sudo firewall-cmd --reload
```

### Verification

```bash
# Test local connection
psql -h localhost -U postgres

# Test from remote machine
psql -h <server-ip> -U postgres
```

### Common Mistakes

❌ **Restarting before checking logs** - You miss the root cause
❌ **Assuming it's authentication** - Connection refused ≠ auth failed
❌ **Opening firewall without checking if service is running**
❌ **Editing wrong config file** (PostgreSQL can have multiple versions)

### Prevention

1. **Enable service on boot:**
   ```bash
   sudo systemctl enable postgresql
   ```

2. **Monitor service status:**
   ```bash
   # Add to cron for alert
   systemctl is-active postgresql || echo "PostgreSQL DOWN" | mail -s "Alert" admin@example.com
   ```

3. **Check logs after config changes**

---

## Error #2: PostgreSQL Password Authentication Failed

### The Error Output

```
$ psql -h localhost -U myuser -d mydb
Password for user myuser:
psql: error: connection to server at "localhost" (127.0.0.1), port 5432 failed: FATAL:  password authentication failed for user "myuser"
```

Or in application logs:

```
sqlalchemy.exc.OperationalError: (psycopg2.OperationalError) FATAL:  password authentication failed for user "django_user"
```

### When This Happens

- After changing user passwords
- Fresh database setup
- Migrating from development to production
- After editing `pg_hba.conf`

### What It Actually Means

The connection succeeded, but authentication failed. Either:
1. Wrong password
2. User doesn't exist
3. `pg_hba.conf` has wrong authentication method
4. User exists but not in the right database

### Step 1: Check if User Exists

```bash
sudo -u postgres psql -c "\du"
```

**Example Output:**

```
                                   List of roles
 Role name |                         Attributes                         
-----------+------------------------------------------------------------
 postgres  | Superuser, Create role, Create DB, Replication, Bypass RLS
 myuser    | 
```

If `myuser` is not in list, user doesn't exist. Go to **Solution A**.

### Step 2: Check pg_hba.conf

```bash
# Find pg_hba.conf location
sudo -u postgres psql -c "SHOW hba_file;"

# View it
sudo cat /etc/postgresql/14/main/pg_hba.conf | grep -v "^#" | grep -v "^$"
```

**Example Output:**

```
local   all             postgres                                peer
local   all             all                                     peer
host    all             all             127.0.0.1/32            md5
host    all             all             ::1/128                 md5
```

**Key lines explained:**

- `local ... peer` = Local connections use system user authentication
- `host ... md5` = TCP/IP connections require password (encrypted)
- `host ... trust` = No password required (DANGEROUS!)

### Step 3: Test Connection as postgres User

```bash
sudo -u postgres psql
```

If this works, the issue is with your specific user credentials.

### Solution A: User Doesn't Exist (Create It)

```bash
# Connect as postgres
sudo -u postgres psql

# Create user with password
CREATE USER myuser WITH PASSWORD 'secure_password';

# Grant privileges to database
GRANT ALL PRIVILEGES ON DATABASE mydb TO myuser;

# Exit
\q
```

### Solution B: Wrong Password (Reset It)

```bash
# Connect as postgres
sudo -u postgres psql

# Change password
ALTER USER myuser WITH PASSWORD 'new_secure_password';

# Exit
\q
```

### Solution C: Wrong Authentication Method in pg_hba.conf

**Problem:** Config uses `peer` but you're connecting via TCP.

Edit `pg_hba.conf`:

```bash
sudo nano /etc/postgresql/14/main/pg_hba.conf
```

**Change this:**

```
local   all             myuser                                  peer
```

**To this:**

```
local   all             myuser                                  md5
```

Or to allow network connections:

```
host    mydb            myuser          192.168.1.0/24          md5
```

**Reload config (don't need full restart):**

```bash
sudo systemctl reload postgresql
```

### Solution D: User Doesn't Have Access to Database

```bash
# Connect as postgres
sudo -u postgres psql

# Grant access
GRANT CONNECT ON DATABASE mydb TO myuser;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO myuser;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO myuser;

# Make it default for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO myuser;

\q
```

### Verification

```bash
# Test connection
psql -h localhost -U myuser -d mydb

# Should connect without error
```

### Common Mistakes

❌ **Using wrong username** (`postgres` vs `myuser`)
❌ **Editing pg_hba.conf but not reloading** (`systemctl reload postgresql`)
❌ **Confusing `local` with `host`** (local = Unix socket, host = TCP/IP)
❌ **Granting privileges to wrong database**
❌ **Using `trust` in production** (no password required = security risk)

### Prevention

1. **Use strong passwords:**
   ```bash
   # Generate random password
   openssl rand -base64 32
   ```

2. **Restrict access by IP in pg_hba.conf:**
   ```
   host    mydb    myuser    10.0.1.0/24    md5
   ```

3. **Use separate users for each app** (don't share credentials)

4. **Document credentials in password manager**, not plain text files

---

## Error #3: Systemd Service Failed to Start

### The Error Output

```
$ sudo systemctl start myapp
Job for myapp.service failed because the control process exited with error code.
See "systemctl status myapp.service" and "journalctl -xe" for details.

$ sudo systemctl status myapp
● myapp.service - My Application
     Loaded: loaded (/etc/systemd/system/myapp.service; enabled; vendor preset: enabled)
     Active: failed (Result: exit-code) since Mon 2025-03-10 10:00:00 UTC; 5s ago
    Process: 12345 ExecStart=/usr/bin/node /opt/myapp/server.js (code=exited, status=1/FAILURE)
   Main PID: 12345 (code=exited, status=1/FAILURE)

Mar 10 10:00:00 server systemd[1]: myapp.service: Main process exited, code=exited, status=1/FAILURE
Mar 10 10:00:00 server systemd[1]: myapp.service: Failed with result 'exit-code'.
Mar 10 10:00:00 server systemd[1]: Failed to start My Application.
```

### When This Happens

- After creating new systemd service
- After editing unit file
- After system updates
- When dependencies fail
- Permission issues

### What It Actually Means

Your service's main process started but immediately crashed (exit code 1 = general error).

**Not a systemd problem** - your application has a bug or misconfiguration.

### Step 1: Check Detailed Logs

```bash
# Last 50 lines of service logs
sudo journalctl -u myapp -n 50 --no-pager

# Follow logs in real-time
sudo journalctl -u myapp -f
```

**Example Output:**

```
Mar 10 10:00:00 server node[12345]: Error: Cannot find module 'express'
Mar 10 10:00:00 server node[12345]:     at Function.Module._resolveFilename (internal/modules/cjs/loader.js:880:15)
Mar 10 10:00:00 server systemd[1]: myapp.service: Main process exited, code=exited, status=1/FAILURE
```

**Root cause:** Missing dependencies.

### Step 2: Check Unit File Syntax

```bash
# View unit file
sudo systemctl cat myapp

# Check for syntax errors
sudo systemd-analyze verify myapp.service
```

### Step 3: Try Running Command Manually

If `ExecStart=/usr/bin/node /opt/myapp/server.js`, run it manually:

```bash
# Switch to service user first
sudo -u myappuser /usr/bin/node /opt/myapp/server.js
```

This shows you the actual error without systemd wrapping it.

### Solution A: Missing Dependencies

**For Node.js:**

```bash
cd /opt/myapp
sudo -u myappuser npm install
```

**For Python:**

```bash
cd /opt/myapp
sudo -u myappuser pip3 install -r requirements.txt
```

### Solution B: Permission Denied

**Error in logs:**

```
EACCES: permission denied, open '/opt/myapp/data/database.db'
```

**Fix ownership:**

```bash
sudo chown -R myappuser:myappuser /opt/myapp
```

**Fix permissions:**

```bash
# Directories: 755
sudo find /opt/myapp -type d -exec chmod 755 {} \;

# Files: 644
sudo find /opt/myapp -type f -exec chmod 644 {} \;

# Main executable: 755
sudo chmod 755 /opt/myapp/server.js
```

### Solution C: Port Already in Use

**Error in logs:**

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Find what's using the port:**

```bash
sudo ss -lntp | grep :3000
```

**Output:**

```
LISTEN 0  128  *:3000  *:*  users:(("node",pid=8888,fd=10))
```

**Kill it:**

```bash
sudo kill 8888

# Or if it's an old instance of same service
sudo systemctl stop myapp
sudo systemctl start myapp
```

### Solution D: Environment Variables Missing

**Error in logs:**

```
Error: DATABASE_URL is not defined
```

**Add to unit file:**

```bash
sudo nano /etc/systemd/system/myapp.service
```

**Add under `[Service]`:**

```ini
[Service]
Environment="DATABASE_URL=postgresql://user:pass@localhost/db"
Environment="NODE_ENV=production"
```

Or use `EnvironmentFile`:

```ini
[Service]
EnvironmentFile=/etc/myapp/env
```

**Then create `/etc/myapp/env`:**

```bash
DATABASE_URL=postgresql://user:pass@localhost/db
NODE_ENV=production
```

**Reload and restart:**

```bash
sudo systemctl daemon-reload
sudo systemctl restart myapp
```

### Solution E: Working Directory Wrong

**Error:**

```
Error: ENOENT: no such file or directory, open 'config.json'
```

**Fix:** Add `WorkingDirectory` to unit file:

```ini
[Service]
WorkingDirectory=/opt/myapp
ExecStart=/usr/bin/node server.js
```

### Verification

```bash
# Check status
sudo systemctl status myapp

# Should show:
# Active: active (running)

# Test functionality
curl http://localhost:3000
```

### Common Mistakes

❌ **Not running `daemon-reload` after editing unit file**
❌ **Wrong user in `User=` directive** (file permissions won't match)
❌ **Absolute paths not used in `ExecStart`** (use `/usr/bin/node`, not just `node`)
❌ **Missing `WorkingDirectory` when app expects relative paths**
❌ **Not setting environment variables**

### Prevention

1. **Template unit file:**

```ini
[Unit]
Description=My Application
After=network.target postgresql.service

[Service]
Type=simple
User=myappuser
WorkingDirectory=/opt/myapp
EnvironmentFile=/etc/myapp/env
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

2. **Always test manually first:**
   ```bash
   sudo -u myappuser /usr/bin/node /opt/myapp/server.js
   ```

3. **Use `Restart=always`** for auto-recovery

---

## Error #4: Permission Denied on File/Directory

### The Error Output

```
$ cat /var/log/nginx/access.log
cat: /var/log/nginx/access.log: Permission denied

$ mkdir /opt/myapp/data
mkdir: cannot create directory '/opt/myapp/data': Permission denied

$ ./deploy.sh
bash: ./deploy.sh: Permission denied
```

### When This Happens

- Accessing files owned by other users
- Creating files in restricted directories
- Running scripts without execute permission
- After changing ownership

### What It Actually Means

Linux permission system (user/group/others, rwx) is blocking your action.

### Step 1: Check File Permissions

```bash
ls -lah /var/log/nginx/access.log
```

**Example Output:**

```
-rw-r----- 1 www-data adm 12M Mar 10 10:00 /var/log/nginx/access.log
```

**Breakdown:**

- `-rw-r-----`
  - `-` = regular file
  - `rw-` = owner (www-data) can read and write
  - `r--` = group (adm) can read
  - `---` = others have no access

- Your user is not `www-data` and not in `adm` group, so you can't read it.

### Step 2: Check Your User and Groups

```bash
whoami
# Output: deploy

groups
# Output: deploy
```

### Solution A: Add User to Required Group

```bash
# Add your user to 'adm' group
sudo usermod -aG adm deploy

# Logout and login for changes to take effect
exit

# Re-login via SSH
ssh deploy@server

# Verify
groups
# Output: deploy adm
```

### Solution B: Use sudo for Temporary Access

```bash
sudo cat /var/log/nginx/access.log
```

**Warning:** Don't use sudo for everything. Understand why permission is denied.

### Solution C: Change File Ownership

**Only if you should own the file:**

```bash
sudo chown deploy:deploy /opt/myapp/data
```

### Solution D: Fix Execute Permission on Script

```bash
# Check current permission
ls -l deploy.sh
# -rw-r--r-- 1 deploy deploy 1234 Mar 10 10:00 deploy.sh

# Add execute permission
chmod +x deploy.sh

# Verify
ls -l deploy.sh
# -rwxr-xr-x 1 deploy deploy 1234 Mar 10 10:00 deploy.sh

# Now run it
./deploy.sh
```

### Verification

```bash
# Test access
cat /var/log/nginx/access.log

# Should work without error
```

### Common Mistakes

❌ **Using `chmod 777` on everything** (massive security risk)
❌ **Running everything with sudo** (masks permission issues)
❌ **Changing ownership of system files** (/var/log should stay root/www-data)
❌ **Not logging out after `usermod -aG`** (group changes need new session)

### Prevention

1. **Use proper groups for shared access**
2. **Set up ACLs for complex permissions**
3. **Never `chmod 777` in production**
4. **Document why specific permissions are set**

---

## Error #5: No Space Left on Device

### The Error Output

```
$ echo "test" > file.txt
bash: file.txt: No space left on device

$ sudo apt update
E: Write error - write (28: No space left on device)

$ docker pull nginx
Error response from daemon: write /var/lib/docker/tmp/GetImageBlob123: no space left on device
```

Or in application logs:

```
IOError: [Errno 28] No space left on device: '/var/log/myapp/app.log'
```

### When This Happens

- Logs filling up disk
- Docker images accumulating
- Database growing
- Temp files not cleaned

### Step 1: Check Disk Usage

```bash
df -h
```

**Example Output:**

```
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1        20G   20G     0 100% /
/dev/sdb1       100G   75G   25G  75% /data
```

**Problem:** Root filesystem is 100% full.

### Step 2: Find Large Directories

```bash
cd /
sudo du -h --max-depth=1 | sort -hr | head -20
```

**Example Output:**

```
18G     .
10G     ./var
4G      ./usr
2G      ./home
1G      ./opt
```

`/var` is the culprit. Dig deeper:

```bash
cd /var
sudo du -h --max-depth=1 | sort -hr | head -20
```

**Output:**

```
10G     .
8G      ./log
1.5G    ./lib
500M    ./cache
```

### Step 3: Find Specific Large Files

```bash
sudo find /var/log -type f -size +100M -exec ls -lh {} \;
```

**Example Output:**

```
-rw-r----- 1 syslog adm 5.2G Mar 10 10:00 /var/log/syslog
-rw-r----- 1 www-data www-data 2.8G Mar 10 10:00 /var/log/nginx/access.log
```

### Solution A: Clean System Logs

```bash
# Truncate large log files (don't delete!)
sudo truncate -s 0 /var/log/syslog
sudo truncate -s 0 /var/log/nginx/access.log

# Clean systemd journal
sudo journalctl --vacuum-time=7d

# Or by size
sudo journalctl --vacuum-size=500M
```

### Solution B: Clean Package Manager Cache

```bash
# Ubuntu/Debian
sudo apt clean
sudo apt autoclean
sudo apt autoremove

# CentOS/RHEL
sudo yum clean all
```

### Solution C: Clean Docker

```bash
# Remove stopped containers
docker container prune

# Remove unused images
docker image prune -a

# Remove everything unused
docker system prune -a --volumes
```

### Solution D: Check for Deleted But Open Files

```bash
sudo lsof | grep deleted | grep -v '/tmp'
```

**Example Output:**

```
nginx     1234  www-data    3w   REG   8,1  3221225472  deleted
```

Nginx has a 3GB deleted file still open!

**Fix:**

```bash
sudo systemctl restart nginx
```

### Verification

```bash
df -h
```

**Output should show free space:**

```
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1        20G   12G   8G  60% /
```

### Common Mistakes

❌ **Deleting `/var/log/*` entirely** (breaks services expecting log files)
❌ **Not checking for deleted open files**
❌ **Forgetting Docker uses space**
❌ **No log rotation configured**

### Prevention

1. **Set up log rotation:**

```bash
# /etc/logrotate.d/myapp
/var/log/myapp/*.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
    create 0640 myapp myapp
}
```

2. **Monitor disk usage:**

```bash
# Cron alert script
#!/bin/bash
USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
if [ $USAGE -gt 80 ]; then
    echo "Disk usage: ${USAGE}%" | mail -s "Disk Alert" admin@example.com
fi
```

3. **Automate Docker cleanup:**

```bash
# Weekly cron
0 3 * * 0 docker system prune -f --volumes
```

---

## Conclusion

**Pattern for all errors:**

1. Read the **exact error message**
2. Check service **status** and **logs**
3. Verify **configuration files**
4. Test **manually** before using systemd
5. Fix **root cause**, not symptoms
6. **Verify** the fix works
7. **Prevent** recurrence with monitoring

**Never:**
- Restart without checking logs
- Use `chmod 777` or `chown -R root`
- Skip verification step
- Assume cloud/container magic will fix it

**Always:**
- Read logs first
- Understand the error before Googling solutions
- Test in safe way before production
- Document the fix for next time

---

> **Pro Tip**: Create a `/root/troubleshooting.md` file with these commands. When under pressure at 3 AM, you'll thank yourself.
