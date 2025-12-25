---
title: "Network Troubleshooting Workflow"
description: "Systematic approach to debugging network connectivity issues."
date: "2025-11-07"
tags: ["networking", "troubleshooting", "debugging"]
category: "Network"
---

## Layer 1: Physical

```bash
# Check link status
ip link show
ethtool eth0 | grep "Link detected"

# Check cable
ethtool --cable-test eth0

# View interface statistics
ip -s link show eth0
```

## Layer 2: Data Link

```bash
# Check MAC address
ip link show eth0 | grep link/ether

# ARP table
ip neigh show
arp -a

# Clear ARP cache
sudo ip neigh flush all
```

## Layer 3: Network

```bash
# Check IP address
ip addr show
ifconfig

# Check routing
ip route show
route -n

# Ping gateway
ping -c 4 $(ip route | grep default | awk '{print $3}')

# Ping external
ping -c 4 8.8.8.8
```

## Layer 4: Transport

```bash
# Check listening ports
ss -tuln
netstat -tuln

# Check established connections
ss -tup
netstat -tup

# Check specific port
ss -tuln | grep :80
```

## Layer 7: Application

```bash
# Test HTTP
curl -I https://example.com

# Test DNS
dig example.com
nslookup example.com

# Test specific service
telnet example.com 80
nc -zv example.com 80
```

## Systematic troubleshooting

### Step 1: Verify physical connection

```bash
# Is interface up?
ip link show eth0

# Bring up interface
sudo ip link set eth0 up

# Check for errors
ip -s link show eth0 | grep -i error
```

### Step 2: Check IP configuration

```bash
# Do we have an IP?
ip addr show eth0

# DHCP renewal
sudo dhclient -r eth0
sudo dhclient eth0

# Static IP (temporary)
sudo ip addr add 192.168.1.100/24 dev eth0
sudo ip route add default via 192.168.1.1
```

### Step 3: Test gateway connection

```bash
# Find gateway
ip route | grep default

# Ping gateway
ping -c 4 192.168.1.1

# Trace to gateway
traceroute -m 1 192.168.1.1
```

### Step 4: Test DNS

```bash
# Check DNS servers
cat /etc/resolv.conf

# Test DNS resolution
dig google.com @8.8.8.8

# Compare different DNS
dig google.com @8.8.8.8
dig google.com @1.1.1.1

# Flush DNS cache (systemd-resolved)
sudo systemd-resolve --flush-caches
```

### Step 5: Test external connectivity

```bash
# Ping external IP (bypasses DNS)
ping -c 4 8.8.8.8

# Ping domain (tests DNS too)
ping -c 4 google.com

# Trace route
traceroute google.com
mtr google.com
```

## Common issues and fixes

### No network interface

```bash
# List all interfaces
ip link show

# Check kernel modules
lsmod | grep -i network

# Reload network manager
sudo systemctl restart NetworkManager
```

### Can't ping gateway

```bash
# Check cable
ethtool eth0 | grep "Link detected"

# Check routing
ip route show

# Add default route
sudo ip route add default via 192.168.1.1 dev eth0

# Check firewall
sudo iptables -L
sudo ufw status
```

### DNS not resolving

```bash
# Check resolv.conf
cat /etc/resolv.conf

# Test with different DNS
dig google.com @8.8.8.8

# Set DNS temporarily
echo "nameserver 8.8.8.8" | sudo tee /etc/resolv.conf

# Systemd-resolved
sudo systemctl restart systemd-resolved
```

### Slow network

```bash
# Check bandwidth
iperf3 -c server-ip

# Check MTU
ping -M do -s 1472 google.com

# Check for packet loss
ping -c 100 google.com | grep loss

# Check latency
ping -c 10 google.com | tail -1
```

## Network diagnostic commands

```bash
# Full diagnosis
ip addr          # IP addresses
ip route         # Routing table
ip neigh         # ARP cache
ss -tuln         # Listening ports
ss -tup          # Established connections
ping 8.8.8.8     # External connectivity
dig google.com   # DNS resolution
```

## Capture traffic

```bash
# Capture on interface
sudo tcpdump -i eth0

# Capture specific port
sudo tcpdump -i eth0 port 80

# Save to file
sudo tcpdump -i eth0 -w capture.pcap

# Read pcap
tcpdump -r capture.pcap
```

## Monitor bandwidth

```bash
# iftop
sudo iftop -i eth0

# nethogs (by process)
sudo nethogs eth0

# vnstat (statistics)
vnstat -l -i eth0
```

## Firewall issues

```bash
# Check iptables
sudo iptables -L -v -n

# Check ufw
sudo ufw status verbose

# Check firewalld
sudo firewall-cmd --list-all

# Temporarily disable
sudo ufw disable
sudo systemctl stop firewalld
```

## WiFi specific

```bash
# Scan networks
sudo iwlist wlan0 scan

# Connect to network
sudo iwconfig wlan0 essid "NetworkName"

# Check signal strength
iwconfig wlan0 | grep Signal

# WiFi info
nmcli dev wifi list
```

## Complete troubleshooting script

```bash
#!/bin/bash

echo "=== Network Troubleshooting ==="
echo ""

echo "1. Interface Status:"
ip link show | grep "state UP"
echo ""

echo "2. IP Addresses:"
ip addr show | grep "inet "
echo ""

echo "3. Default Gateway:"
ip route | grep default
echo ""

echo "4. DNS Servers:"
cat /etc/resolv.conf | grep nameserver
echo ""

echo "5. Ping Gateway:"
GATEWAY=$(ip route | grep default | awk '{print $3}')
ping -c 2 $GATEWAY
echo ""

echo "6. Ping External:"
ping -c 2 8.8.8.8
echo ""

echo "7. DNS Resolution:"
dig google.com +short
echo ""

echo "8. Open Ports:"
ss -tuln | head -5
```

## Performance testing

```bash
# Download speed
wget -O /dev/null http://speedtest.tele2.net/100MB.zip

# Upload speed (requires iperf server)
iperf3 -c iperf.example.com

# Latency test
ping -c 100 8.8.8.8 | grep rtt
```

## Check MTU path

```bash
# Find optimal MTU
ping -M do -s 1472 google.com  # 1500 - 28 = 1472

# If fails, try lower
ping -M do -s 1400 google.com

# Set MTU
sudo ip link set dev eth0 mtu 1400
```

## Routing troubleshooting

```bash
# Show routing table
ip route show
route -n

# Trace route with hops
traceroute -n google.com

# MTR (better traceroute)
mtr --report google.com

# Add static route
sudo ip route add 10.0.0.0/24 via 192.168.1.1
```

## Reset network

```bash
# Restart NetworkManager
sudo systemctl restart NetworkManager

# Restart networking (Debian)
sudo systemctl restart networking

# Flush routes and restart
sudo ip addr flush dev eth0
sudo systemctl restart networking
```
