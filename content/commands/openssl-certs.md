---
title: "OpenSSL Certificate Management"
description: "Generate SSL certificates, keys, and troubleshoot TLS connections."
date: "2025-09-14"
tags: ["openssl", "ssl", "security"]
category: "Security"
---

## Generate private key

```bash
openssl genrsa -out private.key 2048
```

## Generate CSR (Certificate Signing Request)

```bash
openssl req -new -key private.key -out request.csr
```

## Generate self-signed certificate

```bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout private.key -out certificate.crt
```

## View certificate details

```bash
openssl x509 -in certificate.crt -text -noout
```

## Check certificate expiration

```bash
openssl x509 -in certificate.crt -noout -dates
```

## Test SSL connection

```bash
openssl s_client -connect example.com:443
```

## Check certificate of remote server

```bash
echo | openssl s_client -connect example.com:443 2>/dev/null | openssl x509 -noout -dates
```

## Verify private key matches certificate

```bash
openssl x509 -noout -modulus -in certificate.crt | openssl md5
openssl rsa -noout -modulus -in private.key | openssl md5
```

## Convert PEM to DER

```bash
openssl x509 -in certificate.pem -outform der -out certificate.der
```

## Convert DER to PEM

```bash
openssl x509 -in certificate.der -inform der -out certificate.pem
```

## Create PKCS12 bundle

```bash
openssl pkcs12 -export -out certificate.pfx \
  -inkey private.key -in certificate.crt
```

## Extract certificate from PKCS12

```bash
openssl pkcs12 -in certificate.pfx -clcerts -nokeys -out certificate.crt
```

## Generate Diffie-Hellman parameters

```bash
openssl dhparam -out dhparam.pem 2048
```

## Verify certificate chain

```bash
openssl verify -CAfile ca-bundle.crt certificate.crt
```
