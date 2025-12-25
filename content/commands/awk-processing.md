---
title: "Awk Text Processing"
description: "Pattern scanning and processing with awk for logs and CSVs."
date: "2025-09-04"
tags: ["awk", "text-processing", "linux"]
category: "Tools"
---

## Print specific column

Print 2nd column:

```bash
awk '{print $2}' file.txt
```

## Print multiple columns

```bash
awk '{print $1, $3}' file.txt
```

## Custom delimiter (CSV)

```bash
awk -F',' '{print $1, $3}' data.csv
```

## Print lines matching pattern

```bash
awk '/error/ {print}' app.log
```

## Print lines where column matches

Print lines where 3rd column is "FAIL":

```bash
awk '$3 == "FAIL" {print}' test_results.txt
```

## Sum a column

Sum all values in column 3:

```bash
awk '{sum += $3} END {print sum}' file.txt
```

## Count lines

```bash
awk 'END {print NR}' file.txt
```

## Print line numbers

```bash
awk '{print NR, $0}' file.txt
```

## Filter by numeric comparison

Print lines where column 2 > 100:

```bash
awk '$2 > 100 {print}' file.txt
```

## Calculate average

```bash
awk '{sum += $1; count++} END {print sum/count}' file.txt
```

## Print last column

```bash
awk '{print $NF}' file.txt
```

## Custom output format

```bash
awk '{printf "Name: %s, Score: %d\n", $1, $2}' file.txt
```

## Process log timestamps

Extract hour from timestamp:

```bash
awk -F'[: ]' '{print $2}' access.log
```
