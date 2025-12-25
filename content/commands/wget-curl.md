---
title: "Wget & Curl Download Tools"
description: "Download files, test APIs, and make HTTP requests with wget and curl."
date: "2025-09-17"
tags: ["wget", "curl", "networking"]
category: "Network"
---

## Download file with wget

```bash
wget https://example.com/file.zip
```

## Download with custom filename

```bash
wget -O custom_name.zip https://example.com/file.zip
```

## Resume interrupted download

```bash
wget -c https://example.com/large_file.zip
```

## Download in background

```bash
wget -b https://example.com/file.zip
```

## Limit download speed (500KB/s)

```bash
wget --limit-rate=500k https://example.com/file.zip
```

## Download entire website

```bash
wget --mirror --convert-links --page-requisites https://example.com
```

## Download with authentication

```bash
wget --user=username --password=password https://example.com/file.zip
```

## Basic curl GET request

```bash
curl https://api.example.com/users
```

## Save output to file

```bash
curl -o output.json https://api.example.com/users
```

## Follow redirects

```bash
curl -L https://example.com
```

## Show response headers

```bash
curl -I https://example.com
```

## POST request with JSON

```bash
curl -X POST https://api.example.com/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com"}'
```

## Upload file

```bash
curl -F "file=@/path/to/file.txt" https://example.com/upload
```

## Basic authentication

```bash
curl -u username:password https://api.example.com/protected
```

## Bearer token authentication

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" https://api.example.com/data
```

## Download with progress bar

```bash
curl -# -O https://example.com/file.zip
```

## Multiple simultaneous downloads (wget)

```bash
wget -i urls.txt
```

## Test API endpoint speed

```bash
curl -w "@-" -o /dev/null -s https://api.example.com/endpoint <<'EOF'
    time_namelookup:  %{time_namelookup}\n
       time_connect:  %{time_connect}\n
          time_total:  %{time_total}\n
EOF
```
