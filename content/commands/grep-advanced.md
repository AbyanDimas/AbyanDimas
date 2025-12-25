---
title: "Grep Advanced Patterns"
description: "Master regular expressions and advanced grep techniques."
date: "2025-10-10"
tags: ["grep", "regex", "text-processing"]
category: "Tools"
---

## Extended regex (ERE)

```bash
grep -E "pattern" file.txt
```

Or use `egrep`:

```bash
egrep "pattern" file.txt
```

## Perl regex (PCRE)

```bash
grep -P "pattern" file.txt
```

## Fixed strings (literal match)

```bash
grep -F "literal.string" file.txt
```

Or use `fgrep`:

```bash
fgrep "literal.string" file.txt
```

## Case insensitive

```bash
grep -i "error" file.txt
```

## Invert match

```bash
grep -v "exclude" file.txt
```

## Count matches

```bash
grep -c "pattern" file.txt
```

## Show only filenames

```bash
grep -l "pattern" *.txt
```

## Show filenames without match

```bash
grep -L "pattern" *.txt
```

## Recursive search

```bash
grep -r "pattern" /path/to/dir
```

## Show line numbers

```bash
grep -n "pattern" file.txt
```

## Context lines

```bash
grep -C 3 "pattern" file.txt    # 3 lines before and after
grep -B 3 "pattern" file.txt    # 3 lines before
grep -A 3 "pattern" file.txt    # 3 lines after
```

## Word boundary

```bash
grep -w "word" file.txt
```

## Beginning of line

```bash
grep "^pattern" file.txt
```

## End of line

```bash
grep "pattern$" file.txt
```

## Character classes

```bash
grep "[0-9]" file.txt           # Any digit
grep "[a-z]" file.txt           # Any lowercase
grep "[A-Z]" file.txt           # Any uppercase
grep "[a-zA-Z]" file.txt        # Any letter
grep "[^0-9]" file.txt          # Not a digit
```

## Predefined classes (with -P)

```bash
grep -P "\d" file.txt           # Digit [0-9]
grep -P "\D" file.txt           # Not digit
grep -P "\w" file.txt           # Word char [a-zA-Z0-9_]
grep -P "\W" file.txt           # Not word char
grep -P "\s" file.txt           # Whitespace
grep -P "\S" file.txt           # Not whitespace
```

## Quantifiers

```bash
grep -E "a?" file.txt           # 0 or 1 'a'
grep -E "a*" file.txt           # 0 or more 'a'
grep -E "a+" file.txt           # 1 or more 'a'
grep -E "a{3}" file.txt         # Exactly 3 'a'
grep -E "a{3,}" file.txt        # 3 or more 'a'
grep -E "a{3,5}" file.txt       # 3 to 5 'a'
```

## Alternation (OR)

```bash
grep -E "cat|dog" file.txt
grep -E "(red|blue|green)" file.txt
```

## Grouping

```bash
grep -E "(error|warning): " file.txt
```

## Backreferences

```bash
grep -P "(\w+) \1" file.txt     # Repeated word
```

## Lookahead (with -P)

```bash
grep -P "foo(?=bar)" file.txt   # 'foo' followed by 'bar'
grep -P "foo(?!bar)" file.txt   # 'foo' not followed by 'bar'
```

## Lookbehind (with -P)

```bash
grep -P "(?<=foo)bar" file.txt  # 'bar' preceded by 'foo'
grep -P "(?<!foo)bar" file.txt  # 'bar' not preceded by 'foo'
```

## Email addresses

```bash
grep -E "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}" file.txt
```

## IP addresses

```bash
grep -E "\b([0-9]{1,3}\.){3}[0-9]{1,3}\b" file.txt
```

## URLs

```bash
grep -E "https?://[^\s]+" file.txt
```

## Numbers

```bash
grep -E "^[0-9]+$" file.txt     # Only numbers
grep -E "^[0-9]+\.[0-9]+$" file.txt  # Decimal numbers
```

## Exclude specific extensions

```bash
grep -r --exclude="*.log" "pattern" /path
```

## Exclude directories

```bash
grep -r --exclude-dir="node_modules" "pattern" /path
```

## Include only specific extensions

```bash
grep -r --include="*.js" "pattern" /path
```

## Binary files

```bash
grep -a "pattern" binary_file   # Treat as text
grep -I "pattern" *             # Skip binary files
```

## Quiet mode (exit code only)

```bash
grep -q "pattern" file.txt && echo "Found" || echo "Not found"
```

## Color highlighting

```bash
grep --color=auto "pattern" file.txt
```

## Multiple patterns

```bash
grep -e "pattern1" -e "pattern2" file.txt
```

## From pattern file

```bash
grep -f patterns.txt file.txt
```
