---
title: "User & Group Management"
description: "Create, modify, and delete users and groups in Linux."
date: "2025-09-16"
tags: ["users", "groups", "linux"]
category: "System"
---

## Create new user

```bash
sudo useradd username
```

## Create user with home directory

```bash
sudo useradd -m username
```

## Create user with specific shell

```bash
sudo useradd -m -s /bin/bash username
```

## Set user password

```bash
sudo passwd username
```

## Delete user

```bash
sudo userdel username
```

## Delete user and home directory

```bash
sudo userdel -r username
```

## Modify user

Add user to sudo group:

```bash
sudo usermod -aG sudo username
```

## Add user to multiple groups

```bash
sudo usermod -aG group1,group2 username
```

## Change user's home directory

```bash
sudo usermod -d /new/home/path username
```

## Change user's shell

```bash
sudo usermod -s /bin/zsh username
```

## Lock user account

```bash
sudo usermod -L username
```

## Unlock user account

```bash
sudo usermod -U username
```

## Create new group

```bash
sudo groupadd mygroup
```

## Delete group

```bash
sudo groupdel mygroup
```

## View user's groups

```bash
groups username
```

## View current user's groups

```bash
groups
```

## List all users

```bash
cat /etc/passwd
```

## List all groups

```bash
cat /etc/group
```

## View user information

```bash
id username
```

## Switch to another user

```bash
su - username
```

## Run command as another user

```bash
sudo -u username command
```
