---
title: "Sed Stream Editor Basics"
description: "Text manipulation and find-replace operations with sed."
date: "2025-09-03"
tags: ["sed", "text-processing", "linux"]
category: "Tools"
---

## Replace first occurrence in line

```bash
sed 's/old/new/' file.txt
```

## Replace all occurrences (global)

```bash
sed 's/old/new/g' file.txt
```

## Edit file in-place

```bash
sed -i 's/old/new/g' file.txt
```

**macOS** requires `-i ''`:

```bash
sed -i '' 's/old/new/g' file.txt
```

## Delete lines containing pattern

```bash
sed '/pattern/d' file.txt
```

## Delete empty lines

```bash
sed '/^$/d' file.txt
```

## Delete line number 5

```bash
sed '5d' file.txt
```

## Delete lines 5-10

```bash
sed '5,10d' file.txt
```

## Print only lines containing pattern

```bash
sed -n '/pattern/p' file.txt
```

## Replace on specific line (line 3 only)

```bash
sed '3s/old/new/' file.txt
```

## Add line after match

```bash
sed '/pattern/a New line here' file.txt
```

## Multiple substitutions

```bash
sed -e 's/foo/bar/g' -e 's/hello/world/g' file.txt
```

## Use different delimiter (useful with paths)

```bash
sed 's|/old/path|/new/path|g' file.txt
```

## Capture groups

Replace "John Doe" with "Doe, John":

```bash
sed 's/\([A-Z][a-z]*\) \([A-Z][a-z]*\)/\2, \1/' file.txt
```
