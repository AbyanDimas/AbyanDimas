---
title: "Vim Survival Guide"
description: "Essential Vim commands to edit files without panic-quitting."
date: "2025-08-29"
tags: ["vim", "editor", "cli"]
category: "Tools"
---

## Open file

```bash
vim file.txt
```

## Exit Vim (without saving)

```vim
:q!
```

## Save and exit

```vim
:wq
```

Or simply:

```vim
:x
```

## Save without exiting

```vim
:w
```

## Enter Insert mode

Press `i` (insert before cursor) or `a` (append after cursor).

## Exit Insert mode

Press `Esc`.

## Delete a line

In Normal mode: `dd`

## Undo

```vim
u
```

## Redo

```vim
Ctrl+r
```

## Search for text

```vim
/search_term
```

Press `n` for next match, `N` for previous.

## Replace text

Replace "old" with "new" in entire file:

```vim
:%s/old/new/g
```

## Go to line number

```vim
:42
```

## Copy (yank) line

```vim
yy
```

## Paste

```vim
p
```

## Delete from cursor to end of line

```vim
d$
```

## Show line numbers

```vim
:set number
```
