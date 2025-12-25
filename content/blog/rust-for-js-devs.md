---
title: "Rust for JavaScript Developers: A Gentle Introduction"
date: "2025-05-15"
author: "Abyan Dimas"
excerpt: "Why is everyone rewriting their tools in Rust? Memory safety, performance, and why it's easier to learn than you think."
coverImage: "https://images.unsplash.com/photo-1590461528646-3023eb29e3a6?q=80&w=1200&auto=format&fit=crop"
---

![Rust Code](https://images.unsplash.com/photo-1590461528646-3023eb29e3a6?q=80&w=1200&auto=format&fit=crop)

Vercel, Microsoft, AWS. Everyone is adopting Rust. As a JS developer, you might feel left behind. Let's break the barrier.

## The Borrow Checker

In JS, the Garbage Collector cleans up memory for you (at the cost of performance). In C, you manage it manually (at the cost of sanity).

Rust introduces **Ownership**.

```rust
fn main() {
    let s1 = String::from("hello");
    let s2 = s1; // s1 is now invalid! Ownership moved to s2.
    // println!("{}", s1); // Error!
}
```

This prevents entire classes of bugs (like using freed memory) at compile time.

## Types on Steroids

TypeScript is great, but its types disappear at runtime. Rust types ensure correctness down to the machine code.

```rust
// Result<T, E> forces you to handle errors
enum Result<T, E> {
    Ok(T),
    Err(E),
}
```

You can't "forget" to check for errors in Rust. The compiler won't let you.

## Why Learn it?

*   **Tooling**: SWC, Turbopack, and Biome are all written in Rust. Understanding it helps you contribute to modern web tooling.
*   **WebAssembly**: Run high-performance code in the browser.

Rust isn't just a language; it's a mindset shift towards reliability.
