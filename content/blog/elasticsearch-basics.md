---
title: "Elasticsearch: More Than Just Search"
date: "2025-06-26"
author: "Abyan Dimas"
excerpt: "Inverted indexes, fuzzy matching, and log analytics with the ELK Stack."
coverImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop"
---

![Search](https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop)

How does Google search work? How does Amazon find products so fast? They use **Inverted Indexes**.

## The Inverted Index

Instead of mapping `Document -> Words`, it maps `Word -> Documents`.

*   "Apple" -> [Doc 1, Doc 3]
*   "Banana" -> [Doc 2]

This makes full-text search O(1).

## Elasticsearch Features

1.  **Fuzzy Search**: Finds "iPhone" even if you type "ipone".
2.  **Aggregations**: "Count products by category" (faster than SQL GROUP BY).
3.  **Scalability**: Distributed by nature. Splits indexes into shards across nodes.

## The ELK Stack

Elasticsearch + Logstash + Kibana. The industry standard for searching and visualizing server logs.
