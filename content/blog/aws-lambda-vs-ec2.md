---
title: "Serverless vs Containers: AWS Lambda vs EC2"
date: "2025-05-30"
author: "Abyan Dimas"
excerpt: "When should you go Serverless? Cost analysis, cold starts, and architectural trade-offs."
coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop"
---

![AWS Architecture](https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop)

In the AWS ecosystem, there are two primary ways to run compute.

## EC2 (Virtual Machines)

You rent a computer. It runs 24/7.
*   **Pros**: Full control, persistent connections (WebSockets), consistent performance.
*   **Cons**: You pay for idle time. You manage OS updates.

## Lambda (Serverless)

You upload code. AWS runs it only when triggered (HTTP request, DB change).
*   **Pros**: Zero idle cost. Auto-scaling from 0 to 1000s concurrently. No OS management.
*   **Cons**: **Cold Starts** (latency on first request). 15-minute execution limit.

## Use Case: Image Processing

**Scenario**: Users upload profile pictures. You need to resize them.
*   **EC2**: Bad. You pay for the server even at 3 AM when no one uploads.
*   **Lambda**: Perfect. Trigger Lambda on S3 upload. Resize. Done. Pay only for the 200ms of runtime.

## Use Case: WebSocket Chat Server

**Scenario**: Real-time chat app.
*   **Lambda**: Hard. Lambda dies after execution. It can't hold a WebSocket connection open.
*   **EC2**: Perfect. Node.js server holding thousands of socket connections.

Choose the right tool for the traffic pattern.
