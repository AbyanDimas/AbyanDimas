---
title: "Understanding ACID Transactions"
date: "2025-06-12"
author: "Abyan Dimas"
excerpt: "Atomicity, Consistency, Isolation, Durability. The four pillars that ensure your bank balance doesn't disappear."
coverImage: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=1200&auto=format&fit=crop"
---

![Vault](https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=1200&auto=format&fit=crop)

When you transfer money from Account A to Account B, you want to be sure that money doesn't get lost in the middle. **ACID** properties guarantee this.

## A - Atomicity
"All or Nothing." If the system crashes after debiting A but before crediting B, the entire transaction rolls back. Account A's money is restored.

## C - Consistency
The database must move from one valid state to another. Constraints (like "Account balance cannot be negative") are enforced.

## I - Isolation
Transactions running in parallel shouldn't interfere with each other. If I check my balance while a transfer is pending, I should see consistent data.

## D - Durability
Once a transaction is committed, it stays committed. Even if the power goes out 1 second later, the data is saved on disk.

Without ACID, modern commerce would be impossible.
