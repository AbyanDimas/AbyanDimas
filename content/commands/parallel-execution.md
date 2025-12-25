---
title: "GNU Parallel Command Execution"
description: "Execute commands in parallel for maximum performance with GNU Parallel."
date: "2025-10-11"
tags: ["parallel", "performance", "bash"]
category: "Tools"
---

## Install GNU Parallel

```bash
# Ubuntu/Debian
sudo apt install parallel

# macOS
brew install parallel
```

## Basic parallel execution

```bash
parallel echo ::: arg1 arg2 arg3
```

## Read from stdin

```bash
cat urls.txt | parallel curl -O {}
```

## Multiple jobs

```bash
parallel -j 4 command ::: arg1 arg2 arg3 arg4
```

## All CPU cores

```bash
parallel -j0 command ::: args
```

## Half of CPU cores

```bash
parallel -j50% command ::: args
```

## Process files

```bash
parallel gzip ::: *.txt
```

## With arguments

```bash
parallel convert {} -resize 50% resized/{} ::: *.jpg
```

## Multiple input sources

```bash
parallel echo {1} {2} ::: A B C ::: 1 2 3
```

## Dry run

```bash
parallel --dry-run command ::: args
```

## Show progress

```bash
parallel --progress command ::: args
```

## ETA display

```bash
parallel --eta command ::: args
```

## Verbose output

```bash
parallel -v command ::: args
```

## Keep order

```bash
parallel -k command ::: args
```

## Timeout per job

```bash
parallel --timeout 10 command ::: args
```

## Retry failed jobs

```bash
parallel --retries 3 command ::: args
```

## Download multiple files

```bash
cat urls.txt | parallel -j 5 wget {}
```

## Compress files in parallel

```bash
parallel gzip ::: *.log
```

## Convert images

```bash
parallel convert {} -resize 800x600 resized/{} ::: *.jpg
```

## Process directories

```bash
find . -type d | parallel 'cd {} && npm install'
```

## Run multiple commands

```bash
parallel ::: "make clean" "make test" "make build"
```

## SSH to multiple servers

```bash
parallel -S server1,server2,server3 'hostname' ::: 1
```

## Complex example with function

```bash
export -f process_file
process_file() {
    echo "Processing $1"
    # Your processing logic
}
parallel process_file ::: *.txt
```

## Progress bar with number of jobs

```bash
parallel --bar command ::: args
```

## Log output

```bash
parallel --joblog jobs.log command ::: args
```

## Resume from log

```bash
parallel --resume --joblog jobs.log command ::: args
```

## Results directory

```bash
parallel --results results/ command ::: args
```

## Compress output

```bash
parallel --compress command ::: args
```

## Pipe mode

```bash
cat large_file.txt | parallel --pipe grep "pattern"
```

## Block size for pipe

```bash
cat file.txt | parallel --pipe --block 10M grep "pattern"
```

## Combining with find

```bash
find . -name "*.log" | parallel gzip {}
```

## XArgs replacement

```bash
# Instead of:
find . -name "*.txt" | xargs rm

# Use:
find . -name "*.txt" | parallel rm {}
```

## Load regulation

```bash
parallel --load 80% command ::: args
```

## Limit memory usage

```bash
parallel --memfree 1G command ::: args
```

## Round robin distribution

```bash
parallel --round-robin command ::: args
```

## Quote special characters

```bash
parallel -q command "arg with spaces" ::: more args
```

## Null separator (for filenames with spaces)

```bash
find . -name "*.txt" -print0 | parallel -0 echo {}
```

## Template replacement

```bash
parallel mv {} backup/{.}.bak ::: *.txt
```

Replacement strings:
- `{}` - Full input
- `{.}` - Input without extension
- `{/}` - Basename
- `{//}` - Directory
- `{/.}` - Basename without extension
