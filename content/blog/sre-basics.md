---
title: "Understanding SRE: Reliability is a Feature"
date: "2025-05-10"
author: "Abyan Dimas"
excerpt: "Site Reliability Engineering concepts: SLIs, SLOs, SLAs, and why 100% uptime is the wrong goal."
coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop"
---

![Monitoring Center](https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop)

In the past, Devs threw code over the wall to Ops. Ops tried to keep the servers stable. Devs wanted change (new features), Ops wanted stability (no change). Conflict was inevitable.

Google created **Site Reliability Engineering (SRE)** to solve this. SRE treats operations as a software problem.

## The Core Concept: Error Budgets

You don't need 100% uptime. 100% is impossible and infinitely expensive.
Users can't tell the difference between 99.999% and 100%.

If your goal is **99.9% availability**, that means you belong to have **0.1% downtime** allowed per month. This is your **Error Budget**.

*   As long as you have budget left, Devs can push risky updates.
*   If you burn your budget (too many outages), **deployments freeze**. The team must focus on stability until the budget resets.

This aligns incentives. Both Dev and Ops care about the budget.

## Key Definitions

### SLI (Service Level Indicator)
**The Metric**. What are we measuring?
*   *Example*: "Success rate of HTTP requests" or "Latency in ms".

### SLO (Service Level Objective)
**The Goal**. What is the target for our SLI?
*   *Example*: "99.9% of requests in the last 30 days must be successful."
*   *Example*: "99% of requests must be faster than 200ms."

### SLA (Service Level Agreement)
**The Contract**. What happens if we miss the SLO? usually involves money.
*   *Example*: "If uptime drops below 99.5%, we refund 10% of the customer's bill."

## Toil

SREs hate manual work ("Toil"). If a server needs to be restarted manually every day, an SRE doesn't just do it—they write a script to do it, or fix the root cause.

> "Hope is not a strategy." - Benjamin Treynor Sloss, Creator of SRE.
