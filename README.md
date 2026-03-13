# FrameSeek

A React + Vite + TypeScript demo of Netflix-style video timeline preview frames — powered by pre-generated sprite sheets and Vercel Blob Storage.

Hover the scrubber to see thumbnail previews of any timestamp, even before the video loads.

## How It Works

See [HOW_IT_WORKS.md](./HOW_IT_WORKS.md) for a full technical explainer.

## Getting Started

```bash
npm install
```

### Upload your video assets

1. Place your files in `scripts/assets/`:
   - `video.mp4` — your video file
   - `sprites.jpg` — pre-generated sprite sheet (see HOW_IT_WORKS.md for FFmpeg command)
   - `sprites.vtt` — WebVTT thumbnail file mapping timestamps to sprite positions

2. Set `BLOB_READ_WRITE_TOKEN` in `.env.local` (get it from Vercel dashboard → Storage → Blob)

3. Upload:
   ```bash
   npx tsx scripts/upload-assets.ts
   ```

4. Copy the printed `VIDEO_URL`, `SPRITE_URL`, `VTT_URL` values into `.env.local`

### Run locally

```bash
npm run dev
```

### Deploy

```bash
npx vercel --prod
```

Set `VIDEO_URL`, `SPRITE_URL`, `VTT_URL` as environment variables in your Vercel project settings.

## Tech Stack

- React 19 + Vite + TypeScript
- Tailwind CSS v4
- Vercel Blob Storage
- Vitest + @testing-library/react
