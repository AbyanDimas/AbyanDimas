---
title: "Dig DNS Debugging"
description: "Query DNS servers and troubleshoot DNS issues with dig."
date: "2025-10-15"
tags: ["dig", "dns", "networking"]
category: "Network"
---

## Basic DNS query

```bash
dig example.com
```

## Query A record

```bash
dig example.com A
```

## Query MX record

```bash
dig example.com MX
```

## Query NS record

```bash
dig example.com NS
```

## Query TXT record

```bash
dig example.com TXT
```

## Query AAAA record (IPv6)

```bash
dig example.com AAAA
```

## Query CNAME record

```bash
dig www.example.com CNAME
```

## Query SOA record

```bash
dig example.com SOA
```

## Query ANY record

```bash
dig example.com ANY
```

## Short answer only

```bash
dig example.com +short
```

## Use specific DNS server

```bash
dig @8.8.8.8 example.com
```

## Use specific DNS server (Cloudflare)

```bash
dig @1.1.1.1 example.com
```

## Reverse DNS lookup

```bash
dig -x 8.8.8.8
```

## Trace DNS path

```bash
dig example.com +trace
```

## No recursion

```bash
dig example.com +norecurse
```

## Show query time

```bash
dig example.com +stats
```

## TCP instead of UDP

```bash
dig example.com +tcp
```

## Query on specific port

```bash
dig @dns-server -p 5353 example.com
```

## Multiple queries

```bash
dig example.com A example.com MX
```

## Batch queries from file

```bash
dig -f domains.txt
```

## Set timeout

```bash
dig example.com +time=5
```

## Set retry attempts

```bash
dig example.com +tries=3
```

## Show all sections

```bash
dig example.com +all
```

## Show only answer section

```bash
dig example.com +noall +answer
```

## Show question and answer

```bash
dig example.com +noall +question +answer
```

## Disable comments

```bash
dig example.com +nocomments
```

## Disable statistics

```bash
dig example.com +nostats
```

## Clean output

```bash
dig example.com +noall +answer +short
```

## Check DNSSEC

```bash
dig example.com +dnssec
```

## DNSSEC validation

```bash
dig example.com +dnssec +multi
```

## Query root servers

```bash
dig . NS
```

## Query specific domain at root

```bash
dig @a.root-servers.net com NS
```

## Subnet client (EDNS)

```bash
dig example.com +subnet=1.2.3.4/24
```

## Buffer size

```bash
dig example.com +bufsize=4096
```

## IPv4 only

```bash
dig -4 example.com
```

## IPv6 only

```bash
dig -6 example.com
```

## Compare with different DNS

```bash
# Google DNS
dig @8.8.8.8 example.com +short

# Cloudflare
dig @1.1.1.1 example.com +short

# Quad9
dig @9.9.9.9 example.com +short
```

## Check propagation

```bash
for ns in $(dig example.com NS +short); do
    echo "Checking $ns"
    dig @$ns example.com A +short
done
```

## Test zone transfer (AXFR)

```bash
dig @ns1.example.com example.com AXFR
```

## Query CAA record

```bash
dig example.com CAA
```

## Query SRV record

```bash
dig _service._proto.example.com SRV
```

## Measure query time

```bash
time dig example.com
```

## Continuous monitoring

```bash
watch -n 5 'dig example.com +short'
```

## Common public DNS servers

```
8.8.8.8         # Google
8.8.4.4         # Google
1.1.1.1         # Cloudflare
1.0.0.1         # Cloudflare
9.9.9.9         # Quad9
208.67.222.222  # OpenDNS
208.67.220.220  # OpenDNS
```
