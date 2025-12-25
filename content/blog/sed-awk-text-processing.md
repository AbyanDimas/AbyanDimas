---
title: "Text Processing Powerhouse: Sed and Awk"
date: "2025-07-15"
author: "Abyan Dimas"
excerpt: "Don't open Excel. Process text streams directly in the terminal. Substitution, field extraction, and reporting."
coverImage: "https://images.unsplash.com/photo-1608222351212-18fe0ec7b13b?q=80&w=1200&auto=format&fit=crop"
---

![Text Code](https://images.unsplash.com/photo-1608222351212-18fe0ec7b13b?q=80&w=1200&auto=format&fit=crop)

Linux is text-based. Configs are text, logs are text. `sed` and `awk` are the tools designed to manipulate streams of text efficiently.

## Sed (Stream Editor)

Best for **substitution** (Find and Replace).

```bash
# Replace 'foo' with 'bar' in file.txt
sed 's/foo/bar/g' file.txt

# Modify file in-place (Dangerous, use backup!)
sed -i 's/localhost/127.0.0.1/g' config.conf
```

It can also delete lines:
```bash
# Delete line 5
sed '5d' file.txt
# Delete lines containing "error"
sed '/error/d' logs.txt
```

## Awk

Best for **columnar data** (like CSVs or log files).
Awk treats each line as a Record, and spaces as delimiters for Fields (`$1`, `$2`...).

Imagine `ls -l` output:
`-rw-r--r-- 1 user group 1234 Jan 1 filename.txt`

Print only the filename (Col 9) and size (Col 5):
```bash
ls -l | awk '{print $9, $5}'
```

Summing numbers (Total size of files):
```bash
ls -l | awk '{sum += $5} END {print sum}'
```

Filtering rows:
```bash
# Print users with UID > 1000 from /etc/passwd
awk -F: '$3 >= 1000 {print $1}' /etc/passwd
```

Combined, `sed` and `awk` can transform any data format into any other without leaving the CLI.
