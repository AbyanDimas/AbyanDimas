---
title: "SMB/CIFS Windows Shares"
description: "Mount and access Windows/Samba shares on Linux with SMB/CIFS."
date: "2025-11-18"
tags: ["smb", "cifs", "samba", "windows"]
category: "Network"
---

## Install CIFS utilities

```bash
# Ubuntu/Debian
sudo apt install cifs-utils samba samba-common-bin

# RHEL/CentOS
sudo yum install cifs-utils samba-client
```

## Mount SMB share

### Basic mount

```bash
sudo mount -t cifs //server/share /mnt/share -o username=user,password=pass
```

### Better: Use credentials file

Create `~/.smbcredentials`:
```
username=myuser
password=mypassword
domain=WORKGROUP
```

Set permissions:
```bash
chmod 600 ~/.smbcredentials
```

Mount:
```bash
sudo mount -t cifs //server/share /mnt/share -o credentials=~/.smbcredentials
```

## Permanent mount (fstab)

Add to `/etc/fstab`:

```
//server/share  /mnt/share  cifs  credentials=/home/user/.smbcredentials,uid=1000,gid=1000  0  0
```

### Common mount options

```
username=user           # Username
password=pass           # Password (not recommended)
credentials=/path/file  # Credentials file
uid=1000               # File owner UID
gid=1000               # File owner GID  
file_mode=0755         # File permissions
dir_mode=0755          # Directory permissions
vers=3.0               # SMB version
sec=ntlmssp            # Security mode
_netdev                # Wait for network
```

## List shares

```bash
# List shares on server
smbclient -L //server -U username

# Anonymous
smbclient -L //server -N
```

## Interactive access

```bash
# Connect to share
smbclient //server/share -U username

# Inside smbclient:
ls                  # List files
get file.txt        # Download
put localfile.txt   # Upload
mget *.txt          # Download multiple
mput *.txt          # Upload multiple
cd directory        # Change directory
pwd                 # Print working directory
help                # Show commands
exit                # Quit
```

## Copy files

```bash
# Using smbclient
smbclient //server/share -U username -c "get file.txt"

# Recursive get
smbclient //server/share -U username -c "prompt OFF; recurse ON; mget *"
```

## Test with smbget

```bash
# Download file
smbget smb://server/share/file.txt -U username

# Recursive download
smbget -R smb://server/share/ -U username
```

## Mount Windows share

```bash
# Windows 10/11 share
sudo mount -t cifs //192.168.1.100/Users /mnt/windows \
  -o username=WindowsUser,password=pass,vers=3.0
```

## Domain authentication

```bash
sudo mount -t cifs //server/share /mnt/share \
  -o username=user,password=pass,domain=DOMAIN
```

## Security modes

```bash
# NTLMv2 (most common)
-o sec=ntlmssp

# Kerberos
-o sec=krb5

# NTLM
-o sec=ntlm

# No security  
-o sec=none
```

## SMB versions

```bash
# SMB 3.0 (Windows 8/Server 2012+)
-o vers=3.0

# SMB 2.1 (Windows 7/Server 2008R2)
-o vers=2.1

# SMB 1.0 (deprecated, insecure)
-o vers=1.0
```

## Troubleshooting

### Permission denied

```bash
# Check credentials
smbclient -L //server -U username

# Try different SMB version
sudo mount -t cifs //server/share /mnt -o username=user,vers=2.1
```

### Host is down

```bash
# Test connectivity
ping server
telnet server 445

# Check firewall
sudo nmap -p 445 server
```

### List more details

```bash
# Verbose mount
sudo mount -t cifs //server/share /mnt -o username=user,vers=3.0 -v
```

## Unmount

```bash
sudo umount /mnt/share

# Force unmount
sudo umount -f /mnt/share
sudo umount -l /mnt/share  # Lazy
```

## Check mounted CIFS shares

```bash
mount | grep cifs
df -h | grep cifs
```

## Samba server (share Linux folder)

### Install

```bash
sudo apt install samba
```

### Configure `/etc/samba/smb.conf`

```ini
[MyShare]
   path = /path/to/share
   browseable = yes
   read only = no
   guest ok = no
   create mask = 0755
```

### Add Samba user

```bash
sudo smbpasswd -a username
```

### Restart Samba

```bash
sudo systemctl restart smbd
sudo systemctl restart nmbd
```

### Test configuration

```bash
testparm
```

## Firewall (for Samba server)

```bash
# Ubuntu UFW
sudo ufw allow samba

# Or specific ports
sudo ufw allow 139/tcp
sudo ufw allow 445/tcp
sudo ufw allow 137/udp
sudo ufw allow 138/udp
```

## Common issues

### "Host is down"

- Check network connectivity
- Verify server is running
- Check firewall (port 445)

### "Permission denied"

- Verify credentials
- Check share permissions
- Try different security mode

### "Invalid argument"

- Try different SMB version
- Check mount options syntax

## Performance tuning

```bash
# Larger buffer
-o rsize=130048,wsize=130048

# No caching (for consistency)
-o cache=none

# More aggressive caching
-o cache=strict
```

## AutoFS for SMB

`/etc/auto.master`:
```
/mnt/cifs  /etc/auto.cifs  --timeout=60
```

`/etc/auto.cifs`:
```
share  -fstype=cifs,credentials=/root/.smbcredentials  ://server/share
```

## Complete example

```bash
# 1. Create mount point
sudo mkdir -p /mnt/windowsshare

# 2. Create credentials file
cat > ~/.smbcredentials << EOF
username=myuser
password=mypassword
domain=WORKGROUP
EOF
chmod 600 ~/.smbcredentials

# 3. Test mount
sudo mount -t cifs //192.168.1.100/Share /mnt/windowsshare \
  -o credentials=$HOME/.smbcredentials,uid=1000,gid=1000,vers=3.0

# 4. Add to fstab
echo "//192.168.1.100/Share  /mnt/windowsshare  cifs  credentials=$HOME/.smbcredentials,uid=1000,gid=1000,vers=3.0,_netdev  0  0" | sudo tee -a /etc/fstab

# 5. Test fstab
sudo mount -a
```
