---
title: "Asciinema Terminal Recording"
description: "Record and share terminal sessions with asciinema."
date: "2025-11-09"
tags: ["asciinema", "recording", "terminal"]
category: "Tools"
---

## Install asciinema

```bash
# Ubuntu/Debian
sudo apt install asciinema

# macOS
brew install asciinema

# Python pip
pip3 install asciinema
```

## Start recording

```bash
asciinema rec
```

## Stop recording

Press `Ctrl+D` or type `exit`

## Save to file

```bash
asciinema rec demo.cast
```

## Upload to asciinema.org

```bash
asciinema rec
# Press Ctrl+D when done
# Link will be provided
```

## Record with title

```bash
asciinema rec -t "My Demo"
```

## Append to existing recording

```bash
asciinema rec --append demo.cast
```

## Playback recording

```bash
asciinema play demo.cast
```

## Playback from URL

```bash
asciinema play https://asciinema.org/a/123456
```

## Playback at different speed

```bash
asciinema play -s 2 demo.cast  # 2x speed
asciinema play -s 0.5 demo.cast  # 0.5x speed
```

## Limit idle time

```bash
asciinema rec -i 2 demo.cast  # Max 2 seconds idle
```

## Set terminal size

```bash
asciinema rec --cols 80 --rows 24 demo.cast
```

## Add command to recording

```bash
asciinema rec -c "bash -l"
```

## Overwrite existing file

```bash
asciinema rec --overwrite demo.cast
```

## Upload existing recording

```bash
asciinema upload demo.cast
```

## Authentication

```bash
# Link account
asciinema auth
```

## Convert to GIF

Using agg (asciinema's official converter):

```bash
# Install agg
cargo install --git https://github.com/asciinema/agg

# Convert
agg demo.cast demo.gif
```

Using asciicast2gif:

```bash
# Install
npm install -g asciicast2gif

# Convert
asciicast2gif demo.cast demo.gif
```

## Embed in webpage

```html
<script src="https://asciinema.org/a/123456.js" id="asciicast-123456" async></script>
```

## Self-hosted player

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" type="text/css" href="/asciinema-player.css" />
</head>
<body>
  <div id="demo"></div>
  <script src="/asciinema-player.min.js"></script>
  <script>
    AsciinemaPlayer.create('/demo.cast', document.getElementById('demo'));
  </script>
</body>
</html>
```

## Player options

```javascript
AsciinemaPlayer.create('/demo.cast', document.getElementById('demo'), {
  cols: 80,
  rows: 24,
  autoPlay: true,
  preload: true,
  loop: true,
  startAt: 5,  // Start at 5 seconds
  speed: 1.5,  // 1.5x speed
  idleTimeLimit: 2,
  theme: 'monokai',
  poster: 'npt:0:05'  // Poster at 5 seconds
});
```

## Configuration file

Create `~/.config/asciinema/config`:

```ini
[api]
token = your-api-token

[record]
command = /bin/bash -l
maxwait = 2
yes = true
quiet = true

[play]
maxwait = 1
speed = 1.0
```

## Environment variable

```bash
export ASCIINEMA_CONFIG_HOME=~/.config/asciinema
```

## Record specific command

```bash
asciinema rec -c "htop" demo.cast
```

## Auto-upload

```bash
asciinema rec --yes
```

## Use titles in terminal

```bash
#!/bin/bash
echo -e  "\033]0;Demo Title\007"
# Your commands here
```

## Complete demo script

```bash
#!/bin/bash

# Clear screen
clear

# Add delays between commands
sleep 1

echo "# Installing nginx"
sleep 1
sudo apt install nginx

sleep 2

echo "# Starting nginx"
sudo systemctl start nginx

sleep 1

echo "# Checking status"
sudo systemctl status nginx --no-pager

sleep 2

echo "# Done!"
```

Record it:
```bash
asciinema rec -c "./demo.sh" demo.cast
```

## Tips for great recordings

```bash
# 1. Set standard terminal size
asciinema rec --cols 80 --rows 24

# 2. Limit idle time
asciinema rec -i 2

# 3. Use clear font
# Set in terminal preferences

# 4. Add explanatory echos
echo "# Installing dependencies..."
apt install package

# 5. Use sleep for pacing
sleep 1  # Pause 1 second

# 6. Clean terminal before recording
clear
```

## Edit recordings

Using asciinema-edit:

```bash
# Install
cargo install --git https://github.com/cirocosta/asciinema-edit

# Cut from 5s to 10s
asciinema-edit cut --start 5 --end 10 input.cast output.cast

# Change speed
asciinema-edit speed --factor 2 input.cast output.cast

# Quantize (remove tiny delays)
asciinema-edit quantize input.cast output.cast
```

## Convert to SVG

```bash
# Using svg-term-cli
npm install -g svg-term-cli

# Convert
svg-term --in demo.cast --out demo.svg
```

## Alternatives to asciinema

```bash
# ttyrec
ttyrec recording.tty
# ... commands ...
# Ctrl+D

ttyplay recording.tty

# script (built-in)
script recording.txt
# ... commands ...
# Ctrl+D

# terminalizer
npm install -g terminalizer
terminalizer record demo
terminalizer play demo
terminalizer render demo
```

## Use cases

```bash
# 1. Tutorial creation
asciinema rec tutorial.cast

# 2. Bug reproduction
asciinema rec bug-report.cast

# 3. CI/CD demos
asciinema rec deployment-demo.cast

# 4. Documentation
# Embed in docs with asciinema player

# 5. Training materials
asciinema rec training-session.cast
```

## Batch processing

```bash
#!/bin/bash

for script in demos/*.sh; do
    name=$(basename "$script" .sh)
    asciinema rec -c "$script" "recordings/${name}.cast"
done
```

## API usage

```bash
# Upload programmatically
curl -u "your-token:" \
  -F "asciicast=@demo.cast" \
  https://asciinema.org/api/asciicasts
```
