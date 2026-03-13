# How FrameSeek Works

A developer-focused explainer of the sprite-based timeline preview technique.

---

## The Problem

When a video is large or on a slow connection, the browser has no frame data until it buffers enough of the file. The native `<video>` scrubber can't show you what's at 1:30 until it has downloaded that portion of the video.

Netflix, YouTube, and Vimeo all solve this with **pre-generated thumbnail sprite sheets** — and that's exactly what FrameSeek demonstrates.

---

## What Is a Sprite Sheet?

A sprite sheet is a single image file containing many smaller images arranged in a grid.

```
┌──────────┬──────────┬──────────┬──────────┐
│ 0:00–10s │ 0:10–20s │ 0:20–30s │ 0:30–40s │  ← Row 0
├──────────┼──────────┼──────────┼──────────┤
│ 0:40–50s │ 0:50–60s │ 1:00–10s │ 1:10–20s │  ← Row 1
└──────────┴──────────┴──────────┴──────────┘
```

Each tile is 160×90 px (16:9 ratio). The browser loads **one image** instead of hundreds of individual frames — much faster, and it works before the video loads at all.

---

## What Is a WebVTT Thumbnail File?

A `.vtt` (WebVTT) file maps each timestamp to a tile's position in the sprite sheet:

```
WEBVTT

00:00:00.000 --> 00:00:10.000
sprites.jpg#xywh=0,0,160,90

00:00:10.000 --> 00:00:20.000
sprites.jpg#xywh=160,0,160,90

00:00:20.000 --> 00:00:30.000
sprites.jpg#xywh=320,0,160,90
```

The `#xywh=x,y,width,height` fragment tells the browser exactly which pixel rectangle to use. The `useSpritePreview` hook parses this file and builds a lookup table.

---

## Why Not Use Canvas?

A common approach is to use `<canvas>` to capture a frame from the `<video>` element:

```js
canvas.drawImage(videoElement, 0, 0)
```

This only works **after the video has buffered that timestamp**. On a slow connection or before playback, calling `seek()` just shows a black frame. This doesn't solve the problem.

Sprite sheets solve it because they're **independent of the video file entirely**.

---

## The FFmpeg Command

Run this once on your video file to generate the sprite sheet:

```bash
ffmpeg -i video.mp4 -vf "fps=1/10,scale=160:90,tile=10x100" -frames:v 1 sprites.jpg
```

**Flag breakdown:**
- `fps=1/10` — extract 1 frame every 10 seconds
- `scale=160:90` — resize each frame to 160×90 px (16:9)
- `tile=10x100` — arrange frames in a 10-column, 100-row grid (supports up to 1,000 frames = ~2.8 hours of video)
- `-frames:v 1` — output a single image (the complete sprite sheet)

---

## Generating the VTT File

Each 10-second interval maps to a tile. Tile position is:

```
column = frameIndex % 10
row    = Math.floor(frameIndex / 10)

x = column × 160
y = row    × 90
```

For a 2-minute video (12 frames):

| Time | Frame | Col | Row | xywh |
|------|-------|-----|-----|------|
| 0–10s | 0 | 0 | 0 | 0,0,160,90 |
| 10–20s | 1 | 1 | 0 | 160,0,160,90 |
| 20–30s | 2 | 2 | 0 | 320,0,160,90 |

---

## How Vercel Blob Fits In

Vercel Blob is an object storage service that gives each file a public HTTPS URL. All three assets (`video.mp4`, `sprites.jpg`, `sprites.vtt`) are uploaded once using `scripts/upload-assets.ts`.

The returned URLs are stored as environment variables and returned server-side via `/api/blob-config`. This means:
- The `BLOB_READ_WRITE_TOKEN` is never exposed to the browser
- URLs are cached at the edge (`Cache-Control: s-maxage=86400`)

---

## The Full Request Flow

1. Browser opens the app
2. React mounts → `fetch('/api/blob-config')` → gets `{ videoUrl, spriteUrl, vttUrl }`
3. `<video src={videoUrl}>` begins loading (may be slow)
4. `useSpritePreview(vttUrl)` fetches the VTT file (small, fast) → parses into a lookup table
5. User hovers the timeline at 35% of a 2-minute video
6. `hoverTime = 0.35 × 120 = 42s`
7. `getFrame(42)` → finds cue covering 40–50s → `SpriteRect { x: 640, y: 0, w: 160, h: 90 }`
8. `SpritePreview` renders `background-position: -640px 0px` on the sprite image
9. **Preview frame appears instantly** — the video may still be buffering
