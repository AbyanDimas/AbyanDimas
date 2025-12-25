---
title: "Xargs Command Builder"
description: "Build and execute commands from standard input with xargs."
date: "2025-09-30"
tags: ["xargs", "pipes", "linux"]
category: "Tools"
---

## Basic usage

```bash
echo "file1 file2 file3" | xargs ls -l
```

## Delete files from list

```bash
cat files_to_delete.txt | xargs rm
```

## One argument per command

```bash
echo "1 2 3" | xargs -n1 echo "Number:"
```

## Execute command for each line

```bash
cat urls.txt | xargs -I {} curl -O {}
```

## Parallel execution

Run 4 commands in parallel:

```bash
cat urls.txt | xargs -P 4 -I {} curl -O {}
```

## Find and delete

```bash
find . -name "*.tmp" | xargs rm
```

## Safer find and delete (handle spaces)

```bash
find . -name "*.tmp" -print0 | xargs -0 rm
```

## Create backup of files

```bash
ls *.txt | xargs -I {} cp {} {}.bak
```

## Download multiple files

```bash
cat urls.txt | xargs -n 1 -P 5 wget
```

## Convert images

```bash
ls *.jpg | xargs -I {} convert {} -resize 50% resized/{}
```

## Grep in multiple files

```bash
find . -name "*.log" | xargs grep "ERROR"
```

## Count lines in files

```bash
find . -name "*.js" -print0 | xargs -0 wc -l
```

## Compress files

```bash
ls *.txt | xargs -I {} gzip {}
```

## Ask for confirmation

```bash
find . -name "*.tmp" | xargs -p rm
```

## Specify delimiter

```bash
echo "file1,file2,file3" | xargs -d',' ls -l
```

## Create directories

```bash
cat folders.txt | xargs mkdir -p
```

## Change permissions

```bash
find . -name "*.sh" -print0 | xargs -0 chmod +x
```

## Docker cleanup

```bash
docker ps -a -q | xargs docker rm
```

## Git operations

```bash
git branch -r | grep -v '\->' | xargs -I {} git branch --track {} origin/{}
```

## Process multiple arguments

```bash
echo "dir1 dir2 dir3" | xargs -n1 -I {} sh -c 'cd {} && npm install'
```

## Combine with grep

```bash
grep -rl "TODO" . | xargs sed -i 's/TODO/DONE/g'
```

## Show commands before executing

```bash
ls *.txt | xargs -t rm
```

## Maximum line length

```bash
find . -type f | xargs -s 1000 ls -l
```
