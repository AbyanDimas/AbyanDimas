---
title: "Curl Advanced Techniques"
description: "Advanced curl usage for API testing, debugging, and automation."
date: "2025-11-02"
tags: ["curl", "http", "api"]
category: "Network"
---

## Basic GET request

```bash
curl https://api.example.com/users
```

## Save output to file

```bash
curl -o output.json https://api.example.com/users
curl -O https://example.com/file.zip  # Use remote filename
```

## Follow redirects

```bash
curl -L https://example.com
```

## Show response headers

```bash
curl -I https://example.com
curl --head https://example.com
```

## Include headers in output

```bash
curl -i https://api.example.com/users
```

## Verbose output

```bash
curl -v https://api.example.com
curl --trace - https://api.example.com  # Even more verbose
```

## Silent mode

```bash
curl -s https://api.example.com
```

## POST JSON data

```bash
curl -X POST https://api.example.com/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com"}'
```

## POST from file

```bash
curl -X POST https://api.example.com/users \
  -H "Content-Type: application/json" \
  -d @data.json
```

## POST form data

```bash
curl -X POST https://example.com/login \
  -d "username=john" \
  -d "password=secret"
```

## Upload file

```bash
curl -F "file=@/path/to/file.txt" https://example.com/upload
```

## Custom headers

```bash
curl -H "Authorization: Bearer TOKEN" \
  -H "Accept: application/json" \
  https://api.example.com/protected
```

## Basic authentication

```bash
curl -u username:password https://api.example.com
curl --user username:password https://api.example.com
```

## Bearer token

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" https://api.example.com
```

## PUT request

```bash
curl -X PUT https://api.example.com/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Updated"}'
```

## PATCH request

```bash
curl -X PATCH https://api.example.com/users/1 \
  -H "Content-Type: application/json" \
  -d '{"email":"newemail@example.com"}'
```

## DELETE request

```bash
curl -X DELETE https://api.example.com/users/1
```

## Set user agent

```bash
curl -A "Mozilla/5.0" https://example.com
curl --user-agent "My App/1.0" https://example.com
```

## Set referer

```bash
curl -e "https://google.com" https://example.com
curl --referer "https://google.com" https://example.com
```

## Cookies

```bash
# Save cookies
curl -c cookies.txt https://example.com

# Send cookies
curl -b cookies.txt https://example.com

# Send specific cookie
curl -b "session=abc123" https://example.com
```

## Timeout

```bash
curl --connect-timeout 10 https://example.com
curl --max-time 30 https://example.com
```

## Retry

```bash
curl --retry 5 --retry-delay 2 https://api.example.com
```

## Rate limiting

```bash
curl --limit-rate 100K https://example.com/largefile.zip
```

## Resume download

```bash
curl -C - -O https://example.com/largefile.zip
```

## Multiple URLs

```bash
curl https://example.com/file{1..5}.txt
curl -O https://example.com/file[001-100].jpg
```

## Parallel downloads

```bash
curl -Z https://example.com/file1.zip https://example.com/file2.zip
```

## Only show HTTP status

```bash
curl -s -o /dev/null -w "%{http_code}" https://example.com
```

## Custom output format

```bash
curl -w "HTTP Status: %{http_code}\nTime: %{time_total}s\n" \
  -o /dev/null -s https://example.com
```

## Useful format string variables

```bash
-w "
Status: %{http_code}
Total time: %{time_total}
DNS lookup: %{time_namelookup}
Connect: %{time_connect}
Download size: %{size_download}
Speed: %{speed_download}
"
```

## Test API performance

```bash
curl -w "@curl-format.txt" -o /dev/null -s https://api.example.com
```

curl-format.txt:
```
    time_namelookup:  %{time_namelookup}\n
       time_connect:  %{time_connect}\n
    time_appconnect:  %{time_appconnect}\n
      time_redirect:  %{time_redirect}\n
   time_pretransfer:  %{time_pretransfer}\n
 time_starttransfer:  %{time_starttransfer}\n
                    ----------\n
         time_total:  %{time_total}\n
```

## Skip SSL verification (unsafe!)

```bash
curl -k https://self-signed.example.com
curl --insecure https://self-signed.example.com
```

## Use specific SSL version

```bash
curl --tlsv1.2 https://example.com
```

## Use proxy

```bash
curl -x http://proxy.example.com:8080 https://api.example.com
curl --proxy http://proxy.example.com:8080 https://api.example.com
```

## SOCKS proxy

```bash
curl --socks5 localhost:1080 https://example.com
```

## Resolve hostname

```bash
curl --resolve example.com:443:192.168.1.100 https://example.com
```

## IPv4/IPv6 only

```bash
curl -4 https://example.com  # IPv4
curl -6 https://example.com  # IPv6
```

## FTP upload

```bash
curl -T file.txt ftp://ftp.example.com/upload/ --user username:password
```

## GraphQL query

```bash
curl -X POST https://api.example.com/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ users { id name } }"}'
```

## Pagination

```bash
for i in {1..10}; do
  curl "https://api.example.com/users?page=$i"
done
```

## Save response and headers separately

```bash
curl -D headers.txt -o body.txt https://api.example.com
```

## Test webhooks locally

```bash
# Using ngrok or similar
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{"event":"test"}'
```

## Complete API testing script

```bash
#!/bin/bash

BASE_URL="https://api.example.com"
TOKEN="your-api-token"

# Login
RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"secret"}')

TOKEN=$(echo $RESPONSE | jq -r '.token')

# Get users
curl -s -H "Authorization: Bearer $TOKEN" \
  "$BASE_URL/users" | jq '.'

# Create user
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"New User","email":"new@example.com"}' \
  "$BASE_URL/users" | jq '.'
```

## Config file

Create `~/.curlrc`:
```
-L
--silent
--show-error
--connect-timeout 10
```
