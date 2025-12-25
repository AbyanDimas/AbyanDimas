---
title: "Jq JSON Processor"
description: "Parse, filter, and transform JSON data with jq command-line tool."
date: "2025-09-24"
tags: ["jq", "json", "data-processing"]
category: "Tools"
---

## Pretty print JSON

```bash
cat data.json | jq '.'
```

## Extract specific field

```bash
cat data.json | jq '.name'
```

## Extract nested field

```bash
cat data.json | jq '.user.email'
```

## Extract from array

```bash
cat data.json | jq '.[0]'
```

## Map over array

```bash
cat data.json | jq '.[] | .name'
```

## Filter array

Get users where age > 25:

```bash
cat users.json | jq '.[] | select(.age > 25)'
```

## Get specific fields

```bash
cat data.json | jq '{name: .name, email: .email}'
```

## Array length

```bash
cat data.json | jq '. | length'
```

## Get keys

```bash
cat data.json | jq 'keys'
```

## Sort array

```bash
cat data.json | jq 'sort_by(.age)'
```

## Reverse array

```bash
cat data.json | jq 'reverse'
```

## Group by field

```bash
cat data.json | jq 'group_by(.category)'
```

## Unique values

```bash
cat data.json | jq '[.[].category] | unique'
```

## Map and select

```bash
cat data.json | jq '[.[] | select(.active == true) | .name]'
```

## Conditional logic

```bash
cat data.json | jq 'if .age >= 18 then "adult" else "minor" end'
```

## API response parsing

```bash
curl -s https://api.example.com/users | jq '.[].email'
```

## Filter by multiple conditions

```bash
cat data.json | jq '.[] | select(.age > 20 and .active == true)'
```

## Convert to CSV

```bash
cat data.json | jq -r '.[] | [.name, .age, .email] | @csv'
```

## Null handling

```bash
cat data.json | jq '.email // "no email"'
```

## Merge objects

```bash
jq -s '.[0] * .[1]' file1.json file2.json
```

## Count matches

```bash
cat data.json | jq '[.[] | select(.status == "active")] | length'
```

## Raw output (no quotes)

```bash
cat data.json | jq -r '.name'
```

## Compact output

```bash
cat data.json | jq -c '.'
```
