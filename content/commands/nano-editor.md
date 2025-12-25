---
title: "Nano Text Editor Basics"
description: "Essential nano editor commands for quick file editing."
date: "2025-11-01"
tags: ["nano", "editor", "text"]
category: "Tools"
---

## Open file

```bash
nano filename.txt
```

## Create new file

```bash
nano newfile.txt
```

## Open at specific line

```bash
nano +10 filename.txt
```

## Basic navigation

- `Arrow keys` - Move cursor
- `Page Up` / `Page Down` - Scroll page
- `Ctrl+A` - Beginning of line
- `Ctrl+E` - End of line
- `Ctrl+Y` - Page up
- `Ctrl+V` - Page down

## Go to line/column

- `Ctrl+_` - Go to line number
- `Alt+G` - Go to line number (same)

## Save file

- `Ctrl+O` - Write Out (save)
- Enter to confirm filename

## Save as

- `Ctrl+O` - Write Out
- Type new filename
- Enter to save

## Exit nano

- `Ctrl+X` - Exit
- If unsaved changes, it will ask to save

## Cut and paste

- `Ctrl+K` - Cut current line
- `Alt+6` - Copy current line
- `Ctrl+U` - Paste

##Mark text for copy/cut

- `Alt+A` - Start marking
- Move cursor to select
- `Ctrl+K` - Cut marked text
- `Alt+6` - Copy marked text

## Delete

- `Ctrl+D` - Delete character under cursor
- `Backspace` - Delete character before cursor
- `Ctrl+K` - Delete (cut) entire line

## Undo/Redo

- `Alt+U` - Undo
- `Alt+E` - Redo

## Search

- `Ctrl+W` - Where Is (search)
- Type search term
- Enter to find

## Search next

- `Ctrl+W` then `Ctrl+W` - Find next
- `Alt+W` - Find next occurrence

## Search and replace

- `Ctrl+\` - Replace
- Enter search term
- Enter replacement text
- Choose: `Y` (yes), `N` (no), `A` (all)

## Show line numbers

- `Alt+#` - Toggle line numbers

## Enable/disable wrapping

- `Alt+L` - Toggle line wrapping

## Spell check

- `Ctrl+T` - To Spell
- Requires `spell` package installed

## Help

- `Ctrl+G` - Get Help

## Insert file

- `Ctrl+R` - Read File (insert file contents)

## Cut to end of line

- `Ctrl+K` - Cut from cursor to end of line

## Justify paragraph

- `Ctrl+J` - Justify current paragraph

## Show cursor position

- `Ctrl+C` - Display cursor position

## Refresh screen

- `Ctrl+L` - Refresh/redraw screen

## Enable mouse

```bash
nano -m filename.txt
```

Or in nano: `Alt+M`

## Syntax highlighting

Nano auto-detects file type. Force specific syntax:

```bash
nano -Y python script.py
```

## Convert tabs to spaces

```bash
nano -E filename.txt
```

Or set in `~/.nanorc`:
```
set tabstospaces
set tabsize 4
```

## Show all files in open dialog

When doing `Ctrl+R`, press `Ctrl+T` to browse files

## Edit as sudo

```bash
sudo nano /etc/hosts
```

## Configuration file

Create/edit `~/.nanorc`:

```nanorc
set linenumbers
set tabsize 4
set tabstospaces
set autoindent
set mouse
set smooth
```

## Common .nanorc options

```nanorc
set linenumbers         # Show line numbers
set tabsize 4          # Tab width
set tabstospaces       # Convert tabs to spaces
set autoindent         # Auto indent new lines
set smooth             # Smooth scrolling
set mouse              # Enable mouse
set nowrap             # Don't wrap long lines
set morespace          # Use blank line below title bar
set suspend            # Allow Ctrl+Z to suspend
set backup             # Create backup~
set backupdir "~/nano_backups"  # Backup directory
```

## Syntax highlighting colors

Add to `~/.nanorc`:

```nanorc
include "/usr/share/nano/*.nanorc"
```

## Multi-file editing

```bash
nano file1.txt file2.txt file3.txt
```

Switch between files:
- `Alt+<` - Previous file
- `Alt+>` - Next file

## Create backup before save

Add to `~/.nanorc`:
```nanorc
set backup
set backupdir "~/nano_backups"
```

## Quick shortcuts summary

```
Ctrl+O - Save
Ctrl+X - Exit
Ctrl+K - Cut line
Ctrl+U - Paste
Ctrl+W - Search
Ctrl+\ - Replace
Ctrl+_ - Go to line
Alt+U  - Undo
Alt+E  - Redo
Alt+A  - Mark text
Ctrl+G - Help
```

## View file readonly

```bash
nano -v filename.txt
```

## Convert DOS/Windows line endings

- `Alt+D` - Toggle DOS format
- `Alt+M` - Toggle Mac format

## Nano vs vim

Nano advantages:
- Easier to learn
- Clear on-screen help
- No modes to manage
- Better for quick edits

Use nano when:
- Quick configuration edits
- New users
- Simple text files
- Remote server work

## Emergency recovery

If nano crashes:
- Look for `filename.txt.save` in same directory
- Contains unsaved changes

## Pipe output to nano

```bash
ls -la | nano -
```

## Use as diff viewer

```bash
diff file1.txt file2.txt | nano -
```

## Quick edit alias

Add to `~/.bashrc`:
```bash
alias edit='nano'
alias  snano='sudo nano'
```
