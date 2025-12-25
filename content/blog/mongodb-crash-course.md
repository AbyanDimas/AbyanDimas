---
title: "MongoDB Crash Course for SQL Developers"
date: "2025-06-14"
author: "Abyan Dimas"
excerpt: "Thinking in Documents. Aggregation Pipelines, Indexes, and why 'Schemaless' doesn't mean structureless."
coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop"
---

![MongoDB](https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop)

In SQL, you normalize data into separate tables. In MongoDB, you **embed** data.

## Embedding vs Referencing

**SQL (Reference):**
`Users` table and `Addresses` table. Join them when querying.

**MongoDB (Embed):**
```json
{
  "_id": 1,
  "name": "Abyan",
  "address": {
    "street": "123 Main St",
    "city": "Jakarta"
  }
}
```

Store data together that is accessed together. This makes reads incredibly fast (no joins needed).

## The Aggregation Pipeline

Mongo's powerful alternative to complex SQL queries.

```javascript
db.orders.aggregate([
  { $match: { status: "A" } },
  { $group: { _id: "$cust_id", total: { $sum: "$amount" } } }
])
```

It's like a Unix pipe for your data. Filter -> Group -> Sort -> Project.
