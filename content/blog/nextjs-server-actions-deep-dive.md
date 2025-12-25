---
title: "Deep Dive: Next.js Server Actions & Mutations"
date: "2025-05-20"
author: "Abyan Dimas"
excerpt: "Forget API routes. Direct database mutations from your React components are here. Security, validations, and optimistic UI."
coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1200&auto=format&fit=crop"
---

![Next.js Code](https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1200&auto=format&fit=crop)

Server Actions changed the game. We used to write:
1.  Component -> 2. `fetch('/api/user')` -> 3. API Route -> 4. Controller -> 5. Database.

Now, we just call the function.

## The Syntax

```tsx
// src/components/Form.tsx
import { createUser } from '@/actions/users'

export default function RegisterForm() {
    return (
        <form action={createUser}>
            <input name="email" />
            <button type="submit">Sign Up</button>
        </form>
    )
}
```

```ts
// src/actions/users.ts
'use server'

export async function createUser(formData: FormData) {
    const email = formData.get('email');
    await db.user.create({ data: { email } });
    revalidatePath('/dashboard');
}
```

## Security Concerns

"Is this SQL Injection waiting to happen?"
No, because Server Actions are POST requests behind the scenes. However, you MUST validate inputs.

```ts
import { z } from 'zod';

const schema = z.object({ email: z.string().email() });

export async function createUser(formData: FormData) {
    const parse = schema.safeParse(Object.fromEntries(formData));
    if (!parse.success) return { error: 'Invalid email' };
    
    // Proceed safely
}
```

## Optimistic Updates

Use `useOptimistic` to show the new state immediately, even before the server responds.

Server Actions bring the simplicity of PHP with the power of React.
