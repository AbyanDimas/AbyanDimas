---
title: "System Design 101: Scalability Basics"
date: "2025-04-01"
author: "Abyan Dimas"
excerpt: "Vertical vs Horizontal Scaling, Load Balancers, and Caching. The fundamental building blocks of large-scale systems."
coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop"
---

![System Architecture](https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop)

How does Netflix serve millions of users at once? It's not magic; it's system design.

## Vertical vs Horizontal Scaling

*   **Vertical (Scale Up)**: Buy a bigger server with more RAM/CPU. Easiest, but has a limit.
*   **Horizontal (Scale Out)**: Add more servers. Harder to manage, but infinitely scalable.

## The Load Balancer

When you have multiple servers, you need a traffic cop. A Load Balancer (like NGINX or AWS ALB) distributes incoming user requests across your servers to ensure no single server is overwhelmed.

## Caching

Reading from a database is slow. Reading from RAM is fast.

**Redis** is a popular in-memory cache. By storing frequently accessed data (like user profiles) in Redis, you can reduce database load by 90%.

Understanding these components is the first step to becoming a Senior Engineer.
