---
title: "History & Command Recall"
description: "Navigate, search, and reuse command history efficiently."
date: "2025-11-29"
tags: ["history", "bash", "shell"]
category: "Tools"
---

## View history

```bash
history
history 20  # Last 20 commands
```

## Execute from history

```bash
!number     # Execute command number
!-2         # Execute 2 commands ago
!!          # Repeat last command
sudo !!     # Run last command with sudo
```

## Search history

```bash
Ctrl+R      # Reverse search
Ctrl+R again # Next match
Ctrl+G      # Cancel search
```

## Search by string

```bash
!string     # Last command starting with string
!?string    # Last command containing string
```

## Execute and print

```bash
!number:p   # Print command#number without executing
!!:p        # Print last command
```

## Clear history

```bash
history -c  # Clear session history
> ~/.bash_history  # Clear history file
```

## Delete specific entry

```bash
history -d number
```

## History size

```bash
# In ~/.bashrc
HISTSIZE=10000        # Commands in memory
HISTFILESIZE=20000    # Commands in file
```

## Ignore duplicates

```bash
# In ~/.bashrc
HISTCONTROL=ignoredups          # Ignore consecutive duplicates
HISTCONTROL=ignorespace         # Ignore commands starting with space
HISTCONTROL=ignoreboth          # Both of the above  
```

## Ignore specific commands

```bash
# In ~/.bashrc
HISTIGNORE="ls:cd:pwd:exit:date"
```

## Timestamp

```bash
# In ~/.bashrc
HISTTIMEFORMAT="%Y-%m-%d %H:%M:%S  "

# View
history
```

## Preserve history

```bash
# In ~/.bashrc
shopt -s histappend  # Append to history file
PROMPT_COMMAND="history -a"  # Save after each command
```

## Word designators

```bash  
!!:0        # Command
 !!:1        # First argument
!!:$        # Last argument
!!:*        # All arguments
!!:2-4      # Arguments 2-4
```

## Quick substitution

```bash
^old^new    # Replace first occurrence
!!:gs/old/new  # Replace all occurrences
```

## Previous command arguments

```bash
!$          # Last argument of previous command
!^          # First argument of previous command
!*          # All arguments of previous command
Alt+.       # Insert last argument (repeat for older)
```

## Search history file

```bash
grep "pattern" ~/.bash_history
cat ~/.bash_history | grep ssh
```

## Save current session

```bash
history -a  # Append current session to history file
history -w  # Write entire history to file
```

## Reload history

```bash
history -r  # Read history file into current session
```

## Multiple sessions

```bash
# In ~/.bashrc - sync all sessions
shopt -s histappend
PROMPT_COMMAND="${PROMPT_COMMAND:+$PROMPT_COMMAND$'\n'}history -a; history -c; history -r"
```

## Export history

```bash
history > my_commands.txt
```

## Analyze history

```bash
# Most used commands
history | awk '{print $2}' | sort | uniq -c | sort -rn | head -10

# Commands by hour
history | grep "$(date +%Y-%m-%d)" | cut -c 8-9 | sort | uniq -c
```

## FC command (edit and execute)

```bash
fc          # Edit last command in $EDITOR
fc 100 105  # Edit commands 100-105
fc -l       # List recent commands
fc -s old=new 100  # Substitute and execute
```

## Keyboard shortcuts

```
Ctrl+R      Reverse search
Ctrl+S      Forward search  
Ctrl+P      Previous command (↑)
Ctrl+N      Next command (↓)
Ctrl+A      Beginning of line
Ctrl+E      End of line
Ctrl+U      Clear line before cursor
Ctrl+K      Clear line after cursor
Alt+.       Last argument
Alt+B       Back one word
Alt+F       Forward one word
```

## History expansion

```bash
!!          # Last command
!-n         # n commands ago
!string     # Last command starting with string
!?string?   # Last command containing string
^str1^str2  # Quick substitution
!#          # Entire current command line
```

## Practical examples

### Repeat with modification

```bash
# Original
git commit -m "message"

# Repeat withchange
^commit^push
# Executes: git push -m "message"
```

### Use previous arguments

```bash
cat /very/long/path/file.txt
vim !$
# Opens: vim /very/long/path/file.txt
```

### Fix recent command

```bash
systemctl status nginx
# Oops, need sudo
sudo !!
```

### Build on previous

```bash
cd /var/log
ls !$  # ls /var/log
```

## Best practices

```bash
# ~/.bashrc
HISTSIZE=50000
HISTFILESIZE=100000
HISTCONTROL=ignoreboth
HISTIGNORE="ls:ll:cd:pwd:clear:history"
HISTTIMEFORMAT="%F %T "
shopt -s histappend
PROMPT_COMMAND="history -a"
```

## Troubleshooting

### History not saving

```bash
# Check permissions
ls -la ~/.bash_history

# Fix
chmod 600 ~/.bash_history

# Check HISTFILE
echo $HISTFILE
```

### Lost history

```bash
# Check if file exists
cat ~/.bash_history

# Restore from backup
cp ~/.bash_history.bak ~/.bash_history
```
