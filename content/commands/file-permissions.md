---
title: "File Permissions Master Guide"
description: "chmod, chown, and Linux permission management made simple."
date: "2025-08-27"
tags: ["linux", "permissions", "security"]
category: "System"
---

## Understanding permissions

```
-rwxr-xr--
```

*   `-`: File type (`-` = file, `d` = directory)
*   `rwx`: Owner permissions (read, write, execute)
*   `r-x`: Group permissions
*   `r--`: Others permissions

## Give execute permission

```bash
chmod +x script.sh
```

## Set specific permissions (755)

```bash
chmod 755 file.txt
```

*   `7` (Owner): read + write + execute
*   `5` (Group): read + execute
*   `5` (Others): read + execute

## Common permission codes

*   `644`: Read/write for owner, read-only for others
*   `755`: Executable for all, writable by owner
*   `600`: Private file, only owner can read/write
*   `777`: Full access for everyone (Avoid in production!)

## Recursively change permissions

```bash
chmod -R 755 /var/www/html
```

## Change file owner

```bash
chown username file.txt
```

## Change owner and group

```bash
chown username:groupname file.txt
```

## Recursively change ownership

```bash
chown -R www-data:www-data /var/www
```

## View file permissions

```bash
ls -la file.txt
```

## Set default permissions for new files

```bash
umask 022
```
