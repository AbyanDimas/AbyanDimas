---
title: "Testing Multiple Images in Markdown"
date: "2025-08-01"
author: "Abyan Dimas"
excerpt: "This is a test article to verify how multiple images render within the new MarkdownViewer, alongside text and headers."
coverImage: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1200&auto=format&fit=crop"
---

![Coding Setup Cover](https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1200&auto=format&fit=crop)

This article is designed to test how images behave when placed inside the markdown content. By design, if an image URL matches the `coverImage` frontmatter exactly, it should be removed from the body to prevent duplication. (The image immediately above this paragraph should not appear in the body content if the filter works correctly.)

## 1. Developer Setup Workspace

Here is a standard image inserted using standard markdown syntax. It showcases a modern developer setup.

![Developer Workspace](https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop)

Notice how the `prose` styling from Tailwind Typography handles the spacing around the image.

## 2. Server Infrastructure

Below is another image, this time showing physical server racks. Testing vertical spacing between headings, paragraphs, and media.

![Server Racks in a Data Center](https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop)

This is the paragraph immediately following the server image. 

## 3. The Details in the Code

Let's do one more image test to ensure consecutive images or images mixed with code block formatting do not break the layout.

![Close up of code on a screen](https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop)

### Summary

The images above should all be fully responsive. On narrow screens, they should shrink to fit the container without breaking the layout or causing horizontal scrollbars. If these look great, then the layout redesign is fully solid!
