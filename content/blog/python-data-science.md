---
title: "Python for Data Science: Getting Started with Pandas"
date: "2025-03-25"
author: "Abyan Dimas"
excerpt: "Data manipulation made easy. A crash course on DataFrames, filtering, and analysis using the Pandas library."
coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop"
---

![Data Analysis](https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop)

Python is the king of data science, and Pandas is its crown jewel. If you are dealing with structured data (like Excel or SQL), you need Pandas.

## What is a DataFrame?

Think of a DataFrame as a programmable spreadsheet.

```python
import pandas as pd

data = {
  'Name': ['Alice', 'Bob', 'Charlie'],
  'Age': [25, 30, 35],
  'City': ['New York', 'Paris', 'London']
}

df = pd.DataFrame(data)
```

## Filtering Data

Want to find everyone older than 28?

```python
# Pure magic
seniors = df[df['Age'] > 28]
print(seniors)
```

## Analyzing Data

Get quick statistics in one line:

```python
df.describe()
```

Pandas allows you to clean, transform, and analyze millions of rows in seconds. It is an essential tool for any modern developer.
