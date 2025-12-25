---
title: "Tmux Terminal Multiplexer"
description: "Manage multiple terminal sessions with tmux."
date: "2025-09-06"
tags: ["tmux", "terminal", "productivity"]
category: "Tools"
---

## Start new session

```bash
tmux
```

## Start named session

```bash
tmux new -s mysession
```

## List sessions

```bash
tmux ls
```

## Attach to session

```bash
tmux attach -t mysession
```

Or just:

```bash
tmux a
```

## Detach from session

Press `Ctrl+b`, then `d`

## Kill session

```bash
tmux kill-session -t mysession
```

## Split pane horizontally

Press `Ctrl+b`, then `"`

## Split pane vertically

Press `Ctrl+b`, then `%`

## Navigate between panes

Press `Ctrl+b`, then arrow keys

## Close current pane

```bash
exit
```

Or press `Ctrl+d`

## Create new window

Press `Ctrl+b`, then `c`

## Switch to next window

Press `Ctrl+b`, then `n`

## Switch to previous window

Press `Ctrl+b`, then `p`

## Rename current window

Press `Ctrl+b`, then `,`

## List all windows

Press `Ctrl+b`, then `w`

## Scroll mode (copy mode)

Press `Ctrl+b`, then `[`

Press `q` to exit scroll mode.

## Resize pane

Press `Ctrl+b`, then hold `Ctrl` and use arrow keys.

## Reload tmux config

```bash
tmux source-file ~/.tmux.conf
```
