---
title: "Web Performance: Core Web Vitals Explained"
date: "2025-03-15"
author: "Abyan Dimas"
excerpt: "LCP, FID, CLS. De-mystifying Google's ranking factors and improving user experience."
coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop"
---

![Performance Graph](https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop)

Fast websites get more traffic. Google measures speed using "Core Web Vitals".

## LCP (Largest Contentful Paint)

**What**: How long it takes for the main content (hero image, heading) to load.
**Goal**: Under 2.5 seconds.
**Fix**: Optimize images (WebP), use CDNs, cache assets.

## FID (First Input Delay) / INP

**What**: Responsiveness. When a user clicks a button, how long until the browser reacts?
**Goal**: Under 100ms.
**Fix**: Reduce JavaScript bloat, break up long tasks.

## CLS (Cumulative Layout Shift)

**What**: Visual stability. Does the text jump when an ad loads?
**Goal**: Under 0.1.
**Fix**: Define explicit width and height for all images and videos.

## Tools to Measure

1.  **Lighthouse**: Built into Chrome DevTools.
2.  **PageSpeed Insights**: Google's official tool.

Focusing on these metrics isn't just about SEO; it's about respecting your user's time.
