---
title: "Midnight Commander File Manager"
description: "Navigate and manage files with Midnight Commander (mc) text-based interface."
date: "2025-11-23"
tags: ["mc", "midnight-commander", "filemanager"]
category: "Tools"
---

## Install

```bash
sudo apt install mc
```

## Launch

```bash
mc
```

## Navigation

- `Tab` - Switch panels
- `Enter` - Enter directory / Execute file
- `Ins` - Select/deselect file
- `*` - Invert selection
- `+` - Select by pattern
- `\` - Deselect by pattern

## Function keys

-  `F1` - Help
- `F2` - User menu
- `F3` - View file
- `F4` - Edit file
- `F5` - Copy
- `F6` - Move/Rename
- `F7` - Create directory
- `F8` - Delete
- `F9` - Menu
- `F10` - Exit

## Quick commands

- `Ctrl+O` - Show/hide panels (shell)
- `Ctrl+U` - Swap panels
- `Ctrl+\` - Directory hotlist
- `Alt+,` - Switch MC layout
- `Alt+.` - Show hidden files
- `Alt+Shift+?` - Find file

## File operations

### Copy

1. Select files (`Ins`)
2. Press `F5`
3. Choose destination
4. Enter

### Move

1. Select files
2. Press `F6`
3. Choose destination
4. Enter

### Delete

1. Select files
2. Press `F8`
3. Confirm

## View file (F3)

- `F3` again - Raw/Parsed view
- `F4` - Editor
- `F7` - Search
- `F8` or `q` - Quit viewer
- Space - Page down
- `b` - Page up

## Edit file (F4)

- Uses `mcedit` by default
- `F2` - Save
- `F6` - Save as
- `F10` - Quit
- `Shift+F3` - Mark text
- `F3` - Copy
- `F5` - Copy to clipboard
- `F6` - Move
- `F8` - Delete marked

## Panels

### Sort order

- `Ctrl+F3` - Sort by name
- `Ctrl+F4` - Sort by extension  
- `Ctrl+F5` - Sort by date
- `Ctrl+F6` - Sort by size

### Display modes

- `Alt+T` - List mode
- `Alt+F` - Full mode
- `Alt+B` - Brief mode

## Virtual File System (VFS)

### Browse archives

Navigate into:
- `.tar.gz`
- `.zip`
- `.rpm`
- `.deb`

Extract files normally with F5/F6

### FTP

`F9` → Right/Left → FTP link
Or: `cd ftp://user@server/path`

### SSH/SFTP

```
cd sh://user@server/path
cd sftp://user@server/path
```

## Command line

- `Ctrl+Enter` - Copy filename to command line
- `Alt+Enter` - Copy full path to command line
- `Alt+Tab` - Auto-complete
- `Ctrl+X T` - Copy selected names
- `Ctrl+X Ctrl+T` - Copy opposite panel names

## Search

`Alt+?` or `Esc` then `?`

- By name pattern
- By content
- Set search scope

## User menu (F2)

Create `~/.config/mc/menu`:

```
+ t r
1   View file
	cat %f | less

+ t r
2   Edit with vim
	vim %f

+ t d
3   Compress directory
	tar -czf %d.tar.gz %d
```

## Subshell

`Ctrl+O` - Toggle panels

Run commands, then `Ctrl+O` to return to mc

## Configuration

Files in `~/.config/mc/`:

- `mc.ini` - Main config
- `panels.ini` - Panel settings
- `menu` - User menu
- `hotlist` - Directory hotlist

## Hotlist

- `Ctrl+\` - Show hotlist
- Add current dir to hotlist in menu

## Compare

directories

1. Both panels showing desired dirs
2. `Ctrl+X D` - Compare directories
3. Shows differences

## Tips

```bash
# Start in specific directory
mc /var/log

# Start in two directories
mc /etc /var/log

# Disable mouse
mc -d

# Use  skin
mc -S <skin-name>

# List skins
ls /usr/share/mc/skins/
```

## Keyboard shortcuts summary

```
Tab         - Switch panels
Ins         - Select file
F3          - View
F4          - Edit
F5          - Copy
F6          - Move
F7          - Mkdir
F8          - Delete
F9          - Menu
F10         - Exit
Ctrl+O      - Shell
Ctrl+\      - Hotlist
Alt+.       - Hidden files
Alt+?       - Find file
```
