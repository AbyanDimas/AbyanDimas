---
title: "5 TypeScript Utility Types You Should Know"
date: "2025-02-28"
author: "Abyan Dimas"
excerpt: "Stop writing redundant interfaces. Partial, Pick, Omit, and Record can save you hours of coding."
coverImage: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=1200&auto=format&fit=crop"
---

![Code Monitor](https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=1200&auto=format&fit=crop)

TypeScript is powerful, but are you using its full potential? Utility types are built-in tools to transform types efficiently.

## 1. Partial<T>

Makes all properties of a type optional. Great for update functions.

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

function updateUser(id: number, fields: Partial<User>) {
  // fields.name is optional now
}
```

## 2. Pick<T, K>

Selects only specific keys from a type.

```typescript
type UserSummary = Pick<User, 'id' | 'name'>;
// { id: number; name: string; }
```

## 3. Omit<T, K>

The opposite of Pick. Removes specific keys.

```typescript
type UserWithoutEmail = Omit<User, 'email'>;
```

## 4. Record<K, T>

Creates an object type with specific keys and values.

```typescript
const roles: Record<string, number> = {
  'admin': 1,
  'user': 2
};
```

## 5. Readonly<T>

Prevents mutation of properties.

```typescript
const config: Readonly<Config> = { endpoint: 'api.com' };
// config.endpoint = 'error'; // Error!
```
