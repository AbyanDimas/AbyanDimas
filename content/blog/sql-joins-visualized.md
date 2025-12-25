---
title: "SQL Joins Visualized: Inner, Left, Right, and Full"
date: "2025-06-28"
author: "Abyan Dimas"
excerpt: "Never get confused by JOINs again. A visual guide to combining tables."
coverImage: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=1200&auto=format&fit=crop"
---

![Venn Diagram](https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=1200&auto=format&fit=crop)

Joins are the heart of SQL. They let you combine data from multiple tables.

## 1. INNER JOIN (Intersection)

Returns records that have matching values in **both** tables.
*   "Show me users who have placed an order."

```sql
SELECT * FROM users
INNER JOIN orders ON users.id = orders.user_id;
```

## 2. LEFT JOIN (Preserve Left)

Returns **all** records from the left table, and the matched records from the right table.
*   "Show me all users, and their orders if they have any."

```sql
SELECT * FROM users
LEFT JOIN orders ON users.id = orders.user_id;
```

(Users with no orders will have NULL in order columns).

## 3. RIGHT JOIN (Preserve Right)

Opposite of Left Join. Rarely used.

## 4. FULL OUTER JOIN (Union)

Returns all records when there is a match in **either** left or right table.
*   "Show me all users and all orders, acting as one big list."

Mastering JOINs is step one to mastering SQL.
