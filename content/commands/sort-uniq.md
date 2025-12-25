---
title: "Sort & Uniq Data Processing"
description: "Sort and remove duplicates with sort and uniq commands."
date: "2025-12-08"
tags: ["sort", "uniq", "processing"]
category: "Tools"
---

## SORT - Sort lines

```bash
# Alphabetically (default)
sort file.txt

# Reverse order
sort -r file.txt

# Numeric sort
sort -n numbers.txt

# Case-insensitive
sort -f file.txt
```

## Sort by column

```bash
# By second column
sort -k 2 file.txt

# By second column, numeric
sort -k 2 -n file.txt

# By multiple columns
sort -k 1,1 -k 2,2n file.txt

# CSV (comma delimiter)
sort -t ',' -k 2 file.csv
```

## Sort options

```bash
# Human-readable numbers (1K, 2M, 3G)
sort -h sizes.txt

# Version sort (1.2, 1.10, 1.20)
sort -V versions.txt

# Month sort
sort -M months.txt

# Random order
sort -R file.txt

# Unique (remove duplicates while sorting)
sort -u file.txt
```

## UNIQ - Remove duplicates

```bash
# Remove consecutive duplicates
uniq file.txt

# Count occurrences
uniq -c file.txt

# Show only duplicates
uniq -d file.txt

# Show only unique lines
uniq -u file.txt

# Ignore case
uniq -i file.txt
```

## Sort + Uniq combination

```bash
# Sort then remove all duplicates
sort file.txt | uniq

# Or use sort -u
sort -u file.txt

# Count duplicates
sort file.txt | uniq -c

# Most common items
sort file.txt | uniq -c | sort -rn
```

## Advanced sorting

```bash
# Sort by file size
ls -l | sort -k 5 -n

# Sort by date (ls output)
ls -lt  # Built-in

# Split by delimiter
sort -t ':' -k 3 -n /etc/passwd

# Ignore leading blanks
sort -b file.txt

# Stable sort (preserve order)
sort -s file.txt
```

## Field-specific sorting

```bash
# Apache access log by status code
sort -k 9 access.log

# By IP address
sort -t . -k 1,1n -k 2,2n -k 3,3n -k 4,4n ips.txt

# CSV by column 3
sort -t ',' -k 3 data.csv
```

## Ignore fields

```bash
# Skip first field
uniq -f 1 file.txt

# Skip first N characters
uniq -s 10 file.txt
```

## Practical examples

### Count unique visitors (access log)

```bash
awk '{print $1}' access.log | sort | uniq -c | sort -rn | head -10
```

### Find duplicates

```bash
sort file.txt | uniq -d
```

### Top 10 most common items

```bash
sort file.txt | uniq -c | sort -rn | head -10
```

### Merge sorted files

```bash
sort -m file1.txt file2.txt
```

### Remove duplicates from file

```bash
sort file.txt | uniq > file-unique.txt
# Or in-place
sort -u file.txt -o file.txt
```

## Sort in-place

```bash
# Save to same file
sort file.txt -o file.txt

# Or with temp file
sort file.txt > temp && mv temp file.txt
```

## Check if sorted

```bash
# Returns 0 if sorted
sort -c file.txt
echo $?

# Verbose
sort -c file.txt 2>&1
```

## Numeric vs alphabetic

```bash
# Alphabetic (wrong for numbers)
sort numbers.txt
# 1
# 10
# 2
# 20

# Numeric (correct)
sort -n numbers.txt
# 1
# 2
# 10
# 20
```

## Complex sorting

```bash
# Sort by column 2 numeric, then column 1 alphabetic
sort -k 2,2n -k 1,1 file.txt

# Sort by date (assuming YYYY-MM-DD format)
sort -k 1 file.txt

# Sort CSV by multiple columns
sort -t ',' -k 3,3 -k 1,1 data.csv
```

## Case studies

### Website access analysis

```bash
# Top IPs
awk '{print $1}' access.log | sort | uniq -c | sort -rn | head -10

# Top URLs
awk '{print $7}' access.log | sort | uniq -c | sort -rn | head -10

# Status codes
awk '{print $9}' access.log | sort | uniq -c | sort -n
```

### Log analysis

```bash
# Most common errors
grep ERROR app.log | sort | uniq -c | sort -rn

# Unique error messages
grep ERROR app.log | cut -d: -f3- | sort | uniq
```

### Data deduplication

```bash
# Remove duplicate IPs
sort -u ips.txt -o ips-unique.txt

# Keep first occurrence
awk '!seen[$0]++' file.txt
```

### Find missing numbers

```bash
# Expecting 1-100
seq 1 100 > expected.txt
sort -n actual.txt > actual-sorted.txt
comm -23 expected.txt actual-sorted.txt
```

## Performance tips

```bash
# Parallel sort (faster)
sort --parallel=4 large-file.txt

# Set buffer size
sort -S 2G large-file.txt

# Use temp directory
sort -T /tmp large-file.txt

# Compress temp files
sort --compress-program=gzip large-file.txt
```

## Locale affecting sort

```bash
# Different sort order based on locale
LC_ALL=C sort file.txt       # ASCII order
LC_ALL=en_US.UTF-8 sort file.txt  # Locale-specific

# For consistent results across systems
export LC_ALL=C
sort file.txt
```

## Alternative tools

```bash
# awk (remove duplicates keeping order)
awk '!seen[$0]++' file.txt

# perl
perl -ne 'print unless $seen{$_}++' file.txt

# python
sort file.txt | python -c "import sys; print(''.join(sorted(set(sys.stdin))))"
```

## Quick reference

```bash
# Sort
sort file.txt          # Alphabetic
sort -n file.txt       # Numeric
sort -r file.txt       # Reverse
sort -u file.txt       # Unique
sort -k 2 file.txt     # By column 2
sort -t ',' -k 2 file.csv  # CSV column 2

# Uniq (requires sorted input)
uniq file.txt          # Remove duplicates
uniq -c file.txt       # Count
uniq -d file.txt       # Show duplicates
uniq -u file.txt       # Show unique only

# Common combinations
sort file.txt | uniq -c | sort -rn  # Frequency count
sort -u file.txt                     # Unique lines
```
