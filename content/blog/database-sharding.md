---
title: "Database Sharding: Scaling Beyond One Server"
date: "2025-06-18"
author: "Abyan Dimas"
excerpt: "What happens when your table is too big for one hard drive? Horizontal partitioning explained."
coverImage: "https://images.unsplash.com/photo-1558494949-ef526b0042a0?q=80&w=1200&auto=format&fit=crop"
---

![Server Rack](https://images.unsplash.com/photo-1558494949-ef526b0042a0?q=80&w=1200&auto=format&fit=crop)

You have 10 Terabytes of user data. A single Postgres server is choking. It's time to **Shard**.

## What is Sharding?

Splitting a large dataset across multiple database instances (shards). Each shard holds a subset of the data.

## Sharding Keys

How do you decide which data goes where? You pick a "Shard Key".

### 1. Range Based
*   Shard A: User IDs 1-1,000,000
*   Shard B: User IDs 1,000,001-2,000,000
*   *Problem*: If all new users are active, Shard B gets all the traffic (Hotspot).

### 2. Hash Based
*   Shard Key = `User ID % 2`
*   Shard A: Even IDs
*   Shard B: Odd IDs
*   *Benefit*: Even distribution of load.

## The Cost of Sharding

Sharding adds massive complexity.
*   **Joins**: You can't join tables across different servers.
*   **Transactions**: Distributed transactions are slow and hard (Two-Phase Commit).

Don't shard until you absolutely have to.
