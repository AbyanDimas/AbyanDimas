---
title: "Advanced React Hooks Patterns"
date: "2025-02-20"
author: "Abyan Dimas"
excerpt: "Go beyond useState and useEffect. Master custom hooks, useReducer, and performance optimization with useMemo."
coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1200&auto=format&fit=crop"
---

![React Code](https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1200&auto=format&fit=crop)

React Hooks have been around for years, but many developers still stop at `useState`. Let's explore some advanced patterns.

## The Power of Custom Hooks

Custom hooks allow you to extract logic from components. Imagine a hook that fetches data.

```tsx
function useFetch(url) {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetch(url).then(res => res.json()).then(setData);
  }, [url]);
  
  return data;
}
```

Now your component is clean:

```tsx
const UserProfile = () => {
  const user = useFetch('/api/user');
  if (!user) return <Spinner />;
  return <div>{user.name}</div>;
}
```

## useReducer for Complex State

When `useState` gets messy, `useReducer` is your friend. It works like Redux but built-in.

```tsx
const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    default:
      throw new Error();
  }
}
```

## Performance with useMemo

Don't let expensive calculations slow down your render.

```tsx
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);
```

Mastering these hooks distinguishes a junior React developer from a senior one.
