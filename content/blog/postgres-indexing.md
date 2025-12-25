---
title: "Database Performance: Indexing Strategies in PostgreSQL"
date: "2025-05-25"
author: "Abyan Dimas"
excerpt: "Why is your query slow? B-Trees, Hash indexes, and analyzing query plans with EXPLAIN ANALYZE."
coverImage: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=1200&auto=format&fit=crop"
---

![Database Server](https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=1200&auto=format&fit=crop)

Your app is fast in development with 10 users. In production with 100,000 users, it crawls. The culprit is usually missing indexes.

## The Library Analogy

Imagine a library with 1 million books.
*   **Without Index**: To find "Harry Potter", you check every single book on every shelf. (Full Table Scan).
*   **With Index**: You go to the catalog card, find "H", then "Harry Potter", and get the exact shelf number. (Index Scan).

## Creating an Index

```sql
CREATE INDEX idx_users_email ON users(email);
```

Now, searching by email is O(log n) instead of O(n).

## Composite Indexes

If you often query by *two* columns:

```sql
SELECT * FROM users WHERE last_name = 'Doe' AND first_name = 'John';
```

You need a multi-column index:

```sql
CREATE INDEX idx_users_names ON users(last_name, first_name);
```

*Order matters!* This index helps search by `last_name` alone, but NOT by `first_name` alone.

## EXPLAIN ANALYZE

Don't guess. Ask Postgres.

```sql
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';
```

It will tell you exactly how it planned to execute the query and how long it took.
