---
title: "Modern Linux Networking: Deprecating ifconfig for ip command"
date: "2025-07-07"
author: "Abyan Dimas"
excerpt: "The `net-tools` package is obsolete. Learn the `iproute2` suite (`ip`, `ss`) for modern network management."
coverImage: "https://images.unsplash.com/photo-1551703599-6b3e8379aa8c?q=80&w=1200&auto=format&fit=crop"
---

![Network Cables](https://images.unsplash.com/photo-1551703599-6b3e8379aa8c?q=80&w=1200&auto=format&fit=crop)

If you are typing `ifconfig` or `netstat`, you are living in the past (specifically, pre-2011). The Linux kernel has moved on to the netlink interface, and `iproute2` is the standard approach.

## 1. Interface Management

*   **Old**: `ifconfig -a`
*   **New**: `ip addr` (or `ip a`)

To manage interfaces:
```bash
ip link set eth0 up
ip addr add 192.168.1.100/24 dev eth0
```

## 2. Routing Tables

*   **Old**: `route -n`
*   **New**: `ip route` (or `ip r`)

Understanding the route table is crucial.
`default via 192.168.1.1 dev eth0` means "If I don't know where to send this packet, send it to the router at 192.168.1.1".

## 3. Socket Statistics

*   **Old**: `netstat -tulpn`
*   **New**: `ss -tulpn`

`ss` is vastly faster because it queries the kernel directly instead of parsing `/proc` files.
*   `-t`: TCP
*   `-u`: UDP
*   `-l`: Listening ports
*   `-p`: Show process name (requires sudo)
*   `-n`: Numeric ports (don't resolve DNS)

## 4. Network Namespaces

This is the technology behind Docker containers. `ip` lets you manage them directly.

```bash
# Create a namespace
ip netns add blue

# Run command inside namespace
ip netns exec blue ip a
```

The "blue" namespace has its own isolated network interfaces and routes. This is the foundation of container isolation.
