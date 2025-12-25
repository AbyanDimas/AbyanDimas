---
title: "FFmpeg Media Processing"
description: "Convert, compress, and manipulate video and audio files with FFmpeg."
date: "2025-10-21"
tags: ["ffmpeg", "video", "audio"]
category: "Tools"
---

## Convert video format

```bash
ffmpeg -i input.mp4 output.avi
```

## Change codec

```bash
ffmpeg -i input.mp4 -c:v libx264 -c:a aac output.mp4
```

## Compress video

```bash
ffmpeg -i input.mp4 -vcodec libx265 -crf 28 output.mp4
```

## Extract audio

```bash
ffmpeg -i video.mp4 -vn -acodec copy audio.aac
```

## Remove audio

```bash
ffmpeg -i input.mp4 -an output.mp4
```

## Merge video and audio

```bash
ffmpeg -i video.mp4 -i audio.mp3 -c copy output.mp4
```

## Trim video

```bash
ffmpeg -i input.mp4 -ss 00:00:10 -t 00:00:30 -c copy output.mp4
```

## Resize video

```bash
ffmpeg -i input.mp4 -vf scale=1280:720 output.mp4
```

## Maintain aspect ratio

```bash
ffmpeg -i input.mp4 -vf scale=1280:-1 output.mp4
```

## Change frame rate

```bash
ffmpeg -i input.mp4 -r 30 output.mp4
```

## Change bitrate

```bash
ffmpeg -i input.mp4 -b:v 1M output.mp4
```

## Create GIF from video

```bash
ffmpeg -i input.mp4 -vf "fps=10,scale=320:-1" output.gif
```

## Extract frames

```bash
ffmpeg -i input.mp4 -vf fps=1 frame_%04d.png
```

## Create video from images

```bash
ffmpeg -framerate 30 -pattern_type glob -i '*.jpg' -c:v libx264 output.mp4
```

## Add watermark

```bash
ffmpeg -i input.mp4 -i watermark.png -filter_complex "overlay=10:10" output.mp4
```

## Rotate video

```bash
# 90 degrees clockwise
ffmpeg -i input.mp4 -vf "transpose=1" output.mp4

# 180 degrees
ffmpeg -i input.mp4 -vf "transpose=2,transpose=2" output.mp4
```

## Flip video

```bash
# Horizontal flip
ffmpeg -i input.mp4 -vf hflip output.mp4

# Vertical flip
ffmpeg -i input.mp4 -vf vflip output.mp4
```

## Concatenate videos

Create `list.txt`:
```
file 'video1.mp4'
file 'video2.mp4'
file 'video3.mp4'
```

```bash
ffmpeg -f concat -safe 0 -i list.txt -c copy output.mp4
```

## Convert to MP3

```bash
ffmpeg -i input.wav -c:a libmp3lame -b:a 192k output.mp3
```

## Normalize audio

```bash
ffmpeg -i input.mp3 -af loudnorm output.mp3
```

## Remove silence

```bash
ffmpeg -i input.mp3 -af silenceremove=1:0:-50dB output.mp3
```

## Speed up/slow down

```bash
# 2x speed
ffmpeg -i input.mp4 -filter:v "setpts=0.5*PTS" output.mp4

# 0.5x speed
ffmpeg -i input.mp4 -filter:v "setpts=2*PTS" output.mp4
```

## Record screen (Linux)

```bash
ffmpeg -f x11grab -s 1920x1080 -i :0.0 output.mp4
```

## Record screen (macOS)

```bash
ffmpeg -f avfoundation -i "1" output.mp4
```

## Stream to RTMP

```bash
ffmpeg -re -i input.mp4 -c copy -f flv rtmp://server/live/stream
```

## Get video info

```bash
ffmpeg -i input.mp4
```

Or use ffprobe:

```bash
ffprobe -v quiet -print_format json -show_format input.mp4
```

## Take screenshot

```bash
ffmpeg -i input.mp4 -ss 00:00:05 -vframes 1 screenshot.jpg
```

## Create thumbnail

```bash
ffmpeg -i input.mp4 -vf "thumbnail" -frames:v 1 thumb.jpg
```

## Add subtitles

```bash
ffmpeg -i input.mp4 -vf subtitles=subtitles.srt output.mp4
```

## Burn subtitles permanently

```bash
ffmpeg -i input.mp4 -vf subtitles=subtitles.srt -c:a copy output.mp4
```

## Two-pass encoding

```bash
# Pass 1
ffmpeg -i input.mp4 -c:v libx264 -b:v 2M -pass 1 -f mp4 /dev/null

# Pass 2
ffmpeg -i input.mp4 -c:v libx264 -b:v 2M -pass 2 output.mp4
```

## Hardware acceleration (NVENC)

```bash
ffmpeg -hwaccel cuda -i input.mp4 -c:v h264_nvenc output.mp4
```

## Quality presets

```bash
# Ultrafast (lowest quality)
ffmpeg -i input.mp4 -preset ultrafast output.mp4

# Medium (balanced)
ffmpeg -i input.mp4 -preset medium output.mp4

# Veryslow (best quality)
ffmpeg -i input.mp4 -preset veryslow output.mp4
```

## CRF quality scale

```bash
# High quality (larger file)
ffmpeg -i input.mp4 -crf 18 output.mp4

# Balanced
ffmpeg -i input.mp4 -crf 23 output.mp4

# Lower quality (smaller file)
ffmpeg -i input.mp4 -crf 28 output.mp4
```

## Common codecs

```
Video:
- libx264  (H.264)
- libx265  (H.265/HEVC)
- libvpx   (VP8)
- libvpx-vp9 (VP9)
- libaom-av1 (AV1)

Audio:
- aac
- libmp3lame (MP3)
- libopus
- libvorbis
```
