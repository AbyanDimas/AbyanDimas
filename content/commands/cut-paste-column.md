---
title: "Cut, Paste & Column Text Processing"
description: "Process columnar data with cut, paste, and column commands."
date: "2025-11-12"
tags: ["cut", "paste", "column", "text"]
category: "Tools"
---

## CUT - Extract columns

### By character position

```bash
# Characters 1-5
echo "Hello World" | cut -c 1-5

# Character 7 to end
echo "Hello World" | cut -c 7-

# Multiple ranges
echo "Hello World" | cut -c 1-5,7-11
```

### By field (delimiter)

```bash
# First field (default tab delimiter)
cut -f 1 file.txt

# Multiple fields
cut -f 1,3,5 file.txt

# Range of fields
cut -f 2-5 file.txt

# From field 3 to end
cut -f 3- file.txt
```

### Custom delimiter

```bash
# Comma delimiter
cut -d ',' -f 2 file.csv

# Colon delimiter
cut -d ':' -f 1,6 /etc/passwd

# Space delimiter
cut -d ' ' -f 3 file.txt
```

### Common examples

```bash
# Extract usernames from /etc/passwd
cut -d ':' -f 1 /etc/passwd

# Extract IP addresses from CSV
cut -d ',' -f 2 servers.csv

# Get first column of ls output
ls -l | tr -s ' ' | cut -d ' ' -f 1
```

### Options

```bash
-d    # Delimiter
-f    # Fields
-c    # Characters
-b    # Bytes
--complement  # Invert selection
--output-delimiter # Change output delimiter
```

## PASTE - Merge lines

### Merge files side by side

```bash
paste file1.txt file2.txt
```

### Custom delimiter

```bash
# Comma separated
paste -d ',' file1.txt file2.txt

# Tab (default)
paste -d '\t' file1.txt file2.txt

# Multiple delimiters
paste -d ',:' file1.txt file2.txt file3.txt
```

### Serial mode

```bash
# Merge all lines into one
paste -s file.txt

# With delimiter
paste -s -d ',' file.txt
```

### Examples

```bash
# Merge two columns
paste <(cut -d ',' -f 1 file.csv) <(cut -d ',' -f  3 file.csv)

# Number lines
paste <(seq 1 10) file.txt

# Create CSV from two files
paste -d ',' names.txt emails.txt
```

## COLUMN - Format output

### Pretty print

```bash
# Auto-format columns
cat file.txt | column -t

# LSoutput formatted
ls -l | column -t
```

### Table format

```bash
# Create table
column -t -s ',' file.csv

# Custom separator
column -t -s ':' /etc/passwd
```

### JSON-like output

```bash
column -t -o ' | ' file.txt
```

### Examples

```bash
# Format /etc/passwd
column -t -s ':' /etc/passwd | head

# Format CSV nicely
column -t -s ',' data.csv

# Format tab-separated
cat data.tsv | column -t
```

## Combined usage examples

### Extract and reformat

```bash
# Get users and shells, format
cut -d ':' -f 1,7 /etc/passwd | column -t -s ':'
```

### CSV manipulation

```bash
# Extract columns 2,4 from CSV
cut -d ',' -f 2,4 data.csv

# Reorder CSV columns
paste -d ',' \
  <(cut -d ',' -f 3 data.csv) \
  <(cut -d ',' -f 1 data.csv) \
  <(cut -d ',' -f 2 data.csv)
```

### Log processing

```bash
# Extract timestamp and message
cut -d ' ' -f 1-3,6- /var/log/syslog | column -t

# Get IP addresses from Apache log
cut -d ' ' -f 1 /var/log/apache2/access.log | sort | uniq -c
```

### Create tables

```bash
# From two files
paste <(cat names.txt) <(cat ages.txt) | column -t

# With header
(echo "Name Age"; paste names.txt ages.txt) | column -t
```

## Advanced techniques

### Swap columns

```bash
# Swap columns 1 and 2
awk '{print $2, $1}' file.txt

# Or with cut/paste
paste <(cut -f 2 file.txt) <(cut -f 1 file.txt)
```

### Add line numbers

```bash
paste <(seq 1 $(wc -l < file.txt)) file.txt | column -t
```

### Extract specific rows and columns

```bash
# Rows 5-10, columns 2-4
sed -n '5,10p' file.txt | cut -f 2-4
```

### Join columns with separator

```bash
# Join with pipe
paste -d '|' col1.txt col2.txt col3.txt
```

## Performance tips

```bash
# For large files, cut is faster than awk
cut -d ',' -f 2 large.csv  # Fast

# When you need calculations, use awk
awk -F',' '{sum+=$2} END {print sum}' large.csv
```

## Practical examples

### Extract email domains

```bash
cut -d '@' -f 2 emails.txt | sort | uniq -c
```

### Get file extensions

```bash
ls | rev | cut -d '.' -f 1 | rev | sort | uniq -c
```

### Process CSV data

```bash
#!/bin/bash
# Extract name and email from CSV

cut -d ',' -f 1,3 users.csv | \
  column -t -s ',' | \
  head -20
```

### Create markdown table

```bash
#!/bin/bash
# Convert CSV to markdown table

# Header
echo "| $(cut -d ',' -f 1-3 data.csv | head -1 | sed 's/,/ | /g') |"
echo "|---|---|---|"

# Data rows
cut -d ',' -f 1-3 data.csv | tail -n +2 | \
  sed 's/^/| /' | \
  sed 's/,/ | /g' | \
  sed 's/$/ |/'
```

### Log analysis

```bash
# Most common IPs
cut -d ' ' -f 1 access.log | sort | uniq -c | sort -rn | head -10

# Status codes
cut -d ' ' -f 9 access.log | sort | uniq -c | sort -rn
```

### Environment variables

```bash
# List PATH directories
echo $PATH | tr ':' '\n'

# Format PATH nicely
echo $PATH | tr ':' '\n' | nl
```

## Debugging

```bash
# Show field separators
cat -A file.txt | head

# Count fields
awk '{print NF}' file.txt | sort | uniq -c

# Identify delimiter
head -1 file.txt | od -c
```

## Alternatives

```bash
# AWK (more powerful)
awk -F',' '{print $2}' file.csv

# Perl (regex support)
perl -F',' -ane 'print $F[1]' file.csv

# Python (for complex logic)
python -c "import sys; [print(line.split(',')[1]) for line in sys.stdin]" < file.csv
```
