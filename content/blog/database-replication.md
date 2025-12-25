---
title: "Database Replication: Master-Slave vs Multi-Master"
date: "2025-06-20"
author: "Abyan Dimas"
excerpt: "High availability and read scaling. How to ensure your database survives a server failure."
coverImage: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?q=80&w=1200&auto=format&fit=crop"
---

![Network](https://images.unsplash.com/photo-1592496431122-2349e0fbc666?q=80&w=1200&auto=format&fit=crop)

Replication means keeping copies of your data on multiple servers.

## Master-Slave (Primary-Replica)

*   **1 Master**: Handles all **Writes**.
*   **N Slaves**: Handle **Reads**. Replicates data from Master.

**Use Case**: Your app has 90% reads (viewing profiles) and 10% writes (updating profile). You can add more slaves to scale reads indefinitely.

**Failover**: If Master dies, a Slave is promoted to be the new Master.

## Multi-Master

*   **Multiple Masters**: All servers accept **Writes** and **Reads**.
*   **Complexity**: Conflict resolution. What if User A updates a row on Server 1, and User B updates the *same* row on Server 2 at the same time?

## Async vs Sync Replication

*   **Synchronous**: Write is confirmed only after ALL replicas acknowledge. (Safe but slow).
*   **Asynchronous**: Write is confirmed immediately. Replicas catch up later. (Fast but risk of data loss on crash).
