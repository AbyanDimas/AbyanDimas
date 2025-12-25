---
title: "Understanding React Server Components"
excerpt: "A deep dive into the architecture and benefits of React Server Components in Next.js."
date: "Dec 15, 2025"
author: "Abyan Dimas"
---
React Server Components (RSC) represent a major shift in how we build React applications. By allowing components to render exclusively on the server, we can reduce bundle sizes and improve initial page load performance.

## What are Server Components?
Server components are a new type of component that fetches data and renders HTML on the server. Unlike traditional SSR, they don't hydrate on the client, meaning no JavaScript is sent to the browser for these components.

## Benefits
1. **Zero Bundle Size**: Dependencies used in server components aren't included in the client bundle.
2. **Direct Backend Access**: Access databases and filesystems directly.
3. **Automatic Code Splitting**: Client components imported by server components are automatically code-split.
