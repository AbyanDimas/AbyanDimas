---
title: "APT Package Management"
description: "Manage packages on Debian/Ubuntu systems with apt and dpkg."
date: "2025-10-22"
tags: ["apt", "dpkg", "ubuntu"]
category: "System"
---

## Update package lists

```bash
sudo apt update
```

## Upgrade packages

```bash
sudo apt upgrade
```

## Full upgrade (with removals)

```bash
sudo apt full-upgrade
```

## Install package

```bash
sudo apt install nginx
```

## Install specific version

```bash
sudo apt install nginx=1.18.0-0ubuntu1
```

## Install without recommends

```bash
sudo apt install --no-install-recommends package
```

## Remove package

```bash
sudo apt remove nginx
```

## Remove package and config

```bash
sudo apt purge nginx
```

## Autoremove unused dependencies

```bash
sudo apt autoremove
```

## Search packages

```bash
apt search nginx
```

## Show package info

```bash
apt show nginx
```

## List installed packages

```bash
apt list --installed
```

## List upgradable packages

```bash
apt list --upgradable
```

## Check dependencies

```bash
apt depends nginx
```

## Check reverse dependencies

```bash
apt rdepends nginx
```

## Download package only

```bash
sudo apt download nginx
```

## Install downloaded .deb

```bash
sudo apt install ./package.deb
```

## Fix broken dependencies

```bash
sudo apt --fix-broken install
```

## Clean package cache

```bash
sudo apt clean
```

## Remove old packages from cache

```bash
sudo apt autoclean
```

## Hold package version

```bash
sudo apt-mark hold nginx
```

## Unhold package

```bash
sudo apt-mark unhold nginx
```

## Show held packages

```bash
apt-mark showhold
```

## Add repository

```bash
sudo add-apt-repository ppa:user/repo
```

## Remove repository

```bash
sudo add-apt-repository --remove ppa:user/repo
```

## List repositories

```bash
ls /etc/apt/sources.list.d/
```

## DPKG - List installed

```bash
dpkg -l
```

## DPKG - Install package

```bash
sudo dpkg -i package.deb
```

## DPKG - Remove package

```bash
sudo dpkg -r package
```

## DPKG - Purge package

```bash
sudo dpkg -P package
```

## DPKG - List files in package

```bash
dpkg -L nginx
```

## DPKG - Find package for file

```bash
dpkg -S /usr/bin/nginx
```

## DPKG - Package status

```bash
dpkg -s nginx
```

## DPKG - Reconfigure package

```bash
sudo dpkg-reconfigure tzdata
```

## Check installed version

```bash
apt policy nginx
```

## Simulate install

```bash
apt install -s nginx
```

## Quiet mode

```bash
sudo apt install -qq nginx
```

## Yes to all prompts

```bash
sudo apt install -y nginx
```

## Show package changelog

```bash
apt changelog nginx
```

## Verify package integrity

```bash
debsums nginx
```

## Aptitude (alternative)

```bash
sudo aptitude update
sudo aptitude install package
sudo aptitude search package
```
