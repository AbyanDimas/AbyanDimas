---
title: "YUM & DNF Package Management"
description: "Manage packages on RHEL/CentOS/Fedora with yum and dnf."
date: "2025-10-23"
tags: ["yum", "dnf", "rhel"]
category: "System"
---

## DNF (Fedora/RHEL 8+)

```bash
# Update package lists
sudo dnf check-update

# Install package
sudo dnf install nginx

# Remove package
sudo dnf remove nginx

# Update all packages
sudo dnf update

# Upgrade (obsoletes old packages)
sudo dnf upgrade

# Search packages
dnf search nginx

# Show package info
dnf info nginx

# List installed
dnf list installed

# List available
dnf list available
```

## YUM (RHEL/CentOS 7)

```bash
# Update packages
sudo yum update

# Install package
sudo yum install nginx

# Remove package
sudo yum remove nginx

# Search packages
yum search nginx

# Show package info
yum info nginx

# List installed
yum list installed

# Check for updates
yum check-update
```

## Group operations

```bash
# List groups
dnf group list

# Install group
sudo dnf group install "Development Tools"

# Remove group
sudo dnf group remove "Development Tools"

# Show group info
dnf group info "Development Tools"
```

## Repositories

```bash
# List repositories
dnf repolist

# List all (including disabled)
dnf repolist all

# Enable repository
sudo dnf config-manager --enable repo-name

# Disable repository
sudo dnf config-manager --disable repo-name

# Add repository
sudo dnf config-manager --add-repo https://example.com/repo.repo
```

## EPEL repository

```bash
# Install EPEL (RHEL/CentOS 8)
sudo dnf install epel-release

# Install EPEL (RHEL/CentOS 7)
sudo yum install epel-release
```

## Clean cache

```bash
sudo dnf clean all
sudo dnf makecache
```

## Download only

```bash
sudo dnf download nginx
```

## Install local RPM

```bash
sudo dnf install ./package.rpm
```

## Show dependencies

```bash
dnf deplist nginx
```

## Find package for file

```bash
dnf provides /usr/sbin/nginx
```

## History

```bash
# Show history
dnf history

# Undo transaction
sudo dnf history undo 5

# Redo transaction
sudo dnf history redo 5
```

## Autoremove unused

```bash
sudo dnf autoremove
```

## Check for problems

```bash
sudo dnf check
```

## RPM commands

```bash
# List installed
rpm -qa

# Install RPM
sudo rpm -ivh package.rpm

# Upgrade RPM
sudo rpm -Uvh package.rpm

# Remove package
sudo rpm -e package

# Query package info
rpm -qi nginx

# List files in package
rpm -ql nginx

# Find package for file
rpm -qf /usr/sbin/nginx

# Verify package
rpm -V nginx
```

## Downgrade package

```bash
sudo dnf downgrade package
```

## Reinstall package

```bash
sudo dnf reinstall nginx
```

## Mark package

```bash
# Install only
sudo dnf mark install nginx

# Remove only
sudo dnf mark remove nginx
```

## Module management

```bash
# List modules
dnf module list

# Enable module
sudo dnf module enable nodejs:14

# Install module
sudo dnf module install nodejs:14

# Reset module
sudo dnf module reset nodejs
```

## Security updates only

```bash
sudo dnf update --security
```

## Exclude package

```bash
sudo dnf update --exclude=kernel*
```

## Yes to all

```bash
sudo dnf install -y nginx
```

## Quiet mode

```bash
sudo dnf install -q nginx
```

## Show duplicates

```bash
dnf list --duplicates
```

## List recent packages

```bash
dnf list --recent
```
