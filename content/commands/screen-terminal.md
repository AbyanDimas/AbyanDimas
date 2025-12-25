---
title: "Screen Terminal Multiplexer"
description: "GNU Screen commands for managing persistent terminal sessions."
date: "2025-09-12"
tags: ["screen", "terminal", "productivity"]
category: "Tools"
---

## Start new screen session

```bash
screen
```

## Start named session

```bash
screen -S mysession
```

## List running sessions

```bash
screen -ls
```

## Reattach to session

```bash
screen -r mysession
```

## Detach from session

Press `Ctrl+a`, then `d`

## Kill current session

Press `Ctrl+a`, then `k`, then `y` to confirm

## Kill session from outside

```bash
screen -X -S mysession quit
```

## Create new window

Press `Ctrl+a`, then `c`

## Switch to next window

Press `Ctrl+a`, then `n`

## Switch to previous window

Press `Ctrl+a`, then `p`

## Switch to window by number

Press `Ctrl+a`, then `0-9`

## List all windows

Press `Ctrl+a`, then `"`

## Rename current window

Press `Ctrl+a`, then `A`

## Split screen horizontally

Press `Ctrl+a`, then `S`

## Split screen vertically

Press `Ctrl+a`, then `|`

## Switch between splits

Press `Ctrl+a`, then `Tab`

## Close current split

Press `Ctrl+a`, then `X`

## Close all splits except current

Press `Ctrl+a`, then `Q`

## Enable logging

Press `Ctrl+a`, then `H`

## Reattach to detached session

```bash
screen -d -r mysession
```
