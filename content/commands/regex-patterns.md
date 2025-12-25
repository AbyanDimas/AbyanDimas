---
title: "Regex Testing & Patterns"
description: "Test and debug regular expressions with common patterns and tools."
date: "2025-11-05"
tags: ["regex", "patterns", "text"]
category: "Tools"
---

## Test regex with grep

```bash
echo "test123" | grep -P "test\d+"
```

## Basic patterns

```regex
.       # Any character
\d      # Digit [0-9]
\D      # Not digit
\w      # Word character [a-zA-Z0-9_]
\W      # Not word character
\s      # Whitespace
\S      # Not whitespace
```

## Anchors

```regex
^       # Start of line
$       # End of line
\b      # Word boundary
\B      # Not word boundary
```

## Quantifiers

```regex
*       # 0 or more
+       # 1 or more
?       # 0 or 1
{3}     # Exactly 3
{3,}    # 3 or more
{3,5}   # 3 to 5
*?      # Lazy (non-greedy)
```

## Character classes

```regex
[abc]      # a, b, or c
[^abc]     # Not a, b, or c
[a-z]      # Lowercase letters
[A-Z]      # Uppercase letters
[0-9]      # Digits
[a-zA-Z0-9]# Alphanumeric
```

## Groups and capture

```regex
(abc)      # Capture group
(?:abc)    # Non-capturing group
(a|b|c)    # Alternation
\1         # Backreference to group 1
```

## Common patterns

### Email

```regex
[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}
```

### URL

```regex
https?://[^\s]+
```

### IPv4 address

```regex
\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b
```

### Phone number (US)

```regex
\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}
```

### Date (YYYY-MM-DD)

```regex
\d{4}-\d{2}-\d{2}
```

### Time (HH:MM)

```regex
\d{2}:\d{2}
```

### Credit card

```regex
\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}
```

### Hex color

```regex
#[0-9A-Fa-f]{6}
```

### Username

```regex
^[a-zA-Z0-9_]{3,16}$
```

### Password (strong)

```regex
^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$
```

## Test with sed

```bash
echo "hello123world" | sed -n '/[a-z]*[0-9]*[a-z]*/p'
```

## Test with awk

```bash
echo "test@example.com" | awk '/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ {print "Valid email"}'
```

## Test with Perl

```bash
echo "test123" | perl -ne 'print if /test\d+/'
```

## Python regex

```python
import re

pattern = r'\d+'
text = "abc123def456"
matches = re.findall(pattern, text)
print(matches)  # ['123', '456']
```

## JavaScript regex

```javascript
const pattern = /\d+/g;
const text = "abc123def456";
const matches = text.match(pattern);
console.log(matches);  // ['123', '456']
```

## Online regex testers

- regex101.com
- regexr.com
- regextester.com

## Common use cases

### Extract emails from text

```bash
grep -oP '\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b' file.txt
```

### Extract URLs

```bash
grep -oP 'https?://[^\s]+' file.txt
```

### Extract IP addresses

```bash
grep -o -E '\b([0-9]{1,3}\.){3}[0-9]{1,3}\b' file.txt
```

### Find phone numbers

```bash
grep -P '\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}' file.txt
```

### Validate input

```bash
read -p "Enter email: " email
if [[ $email =~ ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$ ]]; then
    echo "Valid email"
else
    echo "Invalid email"
fi
```

## Lookahead/Lookbehind

```regex
(?=...)    # Positive lookahead
(?!...)    # Negative lookahead
(?<=...)   # Positive lookbehind
(?<!...)   # Negative lookbehind
```

### Example: Password must contain letter and digit

```regex
^(?=.*[a-z])(?=.*\d).+$
```

## Flags

```regex
g    # Global (all matches)
i    # Case insensitive
m    # Multiline
s    # Dot matches newline
x    # Ignore whitespace
```

## Escape special characters

```bash
. \ + * ? [ ^ ] $ ( ) { } = ! < > | : -
```

## Common mistakes

```bash
# Wrong: .* is greedy
echo "<p>test</p>" | grep -oP '<.*>'
# Output: <p>test</p>

# Right: .*? is lazy
echo "<p>test</p>" | grep -oP '<.*?>'
# Output: <p>, </p>
```

## Debug regex

```bash
# Use verbose mode (Perl)
perl -e '
$text = "test123";
$text =~ /
    test   # Match "test"
    \d+    # Then digits
/x and print "Match\n";
'
```

## Replace with sed

```bash
# Replace emails
sed 's/[a-zA-Z0-9._%+-]\+@[a-zA-Z0-9.-]\+\.[a-zA-Z]\{2,\}/[EMAIL]/g' file.txt

# Replace phone numbers
sed 's/\([0-9]\{3\}\)[-. ]\?\([0-9]\{3\}\)[-. ]\?\([0-9]\{4\}\)/(\1) \2-\3/g' file.txt
```

## Bash regex

```bash
text="My IP is 192.168.1.100"
if [[ $text =~ ([0-9]+\.){3}[0-9]+ ]]; then
    echo "IP found: ${BASH_REMATCH[0]}"
fi
```

## Test script

```bash
#!/bin/bash

test_regex() {
    local pattern=$1
    local text=$2
    
    if echo "$text" | grep -qP "$pattern"; then
        echo "✓ MATCH: '$text'"
    else
        echo "✗ NO MATCH: '$text'"
    fi
}

# Test email pattern
EMAIL_PATTERN='[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'

test_regex "$EMAIL_PATTERN" "test@example.com"
test_regex "$EMAIL_PATTERN" "invalid.email"
```
