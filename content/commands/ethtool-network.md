---
title: "Ethtool Network Interface"
description: "Configure and query network interface settings with ethtool."
date: "2025-10-18"
tags: ["ethtool", "networking", "performance"]
category: "Network"
---

## Show interface info

```bash
ethtool eth0
```

## Show driver info

```bash
ethtool -i eth0
```

## Show statistics

```bash
ethtool -S eth0
```

## Show ring buffer settings

```bash
ethtool -g eth0
```

## Set ring buffer size

```bash
sudo ethtool -G eth0 rx 4096 tx 4096
```

## Show link status

```bash
ethtool eth0 | grep "Link detected"
```

## Set speed and duplex

```bash
sudo ethtool -s eth0 speed 1000 duplex full autoneg off
```

## Enable auto-negotiation

```bash
sudo ethtool -s eth0 autoneg on
```

## Show pause parameters

```bash
ethtool -a eth0
```

## Enable flow control

```bash
sudo ethtool -A eth0 rx on tx on
```

## Show offload settings

```bash
ethtool -k eth0
```

## Enable TCP segmentation offload

```bash
sudo ethtool -K eth0 tso on
```

## Disable generic segmentation offload

```bash
sudo ethtool -K eth0 gso off
```

## Enable rx/tx checksumming

```bash
sudo ethtool -K eth0 rx on tx on
```

## Show EEE settings

```bash
ethtool --show-eee eth0
```

## Disable EEE

```bash
sudo ethtool --set-eee eth0 eee off
```

## Identify interface (blink LED)

```bash
sudo ethtool -p eth0 10
```

## Show cable test

```bash
sudo ethtool --cable-test eth0
```

## Reset interface

```bash
sudo ethtool -r eth0
```

## Show Wake-on-LAN

```bash
ethtool eth0 | grep "Wake-on"
```

## Enable Wake-on-LAN

```bash
sudo ethtool -s eth0 wol g
```

## Disable Wake-on-LAN

```bash
sudo ethtool -s eth0 wol d
```

## Show coalesce settings

```bash
ethtool -c eth0
```

## Set interrupt coalescing

```bash
sudo ethtool -C eth0 rx-usecs 50 tx-usecs 50
```

## Show channel settings

```bash
ethtool -l eth0
```

## Set channel count

```bash
sudo ethtool -L eth0 combined 4
```

## Show private flags

```bash
ethtool --show-priv-flags eth0
```

## Set private flag

```bash
sudo ethtool --set-priv-flags eth0 flag-name on
```

## Show firmware version

```bash
ethtool -i eth0 | grep firmware
```

## Test interface

```bash
sudo ethtool -t eth0
```

## Offline test

```bash
sudo ethtool -t eth0 offline
```

## Show PHY statistics

```bash
ethtool --phy-statistics eth0
```

## Common speed settings

```bash
# 100 Mbps full duplex
sudo ethtool -s eth0 speed 100 duplex full

# 1 Gbps full duplex
sudo ethtool -s eth0 speed 1000 duplex full

# 10 Gbps
sudo ethtool -s eth0 speed 10000 duplex full

# Auto
sudo ethtool -s eth0 autoneg on
```

## Persistent settings (systemd)

Create `/etc/systemd/network/10-eth0.link`:

```ini
[Match]
MACAddress=00:11:22:33:44:55

[Link]
WakeOnLan=magic
```

## Persistent settings (NetworkManager)

```bash
sudo nmcli connection modify eth0 ethtool.feature-gso off
sudo nmcli connection modify eth0 ethtool.feature-tso off
```

## Check for errors

```bash
ethtool -S eth0 | grep -i error
```

## Check for drops

```bash
ethtool -S eth0 | grep -i drop
```

## Troubleshooting no link

```bash
# Check link
ethtool eth0 | grep "Link detected"

# Check cable
sudo ethtool --cable-test eth0

# Try renegotiate
sudo ethtool -r eth0

# Check driver
ethtool -i eth0
```

## Performance tuning

```bash
# Increase ring buffers
sudo ethtool -G eth0 rx 4096 tx 4096

# Enable offloads
sudo ethtool -K eth0 tso on gso on sg on

# Adjust interrupt coalescing
sudo ethtool -C eth0 rx-usecs 50

# Increase channels
sudo ethtool -L eth0 combined 4
```

## Common offload features

```
rx-checksumming     # RX checksum offload
tx-checksumming     # TX checksum offload
scatter-gather      # Scatter-gather I/O
tcp-segmentation-offload  # TCP segmentation
generic-segmentation-offload  # Generic segmentation
generic-receive-offload  # Generic receive
large-receive-offload  # Large receive
```
