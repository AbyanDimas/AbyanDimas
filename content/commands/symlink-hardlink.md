---
title: "Symlink & Hardlink Files"
description: "Create and manage symbolic and hard links with ln command."
date: "2025-11-27"
tags: ["ln", "symlink", "hardlink"]
category: "Tools"
---

## Symbolic link (symlink)

```bash
ln -s /path/to/original /path/to/link
ln -s /etc/nginx/nginx.conf ~/nginx.conf
```

## Hard link

```bash
ln /path/to/original /path/to/link
ln /var/log/app.log ~/app.log
```

## Differences

### Symbolic link:
- Points to path (string)
- Can link directories
- Can cross filesystems
- Breaks if original is moved/deleted
- Shows as link in `ls -l`

### Hard link:
- Points to inode
- Cannot link directories
- Must be same filesystem
- Survives original deletion
- Indistinguishable from original

## Create symlink to directory

```bash
ln -s /var/www/html ~/www
ln -s ~/Documents/project ~/proj
```

## Force overwrite

```bash
ln -sf /new/target existing-link
```

## Relative symlink

```bash
# Absolute
ln -s /absolute/path/file link

# Relative  
cd /path/to
ln -s ../another/file link
```

## List symlinks

```bash
ls -l | grep '^l'
find . -type l
```

## Check what symlink points to

```bash
ls -l link
readlink link
readlink -f link  # Canonical path
```

## Find broken symlinks

```bash
find .  -xtype l
find . -type l ! -exec test -e {} \; -print
```

## Remove symlink

```bash
rm link
unlink link

# Don't use rm -r on symlink to directory!
```

## Count hard links

```bash
ls -l file  # Number after permissions
stat file | grep Links
```

## Find all hard links to file

```bash
find / -samefile /path/to/file
find / -inum $(stat -c %i file)
```

## Common use cases

### Config files

```bash
# Link config to home
ln -s /etc/nginx/nginx.conf ~/.config/nginx.conf

# Version control config
ln -s ~/dotfiles/.vimrc ~/.vimrc
```

### Executables

```bash
# Make command available
sudo ln -s /opt/app/bin/app /usr/local/bin/app
```

### Web directories

```bash
# Apache/Nginx document root
sudo ln -s /home/user/project /var/www/html/project
```

### Shared libraries

```bash
sudo ln -s /usr/lib/libfoo.so.1.2.3 /usr/lib/libfoo.so.1
```

## Multiple links

```bash
# Create links in target directory
ln -st /target/dir file1 file2 file3
```

## Backup before overwrite

```bash
ln -sb /new/target existing-link
# Creates existing-link~ backup
```

## Interactive mode

```bash
ln -si source target
# Prompts before overwrite
```

## Verbose output

```bash
ln -sv source target
```

## Check if path is symlink

```bash
# In script
if [ -L "$path" ]; then
    echo "Is a symlink"
fi
```

## Update all symlinks in directory

```bash
find . -type l -exec sh -c '
    target=$(readlink "$1")
    new_target=$(echo "$target" | sed "s|old|new|")
    ln -sf "$new_target" "$1"
' _ {} \;
```

## Troubleshooting

### Permission denied

```bash
#  Check  original file permissions
ls -l /path/to/original

# Check parent directory permissions
ls -ld /path/to/
```

### Too many levels of symbolic links

```bash
# Circular symlink
ls -l link
readlink -f link  # Shows error
```

### Cross-device link (trying hard link across filesystems)

```bash
# Use symlink instead
ln -s /mnt/otherdisk/file ~/link
```
