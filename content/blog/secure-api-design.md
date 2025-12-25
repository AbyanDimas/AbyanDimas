---
title: "Secure API Design Principles"
date: "2025-03-20"
author: "Abyan Dimas"
excerpt: "Don't leak data. Authentication, Rate Limiting, and Input Validation for safer REST APIs."
coverImage: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=1200&auto=format&fit=crop"
---

![Cyber Security](https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=1200&auto=format&fit=crop)

Building an API is easy. Building a *secure* API requires discipline.

## 1. Always Use HTTPS

There is no excuse for HTTP in production. Use TLS/SSL to encrypt data in transit.

## 2. Rate Limiting

Prevent abuse (and huge server bills) by limiting how many requests a user can make.

```javascript
// Example: limit each IP to 100 requests per windowMs
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
});
```

## 3. Input Validation

Never trust the client. If your API expects an email, check that it *is* an email. If it expects a number, ensure it's not a SQL injection string.

Libraries like **Zod** or **Joi** are excellent for this.

## 4. Proper Authentication

Don't roll your own crypto. Use standards like **OAuth2** or **JWT** (JSON Web Tokens). Ensure tokens have expiration times.

Security is not a feature; it's a foundation.
