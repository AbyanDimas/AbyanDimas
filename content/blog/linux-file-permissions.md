---
title: "Linux File Permissions Deep Dive: SUID, SGID, and Sticky Bit"
date: "2025-07-01"
author: "Abyan Dimas"
excerpt: "Beyond `chmod 777`. Understanding the security implications of advanced Linux permissions and ownership."
coverImage: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=1200&auto=format&fit=crop"
---

![Linux Terminal](https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=1200&auto=format&fit=crop)

Every Linux user knows `rwx` (Read, Write, Execute). But operating a secure server requires understanding the "Special Permissions" that govern how users interact with shared files and system binaries.

## The Basics: UGO and Octal

Permissions apply to **U**ser (Owner), **G**roup, and **O**thers.
*   **Read (4)**: View file contents or list directory.
*   **Write (2)**: Modify file or create/delete inside directory.
*   **Execute (1)**: Run binary or enter directory.

`chmod 755 file` means:
*   User: 7 (4+2+1) = Read + Write + Exec
*   Group: 5 (4+0+1) = Read + Exec
*   Others: 5 (4+0+1) = Read + Exec

## 1. SUID (Set User ID)

**What**: When executed, the file runs as the **Owner**, not the current user.
**Why**: Passwords. `/usr/bin/passwd` needs to modify `/etc/shadow` (root only), but users need to run it to change their own password. SUID allows my user to run `passwd` as root temporarily.
**Risk**: If a script has SUID and creates a shell, anyone running it becomes root.

```bash
chmod u+s filename
# Look for 's' in execute spot: -rwsr-xr-x
```

## 2. SGID (Set Group ID)

**Files**: Executed with the permissions of the **Group**.
**Directories**: New files created inside inherit the **Group ownership** of the directory, not the user's primary group.
**Use Case**: Shared folders. Development teams often use this so everyone can edit each other's files in `/var/www`.

```bash
chmod g+s directoryname
```

## 3. Sticky Bit

**What**: Only the **Owner** (and root) can delete files inside this directory.
**Use Case**: `/tmp`. Everyone has write access (can create files), but you shouldn't be able to delete another user's temporary files.

```bash
chmod +t /tmp
# Look for 't' at the end: drwxrwxrwt
```

## Security Best Practices

*   **Never use 777**: It allows anyone to modify or inject malicious code.
*   **Audit SUID files**: `find / -perm /4000` lists all SUID files. Check for binaries that shouldn't grant root access (like `vim` or `less`).
*   **Use Groups**: Instead of opening permissions to "Others", create a specific group for access.

Mastering these bits separates a Linux User from a Systems Administrator.
