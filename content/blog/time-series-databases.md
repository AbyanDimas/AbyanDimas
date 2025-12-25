---
title: "Time-Series Databases: InfluxDB and Prometheus"
date: "2025-06-24"
author: "Abyan Dimas"
excerpt: "Handling millions of data points per second. Why standard databases fail at IoT and monitoring workloads."
coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop"
---

![Time Series](https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop)

Imagine you are tracking temperature from 1,000 sensors every second. That's 86 million records a day. MySQL will choke.

## Characteristics of Time-Series Data

1.  **High Write Volume**: Append-only. No updates.
2.  **Time-Centric Queries**: "Give me average temp for the last hour".
3.  **Data Retention**: "Delete data older than 30 days".

## InfluxDB & Prometheus

These databases are optimized for exactly this.

*   **Compression**: They use specialized algorithms (like Gorilla) to compress similar floating-point numbers, reducing storage by 90%.
*   **Downsampling**: Automatically convert "1-second resolution" data to "1-minute resolution" after a week to save space.

Essential for DevOps monitoring, Crypto trading, and IoT.
