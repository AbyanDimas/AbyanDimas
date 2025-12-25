---
title: "Compression & Archives"
description: "zip, gzip, bzip2, and other compression tools for files and directories."
date: "2025-09-13"
tags: ["compression", "zip", "linux"]
category: "System"
---

## Create zip archive

```bash
zip -r archive.zip folder/
```

## Extract zip archive

```bash
unzip archive.zip
```

## List contents without extracting

```bash
unzip -l archive.zip
```

## Extract to specific directory

```bash
unzip archive.zip -d /target/directory
```

## Gzip compress file

```bash
gzip file.txt
```

Creates `file.txt.gz` and removes original.

## Gzip decompress

```bash
gunzip file.txt.gz
```

Or:

```bash
gzip -d file.txt.gz
```

## Keep original file when compressing

```bash
gzip -k file.txt
```

## Compress with bzip2 (better compression)

```bash
bzip2 file.txt
```

## Decompress bzip2

```bash
bunzip2 file.txt.bz2
```

## Create tar.gz archive

```bash
tar -czvf archive.tar.gz folder/
```

## Extract tar.gz

```bash
tar -xzvf archive.tar.gz
```

## Create tar.bz2 (better compression)

```bash
tar -cjvf archive.tar.bz2 folder/
```

## Extract tar.bz2

```bash
tar -xjvf archive.tar.bz2
```

## View tar contents

```bash
tar -tzvf archive.tar.gz
```

## Extract single file from tar

```bash
tar -xzvf archive.tar.gz file.txt
```

## 7zip compression (maximum)

```bash
7z a -t7z -mx=9 archive.7z folder/
```

## Extract 7z

```bash
7z x archive.7z
```
