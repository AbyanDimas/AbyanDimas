---
title: "System Information Commands"
description: "Get detailed hardware and system information with dmidecode, lshw, and more."
date: "2025-11-16"
tags: ["system-info", "hardware", "dmidecode"]
category: "System"
---

## DMIDECODE - BIOS/Hardware info

```bash
# Full system info (requires root)
sudo dmidecode

# BIOS information
sudo dmidecode -t bios

# System information
sudo dmidecode -t system

# Processor information
sudo dmidecode -t processor

# Memory information
sudo dmidecode -t memory

# All types
sudo dmidecode -t 0,1,2,3,4
```

### Common queries

```bash
# Serial number
sudo dmidecode -s system-serial-number

# Manufacturer
sudo dmidecode -s system-manufacturer

# Product name
sudo dmidecode -s system-product-name

# BIOS version
sudo dmidecode -s bios-version
```

## LSHW - Hardware lister

```bash
# Full hardware tree
sudo lshw

# Short format
sudo lshw -short

# Specific class
sudo lshw -C network
sudo lshw -C disk
sudo lshw -C memory
sudo lshw -C processor

# HTML output
sudo lshw -html > hardware.html

# XML output
sudo lshw -xml
```

## LSCPU - CPU information

```bash
# CPU details
lscpu

# Parse specific fields
lscpu | grep "Model name"
lscpu | grep "CPU(s)"
lscpu | grep "Thread(s) per core"
```

## LSPCI - PCI devices

```bash
# List all PCI devices
lspci

# Verbose
lspci -v
lspci -vv  # Very verbose

# Show kernel drivers
lspci -k

# Specific device
lspci -s 00:1f.2 -v

# Network cards
lspci | grep -i network

# Graphics cards
lspci | grep -i vga
```

## LSUSB - USB devices

```bash
# List USB devices
lsusb

# Verbose
lsusb -v

# Tree view
lsusb -t

# Specific device
lsusb -d 046d:c52b
```

## LSBLK - Block devices

```bash
# List block devices
lsblk

# Show filesystem
lsblk -f

# Show size in bytes
lsblk -b

# Specific device
lsblk /dev/sda
```

## INXI - System info

```bash
# Install
sudo apt install inxi

# Full system info
inxi -F

# CPU info
inxi -C

# Graphics
inxi -G

# Network
inxi -N

# Drives
inxi -D

# Audio
inxi -A
```

## HWINFO - Comprehensive hardware

```bash
# Install
sudo apt install hwinfo

# Full probe
sudo hwinfo

# Specific component
sudo hwinfo --cpu
sudo hwinfo --network
sudo hwinfo --disk
sudo hwinfo --memory

# Short summary
sudo hwinfo --short
```

## /proc filesystem

```bash
# CPU info
cat /proc/cpuinfo

# Memory info
cat /proc/meminfo

# Version
cat /proc/version

# Uptime
cat /proc/uptime

# Mounts
cat /proc/mounts

# Partitions
cat /proc/partitions
```

## Kernel information

```bash
# Kernel version
uname -r

# All system info
uname -a

# Kernel name
uname -s

# Machine hardware
uname -m

# Processor type
uname -p
```

## OS information

```bash
# OS release
cat /etc/os-release

# LSB info
lsb_release -a

# Hostname
hostname
hostnamectl

# Distribution
cat /etc/issue
```

## Disk information

```bash
# Disk usage
df -h

# Disk space by directory
du -sh /*

# SMART status
sudo smartctl -a /dev/sda

# Partition table
sudo fdisk -l
sudo parted -l
```

## Memory slots

```bash
# Memory modules
sudo dmidecode -t memory | grep -i size

# Memory speed
sudo dmidecode -t memory | grep -i speed

# Slots used
sudo dmidecode -t memory | grep -i "Number Of Devices"
```

## Network interfaces

```bash
# All interfaces
ip addr show

# Specific interface
ip addr show eth0

# Link status
ip link show

# Hardware info
ethtool eth0
```

## PCI IDs lookup

```bash
# Update PCI ID database
sudo update-pciids

# Lookup vendor/device
lspci -nn | grep "8086:1539"
```

## Complete system report

```bash
#!/bin/bash

echo "=== System Information Report ==="
echo ""

echo "Hostname: $(hostname)"
echo "OS: $(cat /etc/os-release | grep PRETTY_NAME | cut -d'"' -f2)"
echo "Kernel: $(uname -r)"
echo "Uptime: $(uptime -p)"

echo -e "\n=== CPU ==="
lscpu | grep "Model name\|CPU(s)\|Thread(s)"

echo -e "\n=== Memory ==="
free -h | grep Mem

echo -e "\n=== Disk ==="
lsblk -o NAME,SIZE,TYPE,MOUNTPOINT

echo -e "\n=== Network ==="
 ip -br addr

echo -e "\n=== Graphics ==="
lspci | grep -i vga
```

## Hardware monitoring

```bash
# Temperature sensors
sensors

# Fan speeds
sensors | grep fan

# CPU temperature
cat /sys/class/thermal/thermal_zone*/temp
```

## Battery information (laptops)

```bash
# Battery status
upower -i /org/freedesktop/UPower/devices/battery_BAT0

# AC adapter
upower -i /org/freedesktop/UPower/devices/line_power_AC

# Simple check
cat /sys/class/power_supply/BAT0/capacity
```

## Performance info

```bash
# CPU frequency
cat /proc/cpuinfo | grep MHz

# Load average
uptime
cat /proc/loadavg

# Running processes
ps aux | wc -l
```
