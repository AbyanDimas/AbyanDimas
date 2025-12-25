---
title: "The Art of Code Review: Specifics Matter"
date: "2025-05-01"
author: "Abyan Dimas"
excerpt: "Code reviews are not just for catching bugs. They are the primary mechanism for knowledge sharing and maintaining code quality."
coverImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop"
---

![Collaboration](https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop)

A robust code review culture is the difference between a high-performing engineering team and a chaotic one. But "LGTM" (Looks Good To Me) is not enough.

## What to Look For (A Checklist)

### 1. Functionality
*   Does the code actually do what the ticket says?
*   Are there edge cases (null inputs, empty lists) handled?
*   Is it user-friendly?

### 2. Readability & Style
*   Are variable names descriptive? (`x` vs `userAge`).
*   Is the logic easy to follow? If you have to read it 3 times, it needs a refactor.
*   Does it follow the team's style guide? (Linter should catch this, not humans!).

### 3. Architecture & Design
*   Is the code in the right place? (Logic in View vs Controller).
*   Is it reusable?
*   Does it introduce technical debt?

### 4. Security & Performance
*   Is user input sanitized?
*   Are we doing N+1 database queries?

## Etiquette for Reviewers

*   **Critique the code, not the person.**
    *   *Bad*: "You broke the build again."
    *   *Good*: "This change seems to cause a build failure."
*   **Ask questions, don't give orders.**
    *   *Bad*: "Change this to a map."
    *   *Good*: "Would a map be more efficient here?"
*   **Praise good code.** If you see a clever solution, say it!

## Etiquette for Authors

*   **Review your own code first.** Don't waste the reviewer's time with typos.
*   **Write a good PR description.** Explain *why* you made these changes.
*   **Don't take feedback personally.** The reviewer is helping you grow.

Code review is a conversation, not a gatekeeping process.
