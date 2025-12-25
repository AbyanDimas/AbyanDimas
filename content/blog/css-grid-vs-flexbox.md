---
title: "CSS Grid vs Flexbox: When to Use Which?"
date: "2025-04-05"
author: "Abyan Dimas"
excerpt: "One is for 1D layouts, the other for 2D. Stop guessing and learn the definitive rules for modern CSS layouts."
coverImage: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?q=80&w=1200&auto=format&fit=crop"
---

![Web Design](https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?q=80&w=1200&auto=format&fit=crop)

In the old days, we used `float` and `table`. It was a nightmare. Today, we have two superpowers: Flexbox and Grid.

## Flexbox (1-Dimensional)

Use Flexbox when you have a **row** OR a **column** of items.

*   Navbars
*   Button groups
*   Centering an element

```css
.container {
  display: flex;
  justify-content: center; /* Main axis */
  align-items: center;     /* Cross axis */
}
```

## CSS Grid (2-Dimensional)

Use Grid when you have both **rows** AND **columns**.

*   Photo galleries
*   Page layouts (Header, Sidebar, Main, Footer)

```css
.container {
  display: grid;
  grid-template-columns: 200px 1fr; /* Sidebar fixed, Main flexible */
  gap: 20px;
}
```

## The Rule of Thumb

*   **Content-Out?** Use Flexbox. Let the content define the size.
*   **Layout-In?** Use Grid. Let the layout define the size.
