---
title: "Redis Caching Strategies: Boost Your App Performance"
date: "2025-06-16"
author: "Abyan Dimas"
excerpt: "Cache-Aside, Write-Through, and TTLs. How to use Redis effectively to offload your primary database."
coverImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop"
---

![Fast Speed](https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop)

The fastest database query is the one you never make. Redis is an in-memory store that serves data in microseconds.

## Strategy 1: Cache-Aside (Lazy Loading)

This is the most common pattern.

1.  App checks Redis.
2.  **Miss**: App queries DB, saves to Redis, returns to user.
3.  **Hit**: App returns data from Redis immediately.

```javascript
const cached = await redis.get('user:123');
if (cached) return JSON.parse(cached);

const user = await db.findUser(123);
await redis.set('user:123', JSON.stringify(user), 'EX', 3600); // 1 hour TTL
return user;
```

## Strategy 2: Write-Through

Update the DB and Cache at the same time. Ensures consistency but adds write latency.

## Eviction Policies

What happens when Redis is full?
*   **LRU (Least Recently Used)**: Deletes items that haven't been asked for in a while.
*   **TTL (Time To Live)**: Auto-delete items after X seconds.

Use Redis wisely, and your users will feel the speed.
