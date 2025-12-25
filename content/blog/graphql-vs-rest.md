---
title: "GraphQL vs REST: A Comprehensive Comparison"
date: "2025-04-25"
author: "Abyan Dimas"
excerpt: "Over-fetching, under-fetching, and type safety. Why modern frontends are moving to GraphQL and where REST still shines."
coverImage: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=1200&auto=format&fit=crop"
---

![API Structure](https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=1200&auto=format&fit=crop)

For decades, REST (Representational State Transfer) was the standard for APIs. Then Facebook released GraphQL, shifting the paradigm from resource-based to query-based fetching.

## The Problem with REST

Imagine you want to show a user profile with their 3 recent posts.

**REST Approach:**
1.  `GET /users/123` -> Returns ALL user data (name, email, address, etc.). **(Over-fetching)**
2.  `GET /users/123/posts` -> Returns ALL posts.
3.  Client filters the top 3.

You wasted bandwidth downloading unused fields.

## The GraphQL Solution

With GraphQL, the client asks for exactly what it needs.

```graphql
query {
  user(id: "123") {
    name
    email
    posts(limit: 3) {
      title
      excerpt
    }
  }
}
```

**Single Request.** Exact Data.

## Key Differences

| Feature | REST | GraphQL |
| :--- | :--- | :--- |
| **Endpoint** | Multiple (`/users`, `/posts`) | Single (`/graphql`) |
| **Data Fetching** | Fixed structure | Client-defined |
| **Versioning** | v1, v2 (URL based) | Deprecation of fields |
| **Caching** | Easy (HTTP Caching) | Harder (Needs Apollo/Relay) |
| **Type Safety** | Loose (JSON) | Strong (Schema Definition) |

## When to use what?

**Use GraphQL if:**
*   You have complex, nested data requirements (e.g., social networks, dashboards).
*   You have multiple clients (Mobile, Web, Watch) needing different data shapes.
*   You want strong typing between frontend and backend.

**Use REST if:**
*   You want simple, cacheable resources.
*   You are building a public API for 3rd party developers (REST is universally understood).
*   Your data model is flat and simple.

It's not a war. It's about choosing the right tool for the job.
