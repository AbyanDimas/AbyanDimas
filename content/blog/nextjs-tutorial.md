---
title: "The Ultimate Guide to Starting with Next.js 15"
date: "2025-01-15"
author: "Abyan Dimas"
excerpt: "Learn how to build modern full-stack applications with Next.js 15, React Server Components, and the App Router."
coverImage: "https://images.unsplash.com/photo-1618477247222-ac5912453634?q=80&w=1200&auto=format&fit=crop"
---

![Next.js Banner](https://images.unsplash.com/photo-1618477247222-ac5912453634?q=80&w=1200&auto=format&fit=crop)

Next.js has revolutionized how we build React applications. With version 15, we see even more stability and power with Server Components by default. In this guide, we'll walk through creating your first project.

## Prerequisites

Before we begin, ensure you have **Node.js 18.17** or later installed.

## Step 1: Initialize the Project

Open your terminal and run the following command to create a new Next.js app automatically:

```bash
npx create-next-app@latest my-next-app
```

You'll be asked a few configuration questions:

```text
What is your project named? my-next-app
Would you like to use TypeScript? Yes
Would you like to use ESLint? Yes
Would you like to use Tailwind CSS? Yes
Would you like to use `src/` directory? Yes
Would you like to use App Router? (recommended) Yes
Would you like to customize the default import alias (@/*)? No
```

## Step 2: Understanding the Folder Structure

Once installed, your project structure will look like this:

```text
my-next-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx    # Root layout
│   │   └── page.tsx      # Home page
│   └── components/       # Your React components
├── public/               # Static assets
└── package.json
```

## Step 3: Creating Your First Page

In the App Router, folders define routes. To create a generic "About" page, create `src/app/about/page.tsx`:

```tsx
import React from 'react';

export default function AboutPage() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-4">About Us</h1>
      <p className="text-lg text-gray-600">
        This is a Next.js 15 application using the App Router!
      </p>
    </div>
  );
}
```

## Advanced: Server Actions

Next.js 15 makes data mutation easy with Server Actions. Here is a simple example of a form submission handles entirely on the server:

```tsx
// src/actions/user.ts
'use server'

export async function createUser(formData: FormData) {
    const name = formData.get('name');
    console.log('Creating user:', name);
    // Database logic here...
}
```

Next.js continues to push the boundaries of what's possible in web development. Happy coding!
